class EvidenceItem {
  static const _unchanged = Object();
  final String id;
  final String title;
  final List<String> skillTags;
  final String conciseResult;
  final String? sourceUrl;
  final DateTime createdAt;

  const EvidenceItem({
    required this.id,
    required this.title,
    required this.skillTags,
    required this.conciseResult,
    this.sourceUrl,
    required this.createdAt,
  });

  EvidenceItem copyWith({
    String? id,
    String? title,
    List<String>? skillTags,
    String? conciseResult,
    Object? sourceUrl = _unchanged,
    DateTime? createdAt,
  }) {
    return EvidenceItem(
      id: id ?? this.id,
      title: title ?? this.title,
      skillTags: skillTags ?? this.skillTags,
      conciseResult: conciseResult ?? this.conciseResult,
      sourceUrl: identical(sourceUrl, _unchanged)
          ? this.sourceUrl
          : sourceUrl as String?,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'skillTags': skillTags,
    'conciseResult': conciseResult,
    if (sourceUrl != null && sourceUrl!.trim().isNotEmpty)
      'sourceUrl': sourceUrl!.trim(),
    'createdAt': createdAt.toIso8601String(),
  };

  factory EvidenceItem.fromJson(Map<String, dynamic> json) {
    final rawTags = json['skillTags'];
    List<String> tags = [];
    if (rawTags is List) {
      tags = rawTags
          .map((e) => e.toString().trim())
          .where((e) => e.isNotEmpty)
          .toList();
    }
    return EvidenceItem(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      skillTags: tags,
      conciseResult: json['conciseResult'] as String? ?? '',
      sourceUrl: json['sourceUrl'] as String?,
      createdAt:
          DateTime.tryParse(json['createdAt'] as String? ?? '') ??
          DateTime.now(),
    );
  }
}
