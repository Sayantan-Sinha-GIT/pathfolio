import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

import '../models/backup_data.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';
import '../services/backup_file_service.dart';

class SettingsView extends StatefulWidget {
  final AppState appState;
  final BackupFileService backupFiles;

  const SettingsView({
    super.key,
    required this.appState,
    this.backupFiles = const BackupFileService(),
  });

  @override
  State<SettingsView> createState() => _SettingsViewState();
}

class _SettingsViewState extends State<SettingsView> {
  final DateFormat _dateFormat = DateFormat('MMMM d, yyyy • h:mm a');
  bool _fileBusy = false;

  void _showBackupError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _saveBackup(String json) async {
    if (_fileBusy) return;
    setState(() => _fileBusy = true);
    try {
      final saved = await widget.backupFiles.save(json);
      if (saved) {
        await widget.appState.exportBackupString();
        if (mounted)
          _showBackupError('Backup saved. Keep this file somewhere safe.');
      }
    } catch (_) {
      _showBackupError(
        'Could not save the backup. Try again or copy the JSON instead.',
      );
    } finally {
      if (mounted) setState(() => _fileBusy = false);
    }
  }

  Future<void> _handleImportFile() async {
    if (_fileBusy) return;
    setState(() => _fileBusy = true);
    String? json;
    try {
      json = await widget.backupFiles.pick();
    } on FormatException {
      _showBackupError(
        'Choose a valid UTF-8 JSON backup smaller than 10 MB. Your records were not changed.',
      );
    } catch (_) {
      _showBackupError(
        'Could not open that file. Try another backup or paste the JSON instead.',
      );
    } finally {
      if (mounted) setState(() => _fileBusy = false);
    }
    if (mounted && json != null) await _previewImport(json);
  }

  Future<void> _handleExportJson() async {
    final jsonStr = widget.appState.createBackup().toFormattedJson();

    if (!mounted) return;
    await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        scrollable: true,
        title: const Text('Export JSON Backup'),
        content: SizedBox(
          width: 520,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Your complete career workspace data has been packaged into a versioned JSON backup.',
              ),
              const SizedBox(height: 12),
              Container(
                height: 180,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardTheme.color,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Theme.of(context).dividerColor),
                ),
                child: SingleChildScrollView(
                  child: SelectableText(
                    jsonStr,
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Copy this JSON string or save it to a file. You can restore your data on any device.',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ),
        actions: [
          ElevatedButton.icon(
            icon: const Icon(Icons.save_alt_rounded, size: 16),
            label: const Text('Save Backup File'),
            onPressed: () {
              Navigator.of(ctx).pop();
              _saveBackup(jsonStr);
            },
          ),
          OutlinedButton.icon(
            icon: const Icon(Icons.copy_rounded, size: 16),
            label: const Text('Copy to Clipboard'),
            onPressed: () async {
              try {
                await Clipboard.setData(ClipboardData(text: jsonStr));
                await widget.appState.exportBackupString();
              } catch (_) {
                _showBackupError(
                  'Could not copy the backup. Use Save Backup File instead.',
                );
                return;
              }
              if (!ctx.mounted || !mounted) return;
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Backup JSON copied to clipboard!'),
                ),
              );
            },
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  Future<void> _handleImportJson() async {
    final textController = TextEditingController();

    final rawJson = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        scrollable: true,
        title: const Text('Import Backup JSON'),
        content: SizedBox(
          width: 520,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Paste your Pathfolio backup JSON text below. Schema validation and data integrity checks will be verified before any changes occur.',
              ),
              const SizedBox(height: 12),
              TextField(
                controller: textController,
                maxLines: 8,
                decoration: const InputDecoration(
                  hintText: 'Paste backup JSON string here...',
                  alignLabelWithHint: true,
                ),
                style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
              ),
            ],
          ),
        ),
        actions: [
          OutlinedButton(
            onPressed: () => Navigator.of(ctx).pop(null),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(textController.text),
            child: const Text('Validate & Preview'),
          ),
        ],
      ),
    );

    textController.dispose();
    if (rawJson == null || rawJson.trim().isEmpty || !mounted) return;
    await _previewImport(rawJson);
  }

  Future<void> _previewImport(String rawJson) async {
    // Run schema validation
    final validation = BackupData.validateAndParse(rawJson);
    if (!validation.isValid) {
      if (!mounted) return;
      await showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          scrollable: true,
          title: const Text('Invalid Backup File'),
          content: Text(
            'The backup data could not be imported because it failed validation:\n\n${validation.errorMessage}\n\nYour existing records were NOT changed.',
          ),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    // Preview and Confirmation Dialog
    if (!mounted) return;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        scrollable: true,
        title: const Text('Confirm Restore & Replace'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Validation passed! Restoring will replace your current workspace records with the backup contents:',
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              child: Column(
                children: [
                  _PreviewStatRow(
                    label: 'Opportunities',
                    count: validation.opportunityCount,
                  ),
                  _PreviewStatRow(
                    label: 'Follow-up Tasks',
                    count: validation.taskCount,
                  ),
                  _PreviewStatRow(
                    label: 'Career Evidence Items',
                    count: validation.evidenceCount,
                  ),
                  _PreviewStatRow(
                    label: 'Timeline Events',
                    count: validation.timelineCount,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Warning: This action will replace current local data.',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.crimson,
              ),
            ),
          ],
        ),
        actions: [
          // Cancel receives safe initial focus
          TextButton(
            autofocus: true,
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.accent),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Confirm & Replace Current Data'),
          ),
        ],
      ),
    );

    if (confirmed == true && validation.backupData != null) {
      try {
        await widget.appState.restoreBackup(validation.backupData!);
      } catch (_) {
        _showBackupError(
          'Could not restore the backup. Your existing records were kept. Free some device storage and retry.',
        );
        return;
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Backup restored successfully!')),
        );
      }
    }
  }

  Future<void> _handleEraseAll() async {
    final confirmController = TextEditingController();

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        scrollable: true,
        title: const Text('Erase All Workspace Data?'),
        content: SizedBox(
          width: 460,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'This will permanently delete ALL opportunities, tasks, evidence items, timeline history, and preferences from this device.',
              ),
              const SizedBox(height: 12),
              const Text(
                'To prevent accidental deletion, type "ERASE" below to confirm:',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: confirmController,
                autofocus: false,
                decoration: const InputDecoration(hintText: 'Type ERASE'),
              ),
            ],
          ),
        ),
        actions: [
          // Safe initial focus on Cancel
          TextButton(
            autofocus: true,
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.crimson),
            onPressed: () {
              if (confirmController.text.trim().toUpperCase() == 'ERASE') {
                Navigator.of(ctx).pop(true);
              } else {
                ScaffoldMessenger.of(ctx).showSnackBar(
                  const SnackBar(
                    content: Text('Please type ERASE to confirm.'),
                  ),
                );
              }
            },
            child: const Text('Erase Everything'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await widget.appState.eraseAllData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('All local workspace data has been erased.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = widget.appState;
    final isMobile = AppBreakpoints.isMobile(context);
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 24,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 800),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Settings & Data Privacy',
              style: theme.textTheme.headlineMedium,
            ),
            const SizedBox(height: 4),
            Text(
              'Audit local storage guarantees, export backups, and configure preferences.',
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),

            // Local-Only Privacy Guarantee Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(
                          Icons.shield_outlined,
                          color: AppColors.emerald,
                          size: 24,
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Local-Only Storage Architecture',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Pathfolio operates offline on your device. All opportunities, private notes, follow-up tasks, and career evidence items are stored locally in your browser storage or Android app sandbox. Browser data can be cleared by browser profile settings, so regular JSON backup exports are recommended.',
                      style: TextStyle(fontSize: 13.5, height: 1.5),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      '• No cloud databases\n• No third-party analytics or tracking\n• No mandatory user accounts or logins\n• Data never leaves this device unless you explicitly export a JSON backup.',
                      style: TextStyle(
                        fontSize: 13,
                        height: 1.6,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Backup & Restore Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Data Backup & Restore',
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Export your entire workspace as a portable JSON backup, or restore an earlier backup from another device.',
                      style: theme.textTheme.bodySmall,
                    ),
                    const SizedBox(height: 16),

                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        ElevatedButton.icon(
                          icon: const Icon(Icons.download_rounded, size: 18),
                          label: const Text('Export JSON Backup'),
                          onPressed: _fileBusy ? null : _handleExportJson,
                        ),
                        OutlinedButton.icon(
                          icon: const Icon(Icons.folder_open_rounded, size: 18),
                          label: const Text('Open Backup File'),
                          onPressed: _fileBusy ? null : _handleImportFile,
                        ),
                        OutlinedButton.icon(
                          icon: const Icon(Icons.upload_rounded, size: 18),
                          label: const Text('Paste Backup JSON'),
                          onPressed: _fileBusy ? null : _handleImportJson,
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      appState.lastExportDate != null
                          ? 'Last backup exported on: ${_dateFormat.format(appState.lastExportDate!)}'
                          : 'No backup has been exported yet in this session.',
                      style: TextStyle(fontSize: 12, color: theme.hintColor),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Demo Workspace Management Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Sample Demo Workspace',
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Explore Pathfolio with realistic student and early-career job applications, interview timelines, and evidence items.',
                      style: theme.textTheme.bodySmall,
                    ),
                    const SizedBox(height: 16),

                    if (appState.isDemoWorkspace)
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.amberBg,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'Demo Workspace Active',
                              style: TextStyle(
                                color: AppColors.amber,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          OutlinedButton.icon(
                            icon: const Icon(
                              Icons.delete_sweep_rounded,
                              size: 18,
                              color: AppColors.crimson,
                            ),
                            label: const Text(
                              'Clear Demo Workspace',
                              style: TextStyle(color: AppColors.crimson),
                            ),
                            onPressed: () => appState.clearDemoWorkspace(),
                          ),
                        ],
                      )
                    else
                      OutlinedButton.icon(
                        icon: const Icon(Icons.science_outlined, size: 18),
                        label: const Text('Load Sample Demo Workspace'),
                        onPressed: () => appState.loadDemoWorkspace(),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Appearance & Accessibility Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Appearance & Motion',
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 16),

                    // Theme selector
                    Wrap(
                      spacing: 16,
                      runSpacing: 12,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Color Theme',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              'Choose light porcelain or dark slate aesthetic',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                        SegmentedButton<ThemeMode>(
                          segments: const [
                            ButtonSegment(
                              value: ThemeMode.system,
                              label: Text('System'),
                            ),
                            ButtonSegment(
                              value: ThemeMode.light,
                              label: Text('Light'),
                            ),
                            ButtonSegment(
                              value: ThemeMode.dark,
                              label: Text('Dark'),
                            ),
                          ],
                          selected: {appState.themeMode},
                          onSelectionChanged: (set) =>
                              appState.setThemeMode(set.first),
                        ),
                      ],
                    ),
                    const Divider(height: 24),

                    // Reduced motion toggle
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text(
                        'Reduce Motion & Animations',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                      subtitle: const Text(
                        'Minimize screen transitions and decorative movement',
                        style: TextStyle(fontSize: 12),
                      ),
                      value: appState.reduceMotion,
                      onChanged: (val) => appState.setReduceMotion(val),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Danger Zone Card: Erase All Data
            Card(
              shape: RoundedRectangleBorder(
                side: BorderSide(color: AppColors.crimson.withOpacity(0.4)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(
                          Icons.delete_forever_rounded,
                          color: AppColors.crimson,
                          size: 22,
                        ),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Danger Zone: Erase All Data',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.crimson,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Permanently delete all records from this browser or app installation. There is no server recovery.',
                      style: TextStyle(fontSize: 13),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.crimson,
                      ),
                      icon: const Icon(Icons.delete_outline_rounded, size: 18),
                      label: const Text('Erase All Workspace Data'),
                      onPressed: _handleEraseAll,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PreviewStatRow extends StatelessWidget {
  final String label;
  final int count;

  const _PreviewStatRow({required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(label, style: const TextStyle(fontSize: 13))),
          const SizedBox(width: 8),
          Text(
            '$count',
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          ),
        ],
      ),
    );
  }
}
