import 'package:flutter/material.dart';

import '../models/opportunity.dart';
import '../models/stage.dart';
import '../models/task_item.dart';
import '../models/timeline_entry.dart';
import '../models/evidence_item.dart';
import '../models/backup_data.dart';
import '../services/storage_service.dart';
import '../services/demo_data.dart';

class AppState extends ChangeNotifier {
  final IStorageService storage;

  AppState({required this.storage});

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  List<Opportunity> _opportunities = [];
  List<TaskItem> _tasks = [];
  List<TimelineEntry> _timeline = [];
  List<EvidenceItem> _evidence = [];
  Map<String, dynamic> _preferences = {};

  bool _isDemoWorkspace = false;
  bool get isDemoWorkspace => _isDemoWorkspace;

  ThemeMode _themeMode = ThemeMode.system;
  ThemeMode get themeMode => _themeMode;

  bool _reduceMotion = false;
  bool get reduceMotion => _reduceMotion;

  DateTime? _lastExportDate;
  DateTime? get lastExportDate => _lastExportDate;

  bool _hasCompletedOnboarding = false;
  bool get hasCompletedOnboarding => _hasCompletedOnboarding;

  // Filter & Search states
  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  JobStage? _stageFilter;
  JobStage? get stageFilter => _stageFilter;

  bool _showArchived = false;
  bool get showArchived => _showArchived;

  String _sortBy = 'recent'; // 'recent', 'nextAction', 'company', 'applied'
  String get sortBy => _sortBy;

  Future<void> initialize() async {
    await storage.init();
    _opportunities = await storage.getOpportunities();
    _tasks = await storage.getTasks();
    _timeline = await storage.getTimeline();
    _evidence = await storage.getEvidence();
    _preferences = await storage.getPreferences();

    _isDemoWorkspace = _preferences['is_demo_workspace'] as bool? ?? false;
    _hasCompletedOnboarding =
        _preferences['has_completed_onboarding'] as bool? ?? false;
    _reduceMotion = _preferences['reduce_motion'] as bool? ?? false;

    final themeStr = _preferences['theme_mode'] as String?;
    if (themeStr == 'dark') {
      _themeMode = ThemeMode.dark;
    } else if (themeStr == 'light') {
      _themeMode = ThemeMode.light;
    } else {
      _themeMode = ThemeMode.system;
    }

    final exportStr = _preferences['last_export_date'] as String?;
    if (exportStr != null) {
      _lastExportDate = DateTime.tryParse(exportStr);
    }

    _isInitialized = true;
    notifyListeners();
  }

  // Filter setters
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setStageFilter(JobStage? stage) {
    _stageFilter = stage;
    notifyListeners();
  }

  void setShowArchived(bool show) {
    _showArchived = show;
    notifyListeners();
  }

  void setSortBy(String sort) {
    _sortBy = sort;
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = '';
    _stageFilter = null;
    _showArchived = false;
    _sortBy = 'recent';
    notifyListeners();
  }

  bool get hasActiveFilters =>
      _searchQuery.isNotEmpty ||
      _stageFilter != null ||
      _showArchived ||
      _sortBy != 'recent';

  // Read accessors
  List<Opportunity> get allOpportunities => List.unmodifiable(_opportunities);
  List<TaskItem> get allTasks => List.unmodifiable(_tasks);
  List<TimelineEntry> get allTimeline => List.unmodifiable(_timeline);
  List<EvidenceItem> get allEvidence => List.unmodifiable(_evidence);

  List<Opportunity> get activeOpportunities =>
      _opportunities.where((o) => !o.isArchived).toList();

  List<Opportunity> get archivedOpportunities =>
      _opportunities.where((o) => o.isArchived).toList();

  Map<JobStage, int> get stageCounts {
    final counts = <JobStage, int>{};
    for (final stage in JobStage.values) {
      counts[stage] = 0;
    }
    for (final opp in activeOpportunities) {
      counts[opp.stage] = (counts[opp.stage] ?? 0) + 1;
    }
    return counts;
  }

  List<Opportunity> get filteredOpportunities {
    var list = _opportunities
        .where((o) => o.isArchived == _showArchived)
        .toList();

    if (_stageFilter != null) {
      list = list.where((o) => o.stage == _stageFilter).toList();
    }

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((o) {
        final matchCompany = o.company.toLowerCase().contains(q);
        final matchRole = o.role.toLowerCase().contains(q);
        final matchNotes = o.privateNotes.toLowerCase().contains(q);
        final matchLocation = o.location.toLowerCase().contains(q);
        return matchCompany || matchRole || matchNotes || matchLocation;
      }).toList();
    }

    // Sort
    switch (_sortBy) {
      case 'company':
        list.sort(
          (a, b) => a.company.toLowerCase().compareTo(b.company.toLowerCase()),
        );
        break;
      case 'nextAction':
        list.sort((a, b) {
          if (a.nextActionDate == null && b.nextActionDate == null) return 0;
          if (a.nextActionDate == null) return 1;
          if (b.nextActionDate == null) return -1;
          return a.nextActionDate!.compareTo(b.nextActionDate!);
        });
        break;
      case 'applied':
        list.sort((a, b) {
          if (a.applicationDate == null && b.applicationDate == null) return 0;
          if (a.applicationDate == null) return 1;
          if (b.applicationDate == null) return -1;
          return b.applicationDate!.compareTo(a.applicationDate!);
        });
        break;
      case 'recent':
      default:
        list.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
        break;
    }

    return list;
  }

  List<TaskItem> get overdueTasks {
    final now = DateTime.now();
    return _tasks
        .where(
          (t) => t.isOverdue(now) && !_isOpportunityArchived(t.opportunityId),
        )
        .toList()
      ..sort((a, b) => a.dueDate!.compareTo(b.dueDate!));
  }

  List<TaskItem> get upcomingTasks {
    final now = DateTime.now();
    return _tasks
        .where(
          (t) =>
              (t.isDueToday(now) || t.isDueUpcoming(now)) &&
              !_isOpportunityArchived(t.opportunityId),
        )
        .toList()
      ..sort((a, b) => a.dueDate!.compareTo(b.dueDate!));
  }

  bool _isOpportunityArchived(String oppId) {
    final opp = getOpportunityById(oppId);
    return opp?.isArchived ?? false;
  }

  Opportunity? getOpportunityById(String id) {
    try {
      return _opportunities.firstWhere((o) => o.id == id);
    } catch (_) {
      return null;
    }
  }

  List<TaskItem> tasksForOpportunity(String oppId) {
    return _tasks.where((t) => t.opportunityId == oppId).toList()..sort((a, b) {
      if (a.isCompleted != b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      if (a.dueDate != null && b.dueDate != null) {
        return a.dueDate!.compareTo(b.dueDate!);
      }
      return b.createdAt.compareTo(a.createdAt);
    });
  }

  List<TimelineEntry> timelineForOpportunity(String oppId) {
    return _timeline.where((t) => t.opportunityId == oppId).toList()
      ..sort((a, b) => b.timestamp.compareTo(a.timestamp));
  }

  List<TimelineEntry> get recentTimelineEntries {
    final list = List<TimelineEntry>.from(_timeline);
    list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return list.take(10).toList();
  }

  List<EvidenceItem> evidenceForOpportunity(String oppId) {
    final opp = getOpportunityById(oppId);
    if (opp == null) return [];
    return _evidence
        .where((e) => opp.attachedEvidenceIds.contains(e.id))
        .toList();
  }

  // Opportunity Actions
  Future<Opportunity> createOpportunity({
    required String company,
    required String role,
    JobStage stage = JobStage.saved,
    String? sourceUrl,
    String location = '',
    String salaryNote = '',
    DateTime? applicationDate,
    DateTime? nextActionDate,
    String privateNotes = '',
    List<String> attachedEvidenceIds = const [],
  }) async {
    final now = DateTime.now();
    final newId =
        'opp-${now.millisecondsSinceEpoch}-${_opportunities.length + 1}';
    final opp = Opportunity(
      id: newId,
      company: company.trim(),
      role: role.trim(),
      stage: stage,
      sourceUrl: sourceUrl?.trim().isNotEmpty == true
          ? sourceUrl!.trim()
          : null,
      location: location.trim(),
      salaryNote: salaryNote.trim(),
      applicationDate:
          applicationDate ?? (stage != JobStage.saved ? now : null),
      nextActionDate: nextActionDate,
      privateNotes: privateNotes.trim(),
      isArchived: false,
      attachedEvidenceIds: attachedEvidenceIds,
      createdAt: now,
      updatedAt: now,
    );

    final timelineEntry = TimelineEntry(
      id: 'time-${now.millisecondsSinceEpoch}',
      opportunityId: newId,
      timestamp: now,
      actionType: 'created',
      description:
          'Created opportunity at ${opp.company} (${opp.role}) in stage ${stage.displayName}.',
      toStage: stage.name,
    );

    _opportunities.insert(0, opp);
    _timeline.insert(0, timelineEntry);

    await storage.saveOpportunities(_opportunities);
    await storage.saveTimeline(_timeline);
    notifyListeners();
    return opp;
  }

  Future<void> updateOpportunity(Opportunity updated) async {
    final index = _opportunities.indexWhere((o) => o.id == updated.id);
    if (index == -1) return;

    final existing = _opportunities[index];
    final now = DateTime.now();

    // Check if stage changed
    TimelineEntry? stageChangeEntry;
    if (existing.stage != updated.stage) {
      stageChangeEntry = TimelineEntry(
        id: 'time-${now.millisecondsSinceEpoch}',
        opportunityId: updated.id,
        timestamp: now,
        actionType: 'stage_change',
        description:
            'Moved from ${existing.stage.displayName} to ${updated.stage.displayName}.',
        fromStage: existing.stage.name,
        toStage: updated.stage.name,
      );
    }

    final finalOpp = updated.copyWith(updatedAt: now);
    _opportunities[index] = finalOpp;

    if (stageChangeEntry != null) {
      _timeline.insert(0, stageChangeEntry);
      await storage.saveTimeline(_timeline);
    }

    await storage.saveOpportunities(_opportunities);
    notifyListeners();
  }

  Future<void> changeOpportunityStage(String id, JobStage newStage) async {
    final opp = getOpportunityById(id);
    if (opp == null || opp.stage == newStage) return;
    await updateOpportunity(opp.copyWith(stage: newStage));
  }

  Future<void> archiveOpportunity(String id) async {
    final opp = getOpportunityById(id);
    if (opp == null || opp.isArchived) return;

    final now = DateTime.now();
    final updated = opp.copyWith(isArchived: true, updatedAt: now);
    final timelineEntry = TimelineEntry(
      id: 'time-${now.millisecondsSinceEpoch}',
      opportunityId: id,
      timestamp: now,
      actionType: 'archived',
      description: 'Archived opportunity.',
    );

    final index = _opportunities.indexWhere((o) => o.id == id);
    _opportunities[index] = updated;
    _timeline.insert(0, timelineEntry);

    await storage.saveOpportunities(_opportunities);
    await storage.saveTimeline(_timeline);
    notifyListeners();
  }

  Future<void> restoreOpportunity(String id) async {
    final opp = getOpportunityById(id);
    if (opp == null || !opp.isArchived) return;

    final now = DateTime.now();
    final updated = opp.copyWith(isArchived: false, updatedAt: now);
    final timelineEntry = TimelineEntry(
      id: 'time-${now.millisecondsSinceEpoch}',
      opportunityId: id,
      timestamp: now,
      actionType: 'restored',
      description: 'Restored opportunity to active pipeline.',
    );

    final index = _opportunities.indexWhere((o) => o.id == id);
    _opportunities[index] = updated;
    _timeline.insert(0, timelineEntry);

    await storage.saveOpportunities(_opportunities);
    await storage.saveTimeline(_timeline);
    notifyListeners();
  }

  Future<void> deleteOpportunity(String id) async {
    _opportunities.removeWhere((o) => o.id == id);
    _tasks.removeWhere((t) => t.opportunityId == id);
    _timeline.removeWhere((te) => te.opportunityId == id);

    await storage.saveOpportunities(_opportunities);
    await storage.saveTasks(_tasks);
    await storage.saveTimeline(_timeline);
    notifyListeners();
  }

  Future<void> toggleAttachEvidence(String oppId, String evidenceId) async {
    final opp = getOpportunityById(oppId);
    if (opp == null) return;

    List<String> currentIds = List.from(opp.attachedEvidenceIds);
    if (currentIds.contains(evidenceId)) {
      currentIds.remove(evidenceId);
    } else {
      currentIds.add(evidenceId);
    }
    await updateOpportunity(opp.copyWith(attachedEvidenceIds: currentIds));
  }

  // Task Actions
  Future<TaskItem> addTask({
    required String opportunityId,
    required String title,
    DateTime? dueDate,
  }) async {
    final now = DateTime.now();
    final task = TaskItem(
      id: 'task-${now.millisecondsSinceEpoch}-${_tasks.length + 1}',
      opportunityId: opportunityId,
      title: title.trim(),
      dueDate: dueDate,
      isCompleted: false,
      createdAt: now,
    );

    _tasks.insert(0, task);
    await storage.saveTasks(_tasks);

    // Update opportunity's updatedAt
    final opp = getOpportunityById(opportunityId);
    if (opp != null) {
      final index = _opportunities.indexWhere((o) => o.id == opp.id);
      _opportunities[index] = opp.copyWith(updatedAt: now);
      await storage.saveOpportunities(_opportunities);
    }

    notifyListeners();
    return task;
  }

  Future<void> updateTask(TaskItem updated) async {
    final index = _tasks.indexWhere((t) => t.id == updated.id);
    if (index == -1) return;

    _tasks[index] = updated;
    await storage.saveTasks(_tasks);
    notifyListeners();
  }

  Future<void> toggleTaskComplete(String taskId) async {
    final index = _tasks.indexWhere((t) => t.id == taskId);
    if (index == -1) return;

    final current = _tasks[index];
    final now = DateTime.now();
    final willComplete = !current.isCompleted;

    final updated = current.copyWith(
      isCompleted: willComplete,
      completedAt: willComplete ? now : null,
    );
    _tasks[index] = updated;

    if (willComplete) {
      final timelineEntry = TimelineEntry(
        id: 'time-${now.millisecondsSinceEpoch}',
        opportunityId: current.opportunityId,
        timestamp: now,
        actionType: 'task_completed',
        description: 'Completed task: ${current.title}',
      );
      _timeline.insert(0, timelineEntry);
      await storage.saveTimeline(_timeline);
    }

    await storage.saveTasks(_tasks);
    notifyListeners();
  }

  Future<void> deleteTask(String taskId) async {
    _tasks.removeWhere((t) => t.id == taskId);
    await storage.saveTasks(_tasks);
    notifyListeners();
  }

  // Evidence Actions
  Future<EvidenceItem> addEvidence({
    required String title,
    required List<String> skillTags,
    required String conciseResult,
    String? sourceUrl,
  }) async {
    final now = DateTime.now();
    final item = EvidenceItem(
      id: 'ev-${now.millisecondsSinceEpoch}-${_evidence.length + 1}',
      title: title.trim(),
      skillTags: skillTags
          .map((e) => e.trim())
          .where((e) => e.isNotEmpty)
          .toList(),
      conciseResult: conciseResult.trim(),
      sourceUrl: sourceUrl?.trim().isNotEmpty == true
          ? sourceUrl!.trim()
          : null,
      createdAt: now,
    );

    _evidence.insert(0, item);
    await storage.saveEvidence(_evidence);
    notifyListeners();
    return item;
  }

  Future<void> updateEvidence(EvidenceItem updated) async {
    final index = _evidence.indexWhere((e) => e.id == updated.id);
    if (index == -1) return;

    _evidence[index] = updated;
    await storage.saveEvidence(_evidence);
    notifyListeners();
  }

  Future<void> deleteEvidence(String id) async {
    _evidence.removeWhere((e) => e.id == id);
    // Prune references from opportunities safely without corrupting history
    bool anyChanged = false;
    for (int i = 0; i < _opportunities.length; i++) {
      if (_opportunities[i].attachedEvidenceIds.contains(id)) {
        final updatedIds = List<String>.from(
          _opportunities[i].attachedEvidenceIds,
        )..remove(id);
        _opportunities[i] = _opportunities[i].copyWith(
          attachedEvidenceIds: updatedIds,
        );
        anyChanged = true;
      }
    }

    await storage.saveEvidence(_evidence);
    if (anyChanged) {
      await storage.saveOpportunities(_opportunities);
    }
    notifyListeners();
  }

  // Demo Workspace
  Future<void> loadDemoWorkspace() async {
    final now = DateTime.now();
    _evidence = DemoDataFactory.createDemoEvidence(now);
    _opportunities = DemoDataFactory.createDemoOpportunities(now);
    _tasks = DemoDataFactory.createDemoTasks(now);
    _timeline = DemoDataFactory.createDemoTimeline(now);
    _isDemoWorkspace = true;
    _preferences['is_demo_workspace'] = true;

    await storage.commitAll(
      opportunities: _opportunities,
      tasks: _tasks,
      timeline: _timeline,
      evidence: _evidence,
      preferences: _preferences,
    );
    notifyListeners();
  }

  Future<void> clearDemoWorkspace() async {
    if (!_isDemoWorkspace) return;
    await eraseAllData();
  }

  // Backup & Restore
  BackupData createBackup() {
    return BackupData(
      schemaVersion: BackupData.currentSchemaVersion,
      appVersion: '1.0.0',
      exportedAt: DateTime.now(),
      opportunities: _opportunities,
      tasks: _tasks,
      timeline: _timeline,
      evidence: _evidence,
      preferences: {
        'theme_mode': _themeMode == ThemeMode.dark
            ? 'dark'
            : _themeMode == ThemeMode.light
            ? 'light'
            : 'system',
        'reduce_motion': _reduceMotion,
      },
    );
  }

  Future<String> exportBackupString() async {
    final backup = createBackup();
    final now = DateTime.now();
    _lastExportDate = now;
    _preferences['last_export_date'] = now.toIso8601String();
    await storage.savePreferences(_preferences);
    notifyListeners();
    return backup.toFormattedJson();
  }

  Future<void> restoreBackup(BackupData backup) async {
    final restoredOpportunities = List<Opportunity>.from(backup.opportunities);
    final restoredTasks = List<TaskItem>.from(backup.tasks);
    final restoredTimeline = List<TimelineEntry>.from(backup.timeline);
    final restoredEvidence = List<EvidenceItem>.from(backup.evidence);
    final restoredPreferences = Map<String, dynamic>.from(backup.preferences);
    restoredPreferences['is_demo_workspace'] = false;

    // Commit the complete validated snapshot before replacing the active view.
    await storage.commitAll(
      opportunities: restoredOpportunities,
      tasks: restoredTasks,
      timeline: restoredTimeline,
      evidence: restoredEvidence,
      preferences: restoredPreferences,
    );
    _opportunities = restoredOpportunities;
    _tasks = restoredTasks;
    _timeline = restoredTimeline;
    _evidence = restoredEvidence;
    _isDemoWorkspace = false;
    _preferences = restoredPreferences;

    // Apply restored preferences
    if (backup.preferences.containsKey('reduce_motion')) {
      _reduceMotion = backup.preferences['reduce_motion'] as bool? ?? false;
    }
    if (backup.preferences.containsKey('theme_mode')) {
      final t = backup.preferences['theme_mode'] as String?;
      if (t == 'dark') {
        _themeMode = ThemeMode.dark;
      } else if (t == 'light') {
        _themeMode = ThemeMode.light;
      } else {
        _themeMode = ThemeMode.system;
      }
    }

    notifyListeners();
  }

  // Privacy & Settings
  Future<void> eraseAllData() async {
    _opportunities.clear();
    _tasks.clear();
    _timeline.clear();
    _evidence.clear();
    _isDemoWorkspace = false;
    _preferences.remove('is_demo_workspace');
    _preferences.remove('last_export_date');
    _lastExportDate = null;

    await storage.clearAll();
    // Re-save base preferences like onboarding completion and theme
    await storage.savePreferences(_preferences);
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    _preferences['theme_mode'] = mode == ThemeMode.dark
        ? 'dark'
        : mode == ThemeMode.light
        ? 'light'
        : 'system';
    await storage.savePreferences(_preferences);
    notifyListeners();
  }

  Future<void> setReduceMotion(bool value) async {
    _reduceMotion = value;
    _preferences['reduce_motion'] = value;
    await storage.savePreferences(_preferences);
    notifyListeners();
  }

  Future<void> completeOnboarding() async {
    _hasCompletedOnboarding = true;
    _preferences['has_completed_onboarding'] = true;
    await storage.savePreferences(_preferences);
    notifyListeners();
  }
}
