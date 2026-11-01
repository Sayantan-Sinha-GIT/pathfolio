import 'package:flutter_test/flutter_test.dart';
import 'package:pathfolio/models/opportunity.dart';
import 'package:pathfolio/models/stage.dart';
import 'package:pathfolio/services/storage_service.dart';
import 'package:pathfolio/state/app_state.dart';

void main() {
  group('Pipeline & Opportunity Lifecycle', () {
    late InMemoryStorageService storage;
    late AppState appState;

    setUp(() async {
      storage = InMemoryStorageService();
      appState = AppState(storage: storage);
      await appState.initialize();
    });

    test('M01: Create opportunity with required and optional fields', () async {
      final opp = await appState.createOpportunity(
        company: 'Stripe',
        role: 'Staff Infrastructure Engineer',
        stage: JobStage.applied,
        location: 'Seattle, WA',
        salaryNote: '\$200k base',
        privateNotes: 'Referral through campus network',
      );

      expect(opp.company, 'Stripe');
      expect(opp.role, 'Staff Infrastructure Engineer');
      expect(opp.stage, JobStage.applied);
      expect(opp.location, 'Seattle, WA');
      expect(appState.allOpportunities.length, 1);
    });

    test('M01: Edit opportunity preserves created date but updates updatedAt', () async {
      final opp = await appState.createOpportunity(company: 'Figma', role: 'SWE');
      final originalCreated = opp.createdAt;

      await Future.delayed(const Duration(milliseconds: 10));
      await appState.updateOpportunity(opp.copyWith(role: 'Senior SWE'));

      final updated = appState.getOpportunityById(opp.id)!;
      expect(updated.role, 'Senior SWE');
      expect(updated.createdAt, originalCreated);
      expect(updated.updatedAt.isAfter(originalCreated), isTrue);
    });

    test('M01: Delete opportunity removes associated tasks and timeline entries', () async {
      final opp = await appState.createOpportunity(company: 'Linear', role: 'Product Intern');
      await appState.addTask(opportunityId: opp.id, title: 'Follow-up email');
      expect(appState.tasksForOpportunity(opp.id).length, 1);
      expect(appState.timelineForOpportunity(opp.id).length, 1);

      await appState.deleteOpportunity(opp.id);
      expect(appState.allOpportunities, isEmpty);
      expect(appState.tasksForOpportunity(opp.id), isEmpty);
      expect(appState.timelineForOpportunity(opp.id), isEmpty);
    });

    test('M02: Pipeline full stage progression from Saved to Offer', () async {
      final opp = await appState.createOpportunity(company: 'Datadog', role: 'SRE', stage: JobStage.saved);
      expect(opp.stage, JobStage.saved);

      await appState.changeOpportunityStage(opp.id, JobStage.applied);
      expect(appState.getOpportunityById(opp.id)!.stage, JobStage.applied);

      await appState.changeOpportunityStage(opp.id, JobStage.screening);
      expect(appState.getOpportunityById(opp.id)!.stage, JobStage.screening);

      await appState.changeOpportunityStage(opp.id, JobStage.interview);
      expect(appState.getOpportunityById(opp.id)!.stage, JobStage.interview);

      await appState.changeOpportunityStage(opp.id, JobStage.offer);
      expect(appState.getOpportunityById(opp.id)!.stage, JobStage.offer);

      final timeline = appState.timelineForOpportunity(opp.id);
      // 1 created + 4 stage changes = 5 timeline entries
      expect(timeline.length, 5);
      expect(timeline.first.actionType, 'stage_change');
      expect(timeline.first.toStage, 'offer');
    });

    test('M02: Pipeline rejection records final conclusion without corrupting active counts', () async {
      final opp = await appState.createOpportunity(company: 'Acme', role: 'Dev', stage: JobStage.interview);
      expect(appState.stageCounts[JobStage.interview], 1);
      expect(appState.stageCounts[JobStage.rejected], 0);

      await appState.changeOpportunityStage(opp.id, JobStage.rejected);
      expect(appState.stageCounts[JobStage.interview], 0);
      expect(appState.stageCounts[JobStage.rejected], 1);
    });

    test('M02: Multiple opportunities track independent stage counts', () async {
      await appState.createOpportunity(company: 'A', role: 'R1', stage: JobStage.applied);
      await appState.createOpportunity(company: 'B', role: 'R2', stage: JobStage.applied);
      await appState.createOpportunity(company: 'C', role: 'R3', stage: JobStage.screening);

      expect(appState.stageCounts[JobStage.applied], 2);
      expect(appState.stageCounts[JobStage.screening], 1);
      expect(appState.stageCounts[JobStage.interview], 0);
    });

    test('M03: Task completion and reopening toggles counts immediately', () async {
      final opp = await appState.createOpportunity(company: 'Apple', role: 'iOS Eng');
      final task = await appState.addTask(
        opportunityId: opp.id,
        title: 'Review Swift concurrency',
        dueDate: DateTime.now().add(const Duration(days: 1)),
      );

      expect(appState.upcomingTasks.length, 1);
      expect(task.isCompleted, isFalse);

      // Complete task
      await appState.toggleTaskComplete(task.id);
      expect(appState.upcomingTasks.length, 0);
      expect(appState.tasksForOpportunity(opp.id).first.isCompleted, isTrue);

      // Reopen task
      await appState.toggleTaskComplete(task.id);
      expect(appState.upcomingTasks.length, 1);
      expect(appState.tasksForOpportunity(opp.id).first.isCompleted, isFalse);
    });

    test('M03: Overdue tasks correctly computed by local calendar boundary', () async {
      final opp = await appState.createOpportunity(company: 'Google', role: 'SWE');
      final now = DateTime.now();
      await appState.addTask(
        opportunityId: opp.id,
        title: 'Take-home assessment deadline',
        dueDate: now.subtract(const Duration(days: 2)),
      );

      expect(appState.overdueTasks.length, 1);
      expect(appState.overdueTasks.first.title, contains('Take-home'));
    });

    test('M04: Search matches company name, role, and private notes', () async {
      await appState.createOpportunity(company: 'Netflix', role: 'Distributed Systems', privateNotes: 'Spoke with recruiter Sarah');
      await appState.createOpportunity(company: 'Uber', role: 'Mobile Engineer', privateNotes: 'Requires Kotlin');

      appState.setSearchQuery('sarah');
      expect(appState.filteredOpportunities.length, 1);
      expect(appState.filteredOpportunities.first.company, 'Netflix');

      appState.setSearchQuery('KOTLIN');
      expect(appState.filteredOpportunities.length, 1);
      expect(appState.filteredOpportunities.first.company, 'Uber');

      appState.clearFilters();
      expect(appState.filteredOpportunities.length, 2);
    });

    test('M04: Sorting by company name, next action date, and recent updates', () async {
      final now = DateTime.now();
      final o1 = await appState.createOpportunity(company: 'Zebra', role: 'R1', nextActionDate: now.add(const Duration(days: 5)));
      final o2 = await appState.createOpportunity(company: 'Alpha', role: 'R2', nextActionDate: now.add(const Duration(days: 1)));

      // Sort by Company A-Z
      appState.setSortBy('company');
      expect(appState.filteredOpportunities.first.company, 'Alpha');

      // Sort by Next Action Date
      appState.setSortBy('nextAction');
      expect(appState.filteredOpportunities.first.id, o2.id);

      // Sort by Recent
      appState.setSortBy('recent');
      expect(appState.filteredOpportunities.first.id, o2.id);
    });

    test('M05: Dashboard recent activity summary contains chronological actions', () async {
      final opp = await appState.createOpportunity(company: 'Airbnb', role: 'Backend');
      await appState.changeOpportunityStage(opp.id, JobStage.screening);
      final task = await appState.addTask(opportunityId: opp.id, title: 'Send transcript');
      await appState.toggleTaskComplete(task.id);

      final timeline = appState.recentTimelineEntries;
      expect(timeline.length, 3);
      expect(timeline[0].actionType, 'task_completed');
      expect(timeline[1].actionType, 'stage_change');
      expect(timeline[2].actionType, 'created');
    });
  });
}
