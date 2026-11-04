import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GuideDialog extends StatelessWidget {
  const GuideDialog({super.key});

  static void show(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const GuideDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Dialog(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 600, maxHeight: 680),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 16, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.help_outline_rounded, color: AppColors.accent, size: 22),
                      const SizedBox(width: 10),
                      Text('Pathfolio User Guide', style: theme.textTheme.headlineSmall),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _GuideSection(
                      title: '1. Managing the Application Pipeline',
                      body: 'Every application starts in Saved, Applied, Screening, Interview, Offer, or Rejected. You can move opportunities between stages directly from the Kanban board or opportunity detail page. Pathfolio automatically timestamps each movement in your Activity History.',
                    ),
                    const SizedBox(height: 18),
                    _GuideSection(
                      title: '2. Follow-ups & Deadlines',
                      body: 'Attach actionable tasks to any opportunity. Deadlines past today are marked Overdue and highlighted on your Dashboard. Completing tasks marks them done and logs an entry in your timeline.',
                    ),
                    const SizedBox(height: 18),
                    _GuideSection(
                      title: '3. Career Evidence Bank',
                      body: 'Store quantifiable engineering achievements (e.g. latency reductions, scale metrics, architecture overhauls) with skill tags and source PR/demo links. Reference them in your applications so you can cite concrete proof in interviews without re-uploading resume documents.',
                    ),
                    const SizedBox(height: 18),
                    _GuideSection(
                      title: '4. Local Storage & Backups',
                      body: 'Your data stays on your device using local client storage (browser local storage on web, sandboxed app storage on Android). Note that clearing browser site data clears web storage, so use "Export JSON Backup" in Settings to keep versioned backups and transfer between devices.',
                    ),
                    const SizedBox(height: 18),
                    _GuideSection(
                      title: '5. Keyboard Navigation & Accessibility',
                      body: 'On the web and desktop, you can navigate using standard Tab, Shift+Tab, and Enter keys. Dialogs can be dismissed cleanly with Escape or Cancel buttons. The palette is designed for high visual contrast, and reduced motion settings can be toggled in Settings.',
                    ),
                  ],
                ),
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Got it'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GuideSection extends StatelessWidget {
  final String title;
  final String body;

  const _GuideSection({required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
        const SizedBox(height: 4),
        Text(body, style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.grey)),
      ],
    );
  }
}

