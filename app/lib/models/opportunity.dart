import 'stage.dart';

class Opportunity {
  static const _unchanged = Object();
  final String id;
  final String company;
  final String role;
  final JobStage stage;
  final String? sourceUrl;
  final String location;
  final String salaryNote;
  final DateTime? applicationDate;
  final DateTime? nextActionDate;
  final String privateNotes;
  final bool isArchived;
  final List<String> attachedEvidenceIds;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Opportunity({
    required this.id,
    required this.company,
    required this.role,
    this.stage = JobStage.saved,
    this.sourceUrl,
    this.location = '',
    this.salaryNote = '',
    this.applicationDate,
    this.nextActionDate,
    this.privateNotes = '',
    this.isArchived = false,
    this.attachedEvidenceIds = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  Opportunity copyWith({
    String? id,
    String? company,
    String? role,
    JobStage? stage,
    Object? sourceUrl = _unchanged,
    String? location,
    String? salaryNote,
    Object? applicationDate = _unchanged,
    Object? nextActionDate = _unchanged,
    String? privateNotes,
    bool? isArchived,
    List<String>? attachedEvidenceIds,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Opportunity(
      id: id ?? this.id,
      company: company ?? this.company,
      role: role ?? this.role,
      stage: stage ?? this.stage,
      sourceUrl: identical(sourceUrl, _unchanged)
          ? this.sourceUrl
          : sourceUrl as String?,
      location: location ?? this.location,
      salaryNote: salaryNote ?? this.salaryNote,
      applicationDate: identical(applicationDate, _unchanged)
          ? this.applicationDate
          : applicationDate as DateTime?,
      nextActionDate: identical(nextActionDate, _unchanged)
          ? this.nextActionDate
          : nextActionDate as DateTime?,
      privateNotes: privateNotes ?? this.privateNotes,
      isArchived: isArchived ?? this.isArchived,
      attachedEvidenceIds: attachedEvidenceIds ?? this.attachedEvidenceIds,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'company': company,
    'role': role,
    'stage': stage.name,
    if (sourceUrl != null && sourceUrl!.trim().isNotEmpty)
      'sourceUrl': sourceUrl!.trim(),
    'location': location,
    'salaryNote': salaryNote,
    if (applicationDate != null)
      'applicationDate': applicationDate!.toIso8601String(),
    if (nextActionDate != null)
      'nextActionDate': nextActionDate!.toIso8601String(),
    'privateNotes': privateNotes,
    'isArchived': isArchived,
    'attachedEvidenceIds': attachedEvidenceIds,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
  };

  factory Opportunity.fromJson(Map<String, dynamic> json) {
    final rawEvidence = json['attachedEvidenceIds'];
    List<String> evidence = [];
    if (rawEvidence is List) {
      evidence = rawEvidence
          .map((e) => e.toString().trim())
          .where((e) => e.isNotEmpty)
          .toList();
    }
    return Opportunity(
      id: json['id'] as String? ?? '',
      company: json['company'] as String? ?? '',
      role: json['role'] as String? ?? '',
      stage: JobStage.fromString(json['stage'] as String?),
      sourceUrl: json['sourceUrl'] as String?,
      location: json['location'] as String? ?? '',
      salaryNote: json['salaryNote'] as String? ?? '',
      applicationDate: json['applicationDate'] != null
          ? DateTime.tryParse(json['applicationDate'] as String)
          : null,
      nextActionDate: json['nextActionDate'] != null
          ? DateTime.tryParse(json['nextActionDate'] as String)
          : null,
      privateNotes: json['privateNotes'] as String? ?? '',
      isArchived: json['isArchived'] as bool? ?? false,
      attachedEvidenceIds: evidence,
      createdAt:
          DateTime.tryParse(json['createdAt'] as String? ?? '') ??
          DateTime.now(),
      updatedAt:
          DateTime.tryParse(json['updatedAt'] as String? ?? '') ??
          DateTime.now(),
    );
  }
}
