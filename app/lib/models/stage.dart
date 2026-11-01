import 'package:flutter/material.dart';

enum JobStage {
  saved,
  applied,
  screening,
  interview,
  offer,
  rejected;

  String get displayName {
    switch (this) {
      case JobStage.saved:
        return 'Saved';
      case JobStage.applied:
        return 'Applied';
      case JobStage.screening:
        return 'Screening';
      case JobStage.interview:
        return 'Interview';
      case JobStage.offer:
        return 'Offer';
      case JobStage.rejected:
        return 'Rejected';
    }
  }

  String get description {
    switch (this) {
      case JobStage.saved:
        return 'Researching & preparing application';
      case JobStage.applied:
        return 'Application submitted, awaiting response';
      case JobStage.screening:
        return 'Initial recruiter contact or assessment';
      case JobStage.interview:
        return 'Technical / cultural interviews in progress';
      case JobStage.offer:
        return 'Offer received & under negotiation';
      case JobStage.rejected:
        return 'Application concluded';
    }
  }

  IconData get icon {
    switch (this) {
      case JobStage.saved:
        return Icons.bookmark_border_rounded;
      case JobStage.applied:
        return Icons.send_rounded;
      case JobStage.screening:
        return Icons.record_voice_over_outlined;
      case JobStage.interview:
        return Icons.groups_outlined;
      case JobStage.offer:
        return Icons.verified_outlined;
      case JobStage.rejected:
        return Icons.close_rounded;
    }
  }

  Color get color {
    switch (this) {
      case JobStage.saved:
        return const Color(0xFF6B7280); // Slate gray
      case JobStage.applied:
        return const Color(0xFF2563EB); // Royal Blue
      case JobStage.screening:
        return const Color(0xFFD97706); // Warm Amber
      case JobStage.interview:
        return const Color(0xFFC85A32); // Terracotta
      case JobStage.offer:
        return const Color(0xFF059669); // Forest Emerald
      case JobStage.rejected:
        return const Color(0xFFDC2626); // Crimson
    }
  }

  Color get containerColor {
    switch (this) {
      case JobStage.saved:
        return const Color(0xFFF3F4F6);
      case JobStage.applied:
        return const Color(0xFFEFF6FF);
      case JobStage.screening:
        return const Color(0xFFFFFBEB);
      case JobStage.interview:
        return const Color(0xFFFDF2E9);
      case JobStage.offer:
        return const Color(0xFFECFDF5);
      case JobStage.rejected:
        return const Color(0xFFFEF2F2);
    }
  }

  static JobStage fromString(String? value) {
    if (value == null) return JobStage.saved;
    for (final stage in JobStage.values) {
      if (stage.name.toLowerCase() == value.toLowerCase() ||
          stage.displayName.toLowerCase() == value.toLowerCase()) {
        return stage;
      }
    }
    return JobStage.saved;
  }
}

