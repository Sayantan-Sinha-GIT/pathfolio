import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/opportunity.dart';
import '../models/task_item.dart';
import '../models/timeline_entry.dart';
import '../models/evidence_item.dart';

abstract class IStorageService {
  Future<void> init();
  Future<List<Opportunity>> getOpportunities();
  Future<void> saveOpportunities(List<Opportunity> items);
  Future<List<TaskItem>> getTasks();
  Future<void> saveTasks(List<TaskItem> items);
  Future<List<TimelineEntry>> getTimeline();
  Future<void> saveTimeline(List<TimelineEntry> items);
  Future<List<EvidenceItem>> getEvidence();
  Future<void> saveEvidence(List<EvidenceItem> items);
  Future<Map<String, dynamic>> getPreferences();
  Future<void> savePreferences(Map<String, dynamic> prefs);
  Future<void> commitAll({
    required List<Opportunity> opportunities,
    required List<TaskItem> tasks,
    required List<TimelineEntry> timeline,
    required List<EvidenceItem> evidence,
    required Map<String, dynamic> preferences,
  });
  Future<void> clearAll();
}

class SharedPrefsStorageService implements IStorageService {
  static const String keyOpportunities = 'pathfolio_opportunities_v1';
  static const String keyTasks = 'pathfolio_tasks_v1';
  static const String keyTimeline = 'pathfolio_timeline_v1';
  static const String keyEvidence = 'pathfolio_evidence_v1';
  static const String keyPreferences = 'pathfolio_preferences_v1';

  SharedPreferences? _prefs;

  @override
  Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  SharedPreferences get _store {
    if (_prefs == null) {
      throw StateError('StorageService has not been initialized. Call init() first.');
    }
    return _prefs!;
  }

  @override
  Future<List<Opportunity>> getOpportunities() async {
    final raw = _store.getString(keyOpportunities);
    if (raw == null || raw.trim().isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list.map((e) => Opportunity.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  @override
  Future<void> saveOpportunities(List<Opportunity> items) async {
    final encoded = jsonEncode(items.map((e) => e.toJson()).toList());
    await _store.setString(keyOpportunities, encoded);
  }

  @override
  Future<List<TaskItem>> getTasks() async {
    final raw = _store.getString(keyTasks);
    if (raw == null || raw.trim().isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list.map((e) => TaskItem.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  @override
  Future<void> saveTasks(List<TaskItem> items) async {
    final encoded = jsonEncode(items.map((e) => e.toJson()).toList());
    await _store.setString(keyTasks, encoded);
  }

  @override
  Future<List<TimelineEntry>> getTimeline() async {
    final raw = _store.getString(keyTimeline);
    if (raw == null || raw.trim().isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list.map((e) => TimelineEntry.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  @override
  Future<void> saveTimeline(List<TimelineEntry> items) async {
    final encoded = jsonEncode(items.map((e) => e.toJson()).toList());
    await _store.setString(keyTimeline, encoded);
  }

  @override
  Future<List<EvidenceItem>> getEvidence() async {
    final raw = _store.getString(keyEvidence);
    if (raw == null || raw.trim().isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list.map((e) => EvidenceItem.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  @override
  Future<void> saveEvidence(List<EvidenceItem> items) async {
    final encoded = jsonEncode(items.map((e) => e.toJson()).toList());
    await _store.setString(keyEvidence, encoded);
  }

  @override
  Future<Map<String, dynamic>> getPreferences() async {
    final raw = _store.getString(keyPreferences);
    if (raw == null || raw.trim().isEmpty) return {};
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return {};
    }
  }

  @override
  Future<void> savePreferences(Map<String, dynamic> prefs) async {
    final encoded = jsonEncode(prefs);
    await _store.setString(keyPreferences, encoded);
  }

  @override
  Future<void> commitAll({
    required List<Opportunity> opportunities,
    required List<TaskItem> tasks,
    required List<TimelineEntry> timeline,
    required List<EvidenceItem> evidence,
    required Map<String, dynamic> preferences,
  }) async {
    // Write all data sets cleanly
    await saveOpportunities(opportunities);
    await saveTasks(tasks);
    await saveTimeline(timeline);
    await saveEvidence(evidence);
    await savePreferences(preferences);
  }

  @override
  Future<void> clearAll() async {
    await _store.remove(keyOpportunities);
    await _store.remove(keyTasks);
    await _store.remove(keyTimeline);
    await _store.remove(keyEvidence);
    await _store.remove(keyPreferences);
  }
}

class InMemoryStorageService implements IStorageService {
  List<Opportunity> _opportunities = [];
  List<TaskItem> _tasks = [];
  List<TimelineEntry> _timeline = [];
  List<EvidenceItem> _evidence = [];
  Map<String, dynamic> _preferences = {};

  @override
  Future<void> init() async {}

  @override
  Future<List<Opportunity>> getOpportunities() async => List.from(_opportunities);

  @override
  Future<void> saveOpportunities(List<Opportunity> items) async {
    _opportunities = List.from(items);
  }

  @override
  Future<List<TaskItem>> getTasks() async => List.from(_tasks);

  @override
  Future<void> saveTasks(List<TaskItem> items) async {
    _tasks = List.from(items);
  }

  @override
  Future<List<TimelineEntry>> getTimeline() async => List.from(_timeline);

  @override
  Future<void> saveTimeline(List<TimelineEntry> items) async {
    _timeline = List.from(items);
  }

  @override
  Future<List<EvidenceItem>> getEvidence() async => List.from(_evidence);

  @override
  Future<void> saveEvidence(List<EvidenceItem> items) async {
    _evidence = List.from(items);
  }

  @override
  Future<Map<String, dynamic>> getPreferences() async => Map.from(_preferences);

  @override
  Future<void> savePreferences(Map<String, dynamic> prefs) async {
    _preferences = Map.from(prefs);
  }

  @override
  Future<void> commitAll({
    required List<Opportunity> opportunities,
    required List<TaskItem> tasks,
    required List<TimelineEntry> timeline,
    required List<EvidenceItem> evidence,
    required Map<String, dynamic> preferences,
  }) async {
    _opportunities = List.from(opportunities);
    _tasks = List.from(tasks);
    _timeline = List.from(timeline);
    _evidence = List.from(evidence);
    _preferences = Map.from(preferences);
  }

  @override
  Future<void> clearAll() async {
    _opportunities.clear();
    _tasks.clear();
    _timeline.clear();
    _evidence.clear();
    _preferences.clear();
  }
}

