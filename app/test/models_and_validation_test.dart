import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pathfolio/models/opportunity.dart';
import 'package:pathfolio/models/stage.dart';
import 'package:pathfolio/models/task_item.dart';
import 'package:pathfolio/models/backup_data.dart';
import 'package:pathfolio/services/validation_service.dart';
import 'package:pathfolio/services/storage_service.dart';
import 'package:pathfolio/state/app_state.dart';

void main() {
  group('JobStage and Models', () {
    test('JobStage parses correctly from names and display names', () {
      expect(JobStage.fromString('saved'), JobStage.saved);
      expect(JobStage.fromString('Screening'), JobStage.screening);
      expect(JobStage.fromString('interview'), JobStage.interview);
      expect(JobStage.fromString('OFFER'), JobStage.offer);
      expect(JobStage.fromString('Rejected'), JobStage.rejected);
      expect(JobStage.fromString('unknown_val'), JobStage.saved);
    });

    test('Opportunity serialization preserves all fields', () {
      final now = DateTime.now();
      final opp = Opportunity(
        id: 'opp-100',
        company: 'Stripe',
        role: 'Infrastructure Engineer',
        stage: JobStage.interview,
        sourceUrl: 'https://stripe.com/jobs/123',
        location: 'Seattle, WA',
        salaryNote: '\$140,000 / yr',
        applicationDate: now.subtract(const Duration(days: 7)),
        nextActionDate: now.add(const Duration(days: 2)),
        privateNotes: 'Prepare system design',
        isArchived: false,
        attachedEvidenceIds: ['ev-1', 'ev-2'],
        createdAt: now,
        updatedAt: now,
      );

      final json = opp.toJson();
      final reconstructed = Opportunity.fromJson(json);

      expect(reconstructed.id, opp.id);
      expect(reconstructed.company, 'Stripe');
      expect(reconstructed.role, 'Infrastructure Engineer');
      expect(reconstructed.stage, JobStage.interview);
      expect(reconstructed.sourceUrl, 'https://stripe.com/jobs/123');
      expect(reconstructed.attachedEvidenceIds, ['ev-1', 'ev-2']);
    });

    test('TaskItem correctly evaluates overdue and upcoming status', () {
      final today = DateTime.now();
      final overdueTask = TaskItem(
        id: 't-1',
        opportunityId: 'opp-1',
        title: 'Overdue task',
        dueDate: today.subtract(const Duration(days: 2)),
        isCompleted: false,
        createdAt: today.subtract(const Duration(days: 5)),
      );
      expect(overdueTask.isOverdue(today), isTrue);
      expect(overdueTask.isDueUpcoming(today), isFalse);

      final completedTask = overdueTask.copyWith(isCompleted: true);
      expect(completedTask.isOverdue(today), isFalse);

      final upcomingTask = TaskItem(
        id: 't-2',
        opportunityId: 'opp-1',
        title: 'Upcoming task',
        dueDate: today.add(const Duration(days: 3)),
        isCompleted: false,
        createdAt: today,
      );
      expect(upcomingTask.isOverdue(today), isFalse);
      expect(upcomingTask.isDueUpcoming(today), isTrue);
    });
  });

  group('Validation Service', () {
    test('validateRequired catches empty and whitespace inputs', () {
      expect(ValidationService.validateRequired(null, 'Company'), isNotNull);
      expect(ValidationService.validateRequired('', 'Company'), isNotNull);
      expect(ValidationService.validateRequired('   ', 'Company'), isNotNull);
      expect(ValidationService.validateRequired('Google', 'Company'), isNull);
    });

    test('validateUrl validates http and https URLs correctly', () {
      expect(ValidationService.validateUrl(null), isNull); // optional
      expect(ValidationService.validateUrl(''), isNull); // optional
      expect(ValidationService.validateUrl('ftp://example.com'), isNotNull);
      expect(ValidationService.validateUrl('just-a-string'), isNotNull);
      expect(ValidationService.validateUrl('http://company.com/job'), isNull);
      expect(ValidationService.validateUrl('https://careers.google.com/jobs/results/123'), isNull);
    });
  });

  group('Backup & Restore Schema Validation', () {
    test('Valid backup passes validation with correct counts', () {
      final validJson = jsonEncode({
        'schemaVersion': 1,
        'appVersion': '1.0.0',
        'exportedAt': DateTime.now().toIso8601String(),
        'opportunities': [
          {
            'id': 'opp-1',
            'company': 'Datadog',
            'role': 'SRE',
            'stage': 'interview',
            'createdAt': DateTime.now().toIso8601String(),
            'updatedAt': DateTime.now().toIso8601String(),
          }
        ],
        'tasks': [
          {
            'id': 'task-1',
            'opportunityId': 'opp-1',
            'title': 'Prep monitoring architecture',
            'createdAt': DateTime.now().toIso8601String(),
          }
        ],
        'timeline': [],
        'evidence': [],
        'preferences': {'theme_mode': 'dark'}
      });

      final result = BackupData.validateAndParse(validJson);
      expect(result.isValid, isTrue);
      expect(result.opportunityCount, 1);
      expect(result.taskCount, 1);
      expect(result.backupData!.opportunities.first.company, 'Datadog');
    });

    test('Rejects malformed JSON syntax', () {
      final result = BackupData.validateAndParse('{ bad json: ');
      expect(result.isValid, isFalse);
      expect(result.errorMessage, contains('Malformed JSON syntax'));
    });

    test('Rejects missing or unsupported schemaVersion', () {
      final missingVer = jsonEncode({'opportunities': []});
      expect(BackupData.validateAndParse(missingVer).isValid, isFalse);

      final wrongVer = jsonEncode({'schemaVersion': 99, 'opportunities': []});
      final res = BackupData.validateAndParse(wrongVer);
      expect(res.isValid, isFalse);
      expect(res.errorMessage, contains('Unsupported schema version'));
    });

    test('Rejects opportunity with missing required company or role', () {
      final invalidOpp = jsonEncode({
        'schemaVersion': 1,
        'opportunities': [
          {'role': 'DevOps Engineer'} // missing company
        ]
      });
      final res = BackupData.validateAndParse(invalidOpp);
      expect(res.isValid, isFalse);
      expect(res.errorMessage, contains('missing required "company"'));
    });
  });

  group('AppState Business Logic & Persistence', () {
    late InMemoryStorageService storage;
    late AppState appState;

    setUp(() async {
      storage = InMemoryStorageService();
      appState = AppState(storage: storage);
      await appState.initialize();
    });

    test('Initial state is empty and unpopulated', () {
      expect(appState.allOpportunities, isEmpty);
      expect(appState.allTasks, isEmpty);
      expect(appState.allEvidence, isEmpty);
      expect(appState.isDemoWorkspace, isFalse);
      expect(appState.stageCounts[JobStage.saved], 0);
    });

    test('Create opportunity creates timeline entry and updates storage', () async {
      final opp = await appState.createOpportunity(
        company: 'Linear',
        role: 'Frontend Engineer',
        stage: JobStage.applied,
        location: 'Remote',
        salaryNote: '\$130k',
      );

      expect(opp.company, 'Linear');

      expect(appState.allOpportunities.length, 1);
      expect(appState.stageCounts[JobStage.applied], 1);
      expect(appState.allTimeline.length, 1);
      expect(appState.allTimeline.first.actionType, 'created');
      expect(appState.allTimeline.first.description, contains('Linear'));

      // Verify persisted in storage
      final storedOpps = await storage.getOpportunities();
      expect(storedOpps.length, 1);
      expect(storedOpps.first.company, 'Linear');
    });

    test('Changing stage records dated timeline entry and updates stage counts', () async {
      final opp = await appState.createOpportunity(
        company: 'Figma',
        role: 'Design Engineer',
        stage: JobStage.screening,
      );

      expect(appState.stageCounts[JobStage.screening], 1);
      expect(appState.stageCounts[JobStage.interview], 0);

      await appState.changeOpportunityStage(opp.id, JobStage.interview);

      expect(appState.stageCounts[JobStage.screening], 0);
      expect(appState.stageCounts[JobStage.interview], 1);

      final timeline = appState.timelineForOpportunity(opp.id);
      expect(timeline.length, 2);
      expect(timeline.first.actionType, 'stage_change');
      expect(timeline.first.description, contains('Screening to Interview'));
    });

    test('Archived opportunities leave active stage counts', () async {
      final created = await appState.createOpportunity(
        company: 'Anthropic',
        role: 'Research Engineer',
        stage: JobStage.interview,
      );
      expect(appState.stageCounts[JobStage.interview], 1);

      await appState.archiveOpportunity(created.id);
      expect(appState.stageCounts[JobStage.interview], 0);
      expect(appState.archivedOpportunities.length, 1);
      expect(appState.activeOpportunities.length, 0);

      await appState.restoreOpportunity(created.id);
      expect(appState.stageCounts[JobStage.interview], 1);
      expect(appState.activeOpportunities.length, 1);
    });

    test('Task add, toggle complete, and delete', () async {
      final opp = await appState.createOpportunity(company: 'Stripe', role: 'SWE');
      final task = await appState.addTask(
        opportunityId: opp.id,
        title: 'Review System Design',
        dueDate: DateTime.now().add(const Duration(days: 1)),
      );

      expect(appState.tasksForOpportunity(opp.id).length, 1);
      expect(task.isCompleted, isFalse);

      await appState.toggleTaskComplete(task.id);
      final updatedTask = appState.tasksForOpportunity(opp.id).first;
      expect(updatedTask.isCompleted, isTrue);
      expect(updatedTask.completedAt, isNotNull);

      await appState.deleteTask(task.id);
      expect(appState.tasksForOpportunity(opp.id), isEmpty);
    });

    test('Deleting an evidence item safely detaches references without corrupting opportunity', () async {
      final ev = await appState.addEvidence(
        title: 'Cloudflare Workers Pipeline',
        skillTags: ['TypeScript', 'Cloudflare'],
        conciseResult: 'Cut response time by 50%',
      );

      final opp = await appState.createOpportunity(
        company: 'Cloudflare',
        role: 'Systems Engineer',
        attachedEvidenceIds: [ev.id],
      );

      expect(appState.getOpportunityById(opp.id)!.attachedEvidenceIds, contains(ev.id));

      await appState.deleteEvidence(ev.id);
      expect(appState.allEvidence, isEmpty);
      expect(appState.getOpportunityById(opp.id)!.attachedEvidenceIds, isNot(contains(ev.id)));
    });

    test('Loading and clearing demo workspace with full isolation', () async {
      await appState.loadDemoWorkspace();
      expect(appState.isDemoWorkspace, isTrue);
      expect(appState.allOpportunities.length, greaterThanOrEqualTo(4));
      expect(appState.allTasks.length, greaterThanOrEqualTo(4));
      expect(appState.allEvidence.length, greaterThanOrEqualTo(3));

      await appState.clearDemoWorkspace();
      expect(appState.isDemoWorkspace, isFalse);
      expect(appState.allOpportunities, isEmpty);
      expect(appState.allTasks, isEmpty);
      expect(appState.allEvidence, isEmpty);
    });

    test('Export and atomic Restore preserves data and preferences', () async {
      await appState.createOpportunity(company: 'GitHub', role: 'Staff Engineer', stage: JobStage.offer);
      await appState.setThemeMode(ThemeMode.dark);
      await appState.setReduceMotion(true);

      final exportJson = await appState.exportBackupString();
      final parsed = BackupData.validateAndParse(exportJson);
      expect(parsed.isValid, isTrue);

      // Erase current
      await appState.eraseAllData();
      expect(appState.allOpportunities, isEmpty);

      // Restore
      await appState.restoreBackup(parsed.backupData!);
      expect(appState.allOpportunities.length, 1);
      expect(appState.allOpportunities.first.company, 'GitHub');
      expect(appState.themeMode, ThemeMode.dark);
      expect(appState.reduceMotion, isTrue);
    });
  });
}

