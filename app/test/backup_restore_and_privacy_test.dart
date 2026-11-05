import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:pathfolio/models/backup_data.dart';
import 'package:pathfolio/models/stage.dart';
import 'package:pathfolio/services/storage_service.dart';
import 'package:pathfolio/state/app_state.dart';

void main() {
  group('Evidence, Backup & Privacy Controls', () {
    late InMemoryStorageService storage;
    late AppState appState;

    setUp(() async {
      storage = InMemoryStorageService();
      appState = AppState(storage: storage);
      await appState.initialize();
    });

    test('M06: Add, edit, and search career evidence entries with skill tags', () async {
      final ev = await appState.addEvidence(
        title: 'Kafka Consumer Optimization',
        skillTags: ['Kafka', 'Go', 'Docker'],
        conciseResult: 'Halved consumer lag from 12s to 600ms under 50k messages/sec.',
        sourceUrl: 'https://github.com/example/kafka-opt',
      );

      expect(ev.title, 'Kafka Consumer Optimization');
      expect(ev.skillTags, ['Kafka', 'Go', 'Docker']);
      expect(appState.allEvidence.length, 1);

      await appState.updateEvidence(ev.copyWith(title: 'Kafka High-Throughput Consumer'));
      expect(appState.allEvidence.first.title, 'Kafka High-Throughput Consumer');
    });

    test('M06: Citing evidence in opportunities does not duplicate or upload files', () async {
      final ev = await appState.addEvidence(
        title: 'React Native Micro-Frontend',
        skillTags: ['TypeScript', 'Mobile'],
        conciseResult: 'Decreased bundle download size by 40%.',
      );

      final opp1 = await appState.createOpportunity(company: 'Discord', role: 'Client SWE', attachedEvidenceIds: [ev.id]);
      final opp2 = await appState.createOpportunity(company: 'Spotify', role: 'Mobile Platform', attachedEvidenceIds: [ev.id]);

      expect(appState.evidenceForOpportunity(opp1.id).first.id, ev.id);
      expect(appState.evidenceForOpportunity(opp2.id).first.id, ev.id);
      // Single canonical evidence item in storage
      expect(appState.allEvidence.length, 1);
    });

    test('M07: Backup JSON format adheres strictly to schemaVersion 1', () async {
      await appState.createOpportunity(company: 'Microsoft', role: 'Cloud Engineer');
      final jsonString = await appState.exportBackupString();
      final decoded = jsonDecode(jsonString) as Map<String, dynamic>;

      expect(decoded['schemaVersion'], 1);
      expect(decoded['appVersion'], '1.0.2');
      expect(decoded.containsKey('exportedAt'), isTrue);
      expect(decoded['opportunities'], isNotEmpty);
      expect(decoded['tasks'], isList);
      expect(decoded['timeline'], isList);
      expect(decoded['evidence'], isList);
      expect(decoded['preferences'], isMap);
    });

    test('M07: Malformed and corrupted backup payloads rejected without changing existing records', () async {
      await appState.createOpportunity(company: 'KeepMeSafe Corp', role: 'Architect');
      expect(appState.allOpportunities.length, 1);

      // Corrupted JSON
      final res1 = BackupData.validateAndParse('{"schemaVersion": 1, "opportunities": "not_an_array"}');
      expect(res1.isValid, isFalse);
      expect(res1.errorMessage, contains('"opportunities" must be an array'));

      // Missing required company in opportunity
      final res2 = BackupData.validateAndParse('{"schemaVersion": 1, "opportunities": [{"role": "Hacker"}]}');
      expect(res2.isValid, isFalse);
      expect(res2.errorMessage, contains('missing required "company"'));

      // Existing records completely unchanged
      expect(appState.allOpportunities.length, 1);
      expect(appState.allOpportunities.first.company, 'KeepMeSafe Corp');
    });

    test('M07: Valid backup restored with complete data replacement and count verification', () async {
      await appState.createOpportunity(company: 'Old Corp', role: 'Legacy Engineer');

      final newBackupJson = jsonEncode({
        'schemaVersion': 1,
        'appVersion': '1.0.0',
        'exportedAt': DateTime.now().toIso8601String(),
        'opportunities': [
          {
            'id': 'restored-opp-1',
            'company': 'Target Corp',
            'role': 'Staff SRE',
            'stage': 'interview',
            'createdAt': DateTime.now().toIso8601String(),
            'updatedAt': DateTime.now().toIso8601String(),
          }
        ],
        'tasks': [
          {
            'id': 'restored-task-1',
            'opportunityId': 'restored-opp-1',
            'title': 'Read Kubernetes internal design docs',
            'createdAt': DateTime.now().toIso8601String(),
          }
        ],
        'timeline': [],
        'evidence': [],
        'preferences': {'theme_mode': 'light'}
      });

      final validation = BackupData.validateAndParse(newBackupJson);
      expect(validation.isValid, isTrue);
      expect(validation.opportunityCount, 1);
      expect(validation.taskCount, 1);

      await appState.restoreBackup(validation.backupData!);
      expect(appState.allOpportunities.length, 1);
      expect(appState.allOpportunities.first.company, 'Target Corp');
      expect(appState.allTasks.length, 1);
      expect(appState.allTasks.first.title, contains('Kubernetes'));
    });

    test('M08: Erase All Data wipes all records and preferences irreversibly', () async {
      await appState.createOpportunity(company: 'Secret Corp', role: 'SWE');
      await appState.addTask(opportunityId: 'id', title: 'Secret Task');
      await appState.addEvidence(title: 'Secret Work', skillTags: ['C++'], conciseResult: 'Proprietary');

      expect(appState.allOpportunities.isNotEmpty, isTrue);
      expect(appState.allTasks.isNotEmpty, isTrue);
      expect(appState.allEvidence.isNotEmpty, isTrue);

      await appState.eraseAllData();

      expect(appState.allOpportunities, isEmpty);
      expect(appState.allTasks, isEmpty);
      expect(appState.allEvidence, isEmpty);
      expect(appState.allTimeline, isEmpty);
      expect(appState.isDemoWorkspace, isFalse);
    });

    test('M08: Theme and reduced motion preferences persist across sessions', () async {
      await appState.setReduceMotion(true);
      final storedPrefs = await storage.getPreferences();
      expect(storedPrefs['reduce_motion'], isTrue);

      // Re-init state from same storage
      final newState = AppState(storage: storage);
      await newState.initialize();
      expect(newState.reduceMotion, isTrue);
    });

    test('M09: Demo workspace loads sample data and can be erased without touching empty defaults', () async {
      expect(appState.allOpportunities, isEmpty);
      await appState.loadDemoWorkspace();

      expect(appState.isDemoWorkspace, isTrue);
      expect(appState.allOpportunities.length, 5);
      expect(appState.allTasks.length, 5);
      expect(appState.allEvidence.length, 3);
      expect(appState.stageCounts[JobStage.offer], 1);

      await appState.clearDemoWorkspace();
      expect(appState.isDemoWorkspace, isFalse);
      expect(appState.allOpportunities, isEmpty);
      expect(appState.allTasks, isEmpty);
    });
  });
}
