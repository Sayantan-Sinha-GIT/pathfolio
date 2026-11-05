import 'dart:convert';

import 'opportunity.dart';
import 'task_item.dart';
import 'timeline_entry.dart';
import 'evidence_item.dart';
import 'stage.dart';
import '../services/validation_service.dart';

class BackupValidationResult {
  final bool isValid;
  final String? errorMessage;
  final int opportunityCount;
  final int taskCount;
  final int evidenceCount;
  final int timelineCount;
  final BackupData? backupData;

  const BackupValidationResult({
    required this.isValid,
    this.errorMessage,
    this.opportunityCount = 0,
    this.taskCount = 0,
    this.evidenceCount = 0,
    this.timelineCount = 0,
    this.backupData,
  });

  static BackupValidationResult failure(String message) {
    return BackupValidationResult(isValid: false, errorMessage: message);
  }
}

class BackupData {
  static const int currentSchemaVersion = 1;
  static const int maxFileSizeBytes = 10 * 1024 * 1024; // 10MB limit

  final int schemaVersion;
  final String appVersion;
  final DateTime exportedAt;
  final List<Opportunity> opportunities;
  final List<TaskItem> tasks;
  final List<TimelineEntry> timeline;
  final List<EvidenceItem> evidence;
  final Map<String, dynamic> preferences;

  const BackupData({
    this.schemaVersion = currentSchemaVersion,
    this.appVersion = '1.0.2',
    required this.exportedAt,
    required this.opportunities,
    required this.tasks,
    required this.timeline,
    required this.evidence,
    this.preferences = const {},
  });

  Map<String, dynamic> toJson() => {
    'schemaVersion': schemaVersion,
    'appVersion': appVersion,
    'exportedAt': exportedAt.toIso8601String(),
    'opportunities': opportunities.map((o) => o.toJson()).toList(),
    'tasks': tasks.map((t) => t.toJson()).toList(),
    'timeline': timeline.map((te) => te.toJson()).toList(),
    'evidence': evidence.map((e) => e.toJson()).toList(),
    'preferences': preferences,
  };

  String toFormattedJson() {
    return const JsonEncoder.withIndent('  ').convert(toJson());
  }

  static BackupValidationResult validateAndParse(String jsonString) {
    if (jsonString.trim().isEmpty) {
      return BackupValidationResult.failure('Backup file is empty.');
    }

    if (jsonString.length > maxFileSizeBytes ||
        utf8.encode(jsonString).length > maxFileSizeBytes) {
      return BackupValidationResult.failure(
        'Backup file exceeds the 10 MB limit.',
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(jsonString);
    } catch (e) {
      return BackupValidationResult.failure(
        'Malformed JSON syntax: ${e.toString()}',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      return BackupValidationResult.failure(
        'Root JSON structure must be a JSON object.',
      );
    }

    if (decoded['appVersion'] != null && decoded['appVersion'] is! String) {
      return BackupValidationResult.failure('"appVersion" must be a string.');
    }

    final schemaVer = decoded['schemaVersion'];
    if (schemaVer == null) {
      return BackupValidationResult.failure(
        'Missing required "schemaVersion" field.',
      );
    }
    if (schemaVer is! int) {
      return BackupValidationResult.failure(
        '"schemaVersion" must be an integer.',
      );
    }
    if (schemaVer != currentSchemaVersion) {
      return BackupValidationResult.failure(
        'Unsupported schema version ($schemaVer). Pathfolio currently supports schema version $currentSchemaVersion.',
      );
    }

    final rawExportedAt = decoded['exportedAt'];
    DateTime exportedDate = DateTime.now();
    if (rawExportedAt != null) {
      if (rawExportedAt is! String) {
        return BackupValidationResult.failure(
          '"exportedAt" must be an ISO-8601 date string.',
        );
      }
      final parsed = DateTime.tryParse(rawExportedAt);
      if (parsed == null) {
        return BackupValidationResult.failure(
          '"exportedAt" must be a valid date.',
        );
      }
      exportedDate = parsed;
    }

    final rawOpps = decoded['opportunities'];
    if (rawOpps != null && rawOpps is! List) {
      return BackupValidationResult.failure(
        '"opportunities" must be an array.',
      );
    }

    final rawTasks = decoded['tasks'];
    if (rawTasks != null && rawTasks is! List) {
      return BackupValidationResult.failure('"tasks" must be an array.');
    }

    final rawTimeline = decoded['timeline'];
    if (rawTimeline != null && rawTimeline is! List) {
      return BackupValidationResult.failure('"timeline" must be an array.');
    }

    final rawEvidence = decoded['evidence'];
    if (rawEvidence != null && rawEvidence is! List) {
      return BackupValidationResult.failure('"evidence" must be an array.');
    }

    final rawPrefs = decoded['preferences'];
    if (rawPrefs != null && rawPrefs is! Map) {
      return BackupValidationResult.failure('"preferences" must be an object.');
    }
    if (rawPrefs is Map) {
      for (final key in [
        'reduce_motion',
        'onboarding_completed',
        'is_demo_workspace',
      ]) {
        if (rawPrefs.containsKey(key) && rawPrefs[key] is! bool) {
          return BackupValidationResult.failure(
            'Preference "$key" must be true or false.',
          );
        }
      }
      if (rawPrefs.containsKey('theme_mode') &&
          !['light', 'dark', 'system'].contains(rawPrefs['theme_mode'])) {
        return BackupValidationResult.failure(
          'Theme must be light, dark, or system.',
        );
      }
      if (rawPrefs.containsKey('last_export_date') &&
          (rawPrefs['last_export_date'] is! String ||
              DateTime.tryParse(rawPrefs['last_export_date']) == null)) {
        return BackupValidationResult.failure('Last export date is invalid.');
      }
    }

    List<Opportunity> parsedOpps = [];
    if (rawOpps is List) {
      for (int i = 0; i < rawOpps.length; i++) {
        final item = rawOpps[i];
        if (item is! Map<String, dynamic>) {
          return BackupValidationResult.failure(
            'Opportunity at index $i is not a valid object.',
          );
        }
        final company = item['company'];
        final role = item['role'];
        if (company == null || company is! String || company.trim().isEmpty) {
          return BackupValidationResult.failure(
            'Opportunity at index $i is missing required "company" field.',
          );
        }
        if (role == null || role is! String || role.trim().isEmpty) {
          return BackupValidationResult.failure(
            'Opportunity at index $i is missing required "role" field.',
          );
        }
        try {
          parsedOpps.add(Opportunity.fromJson(item));
        } catch (e) {
          return BackupValidationResult.failure(
            'Failed to parse opportunity at index $i: $e',
          );
        }
      }
    }

    List<TaskItem> parsedTasks = [];
    if (rawTasks is List) {
      for (int i = 0; i < rawTasks.length; i++) {
        final item = rawTasks[i];
        if (item is! Map<String, dynamic>) {
          return BackupValidationResult.failure(
            'Task at index $i is not a valid object.',
          );
        }
        try {
          parsedTasks.add(TaskItem.fromJson(item));
        } catch (e) {
          return BackupValidationResult.failure(
            'Failed to parse task at index $i: $e',
          );
        }
      }
    }

    List<TimelineEntry> parsedTimeline = [];
    if (rawTimeline is List) {
      for (int i = 0; i < rawTimeline.length; i++) {
        final item = rawTimeline[i];
        if (item is! Map<String, dynamic>) {
          return BackupValidationResult.failure(
            'Timeline entry at index $i is not a valid object.',
          );
        }
        try {
          parsedTimeline.add(TimelineEntry.fromJson(item));
        } catch (e) {
          return BackupValidationResult.failure(
            'Failed to parse timeline at index $i: $e',
          );
        }
      }
    }

    List<EvidenceItem> parsedEvidence = [];
    if (rawEvidence is List) {
      for (int i = 0; i < rawEvidence.length; i++) {
        final item = rawEvidence[i];
        if (item is! Map<String, dynamic>) {
          return BackupValidationResult.failure(
            'Evidence item at index $i is not a valid object.',
          );
        }
        try {
          parsedEvidence.add(EvidenceItem.fromJson(item));
        } catch (e) {
          return BackupValidationResult.failure(
            'Failed to parse evidence at index $i: $e',
          );
        }
      }
    }

    // Model readers deliberately tolerate old local storage. Imports need a
    // stricter boundary: reject incomplete, ambiguous or unsafe replacements.
    for (final name in ['opportunities', 'tasks', 'timeline', 'evidence']) {
      final records = decoded[name];
      if (records is! List) {
        return BackupValidationResult.failure('"$name" must be an array.');
      }
      final ids = <String>{};
      for (final raw in records) {
        final item = raw as Map<String, dynamic>;
        final id = item['id'];
        if (id is! String || id.trim().isEmpty || !ids.add(id)) {
          return BackupValidationResult.failure(
            '$name contains a missing or duplicate ID.',
          );
        }
        for (final field in [
          'title',
          'opportunityId',
          'actionType',
          'description',
          'company',
          'role',
          'location',
          'salaryNote',
          'privateNotes',
          'conciseResult',
          'sourceUrl',
          'stage',
          'fromStage',
          'toStage',
        ]) {
          if (item[field] != null && item[field] is! String) {
            return BackupValidationResult.failure(
              '$name field "$field" must be text.',
            );
          }
        }
        for (final field in [
          'createdAt',
          'updatedAt',
          'applicationDate',
          'nextActionDate',
          'dueDate',
          'completedAt',
          'timestamp',
        ]) {
          final value = item[field];
          if (value != null &&
              (value is! String || DateTime.tryParse(value) == null)) {
            return BackupValidationResult.failure(
              '$name field "$field" must be a valid date.',
            );
          }
        }
        for (final field in ['attachedEvidenceIds', 'skillTags']) {
          final value = item[field];
          if (value != null &&
              (value is! List || value.any((entry) => entry is! String))) {
            return BackupValidationResult.failure(
              '$name field "$field" must contain text values.',
            );
          }
        }
        for (final field in ['isCompleted', 'isArchived']) {
          if (item[field] != null && item[field] is! bool) {
            return BackupValidationResult.failure(
              '$name field "$field" must be true or false.',
            );
          }
        }
        if (item['sourceUrl'] is String &&
            ValidationService.validateUrl(item['sourceUrl']) != null) {
          return BackupValidationResult.failure(
            '$name contains an unsafe or invalid source URL.',
          );
        }
        if (item['stage'] is String &&
            !JobStage.values.any(
              (stage) => stage.name == (item['stage'] as String).toLowerCase(),
            )) {
          return BackupValidationResult.failure('Unknown opportunity stage.');
        }
        if ((name == 'tasks' || name == 'evidence') &&
            (item['title'] is! String ||
                (item['title'] as String).trim().isEmpty)) {
          return BackupValidationResult.failure(
            '$name contains an empty title.',
          );
        }
      }
    }
    final opportunityIds = parsedOpps.map((item) => item.id).toSet();
    if (parsedTasks.any(
          (item) => !opportunityIds.contains(item.opportunityId),
        ) ||
        parsedTimeline.any(
          (item) => !opportunityIds.contains(item.opportunityId),
        )) {
      return BackupValidationResult.failure(
        'Tasks and activity must reference an existing opportunity.',
      );
    }

    final backup = BackupData(
      schemaVersion: schemaVer,
      appVersion: decoded['appVersion'] as String? ?? '1.0.0',
      exportedAt: exportedDate,
      opportunities: parsedOpps,
      tasks: parsedTasks,
      timeline: parsedTimeline,
      evidence: parsedEvidence,
      preferences: rawPrefs != null ? Map<String, dynamic>.from(rawPrefs) : {},
    );

    return BackupValidationResult(
      isValid: true,
      opportunityCount: parsedOpps.length,
      taskCount: parsedTasks.length,
      evidenceCount: parsedEvidence.length,
      timelineCount: parsedTimeline.length,
      backupData: backup,
    );
  }
}
