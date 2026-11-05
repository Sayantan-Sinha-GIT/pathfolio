import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pathfolio/models/backup_data.dart';
import 'package:pathfolio/services/backup_file_service.dart';
import 'package:pathfolio/services/storage_service.dart';
import 'package:pathfolio/state/app_state.dart';
import 'package:pathfolio/views/settings_view.dart';

class FakeBackupFiles extends BackupFileService {
  String? selected;
  String? saved;
  bool cancelSave = false;
  bool fail = false;
  @override
  Future<String?> pick() async {
    if (fail) throw const FormatException('Invalid file');
    return selected;
  }

  @override
  Future<bool> save(String json) async {
    if (fail) throw Exception('Storage is unavailable');
    if (cancelSave) return false;
    saved = json;
    return true;
  }
}

void main() {
  late AppState state;
  setUp(() async {
    state = AppState(storage: InMemoryStorageService());
    await state.initialize();
  });

  test('cleared optional dates and URLs remain cleared after reload', () async {
    final date = DateTime(2026, 11, 6);
    final opportunity = await state.createOpportunity(
      company: 'Keep',
      role: 'Engineer',
      sourceUrl: 'https://example.com/job',
      applicationDate: date,
      nextActionDate: date,
    );
    await state.updateOpportunity(
      opportunity.copyWith(
        sourceUrl: null,
        applicationDate: null,
        nextActionDate: null,
      ),
    );
    final task = await state.addTask(
      opportunityId: opportunity.id,
      title: 'Follow up',
      dueDate: date,
    );
    await state.updateTask(task.copyWith(dueDate: null));
    final evidence = await state.addEvidence(
      title: 'Shipped project',
      skillTags: ['Flutter'],
      conciseResult: 'A result',
      sourceUrl: 'https://example.com/',
    );
    await state.updateEvidence(evidence.copyWith(sourceUrl: null));
    final reloaded = AppState(storage: state.storage);
    await reloaded.initialize();
    expect(reloaded.allOpportunities.single.sourceUrl, isNull);
    expect(reloaded.allOpportunities.single.applicationDate, isNull);
    expect(reloaded.allOpportunities.single.nextActionDate, isNull);
    expect(reloaded.allTasks.single.dueDate, isNull);
    expect(reloaded.allEvidence.single.sourceUrl, isNull);
  });

  test('reopening a task clears its completion timestamp', () async {
    final opportunity = await state.createOpportunity(
      company: 'Task',
      role: 'Engineer',
    );
    final task = await state.addTask(
      opportunityId: opportunity.id,
      title: 'Call',
    );
    await state.toggleTaskComplete(task.id);
    expect(state.allTasks.single.completedAt, isNotNull);
    await state.toggleTaskComplete(task.id);
    expect(state.allTasks.single.isCompleted, isFalse);
    expect(state.allTasks.single.completedAt, isNull);
  });

  test(
    'rapid activity produces distinct IDs and a restorable backup',
    () async {
      final opportunity = await state.createOpportunity(
        company: 'Fast',
        role: 'Engineer',
      );
      for (var i = 0; i < 20; i++) {
        final task = await state.addTask(
          opportunityId: opportunity.id,
          title: 'Task $i',
        );
        await state.toggleTaskComplete(task.id);
      }
      final result = BackupData.validateAndParse(
        state.createBackup().toFormattedJson(),
      );
      expect(result.isValid, isTrue, reason: result.errorMessage);
      expect(
        result.backupData!.timeline.map((e) => e.id).toSet().length,
        result.timelineCount,
      );
    },
  );

  test(
    'malformed backup fields never throw and never change the workspace',
    () async {
      await state.createOpportunity(company: 'Keep', role: 'Engineer');
      final mutations = <void Function(Map<String, dynamic>)>[
        (j) => j['appVersion'] = 3,
        (j) => j['exportedAt'] = 'yesterday',
        (j) => j['preferences'] = {'reduce_motion': 'false'},
        (j) => j['preferences'] = {'theme_mode': 3},
        (j) => j['opportunities'][0]['stage'] = 'invented',
        (j) => j['opportunities'][0]['sourceUrl'] = 'javascript:alert(1)',
        (j) => j['opportunities'][0]['attachedEvidenceIds'] = [4],
        (j) => j['opportunities'][0]['nextActionDate'] = 'yesterday',
        (j) => j['opportunities'].add(j['opportunities'][0]),
        (j) => j['tasks'] = [
          {'id': 'orphan', 'opportunityId': 'missing', 'title': 'Oops'},
        ],
        (j) => j.remove('tasks'),
      ];
      for (final mutate in mutations) {
        final json = state.createBackup().toJson();
        mutate(json);
        expect(BackupData.validateAndParse(jsonEncode(json)).isValid, isFalse);
        expect(state.allOpportunities.single.company, 'Keep');
      }
    },
  );

  test(
    'UTF-8 files support BOM and enforce byte size, not character count',
    () {
      expect(
        BackupFileService.decode(
          Uint8List.fromList([
            239,
            187,
            191,
            ...utf8.encode('{"name":"কলকাতা"}'),
          ]),
        ),
        '{"name":"কলকাতা"}',
      );
      expect(
        () => BackupFileService.decode(Uint8List.fromList([255])),
        throwsFormatException,
      );
      final big = '₹' * (BackupData.maxFileSizeBytes ~/ 3 + 1);
      expect(BackupData.validateAndParse(big).errorMessage, contains('10 MB'));
    },
  );

  Future<void> showSettings(WidgetTester tester, FakeBackupFiles files) async {
    await tester.binding.setSurfaceSize(const Size(320, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SettingsView(appState: state, backupFiles: files),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets(
    '320px backup controls fit and saving creates a restorable file',
    (tester) async {
      await state.createOpportunity(company: 'Backup', role: 'Engineer');
      final files = FakeBackupFiles();
      await showSettings(tester, files);
      expect(tester.takeException(), isNull);
      await tester.ensureVisible(find.text('Export JSON Backup'));
      await tester.tap(find.text('Export JSON Backup'));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('Save Backup File'));
      await tester.pumpAndSettle();
      expect(BackupData.validateAndParse(files.saved!).isValid, isTrue);
      expect(state.lastExportDate, isNotNull);
    },
  );

  testWidgets(
    'file import previews data, Cancel preserves it, Confirm replaces it',
    (tester) async {
      final backup = state.createBackup().toFormattedJson();
      await state.createOpportunity(
        company: 'Keep until confirmed',
        role: 'Engineer',
      );
      final files = FakeBackupFiles()..selected = backup;
      await showSettings(tester, files);
      await tester.ensureVisible(find.text('Open Backup File'));
      await tester.tap(find.text('Open Backup File'));
      await tester.pumpAndSettle();
      expect(find.text('Confirm Restore & Replace'), findsOneWidget);
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
      expect(state.allOpportunities, hasLength(1));
      await tester.tap(find.text('Open Backup File'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Confirm & Replace Current Data'));
      await tester.pumpAndSettle();
      expect(state.allOpportunities, isEmpty);
    },
  );

  testWidgets(
    'cancelling file selection and invalid input preserve existing data',
    (tester) async {
      await state.createOpportunity(company: 'Keep', role: 'Engineer');
      final files = FakeBackupFiles();
      await showSettings(tester, files);
      await tester.ensureVisible(find.text('Open Backup File'));
      await tester.tap(find.text('Open Backup File'));
      await tester.pumpAndSettle();
      expect(find.text('Confirm Restore & Replace'), findsNothing);
      files.fail = true;
      await tester.tap(find.text('Open Backup File'));
      await tester.pumpAndSettle();
      expect(state.allOpportunities.single.company, 'Keep');
      expect(find.textContaining('valid UTF-8 JSON backup'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
}
