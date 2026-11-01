import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:pathfolio/services/storage_service.dart';
import 'package:pathfolio/state/app_state.dart';
import 'package:pathfolio/models/backup_data.dart';
import 'package:pathfolio/models/opportunity.dart';
import 'package:pathfolio/models/task_item.dart';
import 'package:pathfolio/models/timeline_entry.dart';
import 'package:pathfolio/models/evidence_item.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('restore commits one snapshot and later edits retain it', () async {
    SharedPreferences.setMockInitialValues({});
    final storage = SharedPrefsStorageService();
    await storage.init();

    await storage.commitAll(
      opportunities: [],
      tasks: [],
      timeline: [],
      evidence: [],
      preferences: {'theme_mode': 'dark'},
    );

    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(SharedPrefsStorageService.keySnapshot);
    expect(raw, isNotNull);
    expect((jsonDecode(raw!) as Map<String, dynamic>)['preferences'], {
      'theme_mode': 'dark',
    });
    expect(prefs.getString(SharedPrefsStorageService.keyPreferences), isNull);

    await storage.savePreferences({'theme_mode': 'light'});
    expect(await storage.getPreferences(), {'theme_mode': 'light'});
    expect(
      (jsonDecode(prefs.getString(SharedPrefsStorageService.keySnapshot)!)
          as Map<String, dynamic>)['opportunities'],
      isEmpty,
    );
  });

  test('failed restore leaves the active workspace untouched', () async {
    final storage = _FailingCommitStorage();
    final state = AppState(storage: storage);
    await state.initialize();
    await state.createOpportunity(company: 'Keep Me', role: 'Engineer');

    final emptyBackup = BackupData(
      exportedAt: DateTime.now(),
      opportunities: [],
      tasks: [],
      timeline: [],
      evidence: [],
    );

    await expectLater(state.restoreBackup(emptyBackup), throwsStateError);
    expect(state.allOpportunities.single.company, 'Keep Me');
    expect((await storage.getOpportunities()).single.company, 'Keep Me');
  });
}

class _FailingCommitStorage extends InMemoryStorageService {
  @override
  Future<void> commitAll({
    required List<Opportunity> opportunities,
    required List<TaskItem> tasks,
    required List<TimelineEntry> timeline,
    required List<EvidenceItem> evidence,
    required Map<String, dynamic> preferences,
  }) async {
    throw StateError('Simulated storage failure');
  }
}
