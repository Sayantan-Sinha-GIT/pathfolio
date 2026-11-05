class TaskItem {
  static const _unchanged = Object();
  final String id;
  final String opportunityId;
  final String title;
  final DateTime? dueDate;
  final bool isCompleted;
  final DateTime? completedAt;
  final DateTime createdAt;

  const TaskItem({
    required this.id,
    required this.opportunityId,
    required this.title,
    this.dueDate,
    this.isCompleted = false,
    this.completedAt,
    required this.createdAt,
  });

  bool isOverdue([DateTime? referenceDate]) {
    if (isCompleted || dueDate == null) return false;
    final now = referenceDate ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final due = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
    return due.isBefore(today);
  }

  bool isDueToday([DateTime? referenceDate]) {
    if (isCompleted || dueDate == null) return false;
    final now = referenceDate ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final due = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
    return due.isAtSameMomentAs(today);
  }

  bool isDueUpcoming([DateTime? referenceDate, int daysWindow = 7]) {
    if (isCompleted || dueDate == null) return false;
    final now = referenceDate ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final limit = today.add(Duration(days: daysWindow));
    final due = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
    return (due.isAfter(today) || due.isAtSameMomentAs(today)) &&
        due.isBefore(limit.add(const Duration(days: 1)));
  }

  TaskItem copyWith({
    String? id,
    String? opportunityId,
    String? title,
    Object? dueDate = _unchanged,
    bool? isCompleted,
    Object? completedAt = _unchanged,
    DateTime? createdAt,
  }) {
    return TaskItem(
      id: id ?? this.id,
      opportunityId: opportunityId ?? this.opportunityId,
      title: title ?? this.title,
      dueDate: identical(dueDate, _unchanged)
          ? this.dueDate
          : dueDate as DateTime?,
      isCompleted: isCompleted ?? this.isCompleted,
      completedAt: identical(completedAt, _unchanged)
          ? this.completedAt
          : completedAt as DateTime?,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'opportunityId': opportunityId,
    'title': title,
    if (dueDate != null) 'dueDate': dueDate!.toIso8601String(),
    'isCompleted': isCompleted,
    if (completedAt != null) 'completedAt': completedAt!.toIso8601String(),
    'createdAt': createdAt.toIso8601String(),
  };

  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      id: json['id'] as String? ?? '',
      opportunityId: json['opportunityId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      dueDate: json['dueDate'] != null
          ? DateTime.tryParse(json['dueDate'] as String)
          : null,
      isCompleted: json['isCompleted'] as bool? ?? false,
      completedAt: json['completedAt'] != null
          ? DateTime.tryParse(json['completedAt'] as String)
          : null,
      createdAt:
          DateTime.tryParse(json['createdAt'] as String? ?? '') ??
          DateTime.now(),
    );
  }
}
