class TimelineEntry {
  final String id;
  final String opportunityId;
  final DateTime timestamp;
  final String actionType; // 'created', 'stage_change', 'task_completed', 'note_update', 'restored', 'archived'
  final String description;
  final String? fromStage;
  final String? toStage;

  const TimelineEntry({
    required this.id,
    required this.opportunityId,
    required this.timestamp,
    required this.actionType,
    required this.description,
    this.fromStage,
    this.toStage,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'opportunityId': opportunityId,
        'timestamp': timestamp.toIso8601String(),
        'actionType': actionType,
        'description': description,
        if (fromStage != null) 'fromStage': fromStage,
        if (toStage != null) 'toStage': toStage,
      };

  factory TimelineEntry.fromJson(Map<String, dynamic> json) {
    return TimelineEntry(
      id: json['id'] as String? ?? 'time-${DateTime.now().microsecondsSinceEpoch}',
      opportunityId: json['opportunityId'] as String? ?? '',
      timestamp: DateTime.tryParse(json['timestamp'] as String? ?? '') ?? DateTime.now(),
      actionType: json['actionType'] as String? ?? 'general',
      description: json['description'] as String? ?? '',
      fromStage: json['fromStage'] as String?,
      toStage: json['toStage'] as String?,
    );
  }
}
