import 'package:flutter/material.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';

class OnboardingDialog extends StatelessWidget {
  final AppState appState;

  const OnboardingDialog({super.key, required this.appState});

  static Future<void> showIfNeeded(BuildContext context, AppState appState) async {
    if (!appState.hasCompletedOnboarding && appState.allOpportunities.isEmpty) {
      await showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => OnboardingDialog(appState: appState),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 540, maxHeight: 680),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Logo / Brand Icon
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.accentLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.compass_calibration_rounded, color: AppColors.accent, size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome to Pathfolio',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Your Private Job Search Command Center',
                          style: TextStyle(fontSize: 12.5, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              const Text(
                'Pathfolio is designed to help students and early-career professionals organize applications, keep follow-up momentum, and cite quantifiable evidence during interviews.',
                style: TextStyle(fontSize: 14, height: 1.5),
              ),
              const SizedBox(height: 16),

              // Feature Highlights
              _HighlightRow(
                icon: Icons.lock_outline_rounded,
                title: 'Private & Local-Only',
                description: 'Your sensitive salary notes, interview thoughts, and applications stay solely on this device. No tracking, cloud databases, or mandatory accounts.',
              ),
              const SizedBox(height: 12),
              _HighlightRow(
                icon: Icons.sync_disabled_rounded,
                title: 'Zero Cloud Sync • Portable Backups',
                description: 'Data never leaks to an external server. You can export or import versioned JSON backups anytime from Settings.',
              ),
              const SizedBox(height: 12),
              _HighlightRow(
                icon: Icons.timeline_rounded,
                title: 'Activity Timeline & Career Evidence',
                description: 'Record chronological stage progressions, follow-up deadlines, and reusable engineering achievements.',
              ),
              const SizedBox(height: 24),

              // Choice Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: () async {
                        await appState.completeOnboarding();
                        if (context.mounted) Navigator.of(context).pop();
                      },
                      child: const Text('Start Fresh & Empty'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        backgroundColor: AppColors.accent,
                      ),
                      onPressed: () async {
                        await appState.loadDemoWorkspace();
                        await appState.completeOnboarding();
                        if (context.mounted) Navigator.of(context).pop();
                      },
                      child: const Text('Explore Demo Data'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HighlightRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _HighlightRow({
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 2),
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: Theme.of(context).dividerColor.withOpacity(0.15),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 16, color: AppColors.accent),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
              const SizedBox(height: 2),
              Text(description, style: const TextStyle(fontSize: 12, height: 1.4, color: Colors.grey)),
            ],
          ),
        ),
      ],
    );
  }
}

