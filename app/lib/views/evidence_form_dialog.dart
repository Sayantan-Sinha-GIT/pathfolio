import 'package:flutter/material.dart';
import '../models/evidence_item.dart';
import '../services/validation_service.dart';
import '../state/app_state.dart';

class EvidenceFormDialog extends StatefulWidget {
  final AppState appState;
  final EvidenceItem? initialEvidence;

  const EvidenceFormDialog({
    super.key,
    required this.appState,
    this.initialEvidence,
  });

  static Future<EvidenceItem?> show(
    BuildContext context, {
    required AppState appState,
    EvidenceItem? initialEvidence,
  }) {
    return showDialog<EvidenceItem>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => EvidenceFormDialog(
        appState: appState,
        initialEvidence: initialEvidence,
      ),
    );
  }

  @override
  State<EvidenceFormDialog> createState() => _EvidenceFormDialogState();
}

class _EvidenceFormDialogState extends State<EvidenceFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _tagsController;
  late TextEditingController _resultController;
  late TextEditingController _urlController;

  @override
  void initState() {
    super.initState();
    final ev = widget.initialEvidence;
    _titleController = TextEditingController(text: ev?.title ?? '');
    _tagsController = TextEditingController(text: ev?.skillTags.join(', ') ?? '');
    _resultController = TextEditingController(text: ev?.conciseResult ?? '');
    _urlController = TextEditingController(text: ev?.sourceUrl ?? '');
  }

  @override
  void dispose() {
    _titleController.dispose();
    _tagsController.dispose();
    _resultController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final title = _titleController.text.trim();
    final rawTags = _tagsController.text.split(',');
    final tags = rawTags.map((e) => e.trim()).where((e) => e.isNotEmpty).toList();
    final result = _resultController.text.trim();
    final url = _urlController.text.trim().isNotEmpty ? _urlController.text.trim() : null;

    if (widget.initialEvidence == null) {
      final created = await widget.appState.addEvidence(
        title: title,
        skillTags: tags,
        conciseResult: result,
        sourceUrl: url,
      );
      if (mounted) Navigator.of(context).pop(created);
    } else {
      final updated = widget.initialEvidence!.copyWith(
        title: title,
        skillTags: tags,
        conciseResult: result,
        sourceUrl: url,
      );
      await widget.appState.updateEvidence(updated);
      if (mounted) Navigator.of(context).pop(updated);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.initialEvidence != null;

    return Dialog(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 520),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isEditing ? 'Edit Career Evidence' : 'Add Career Evidence',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 6),
                Text(
                  'Record quantifiable engineering accomplishments and project links.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 20),

                // Title
                TextFormField(
                  controller: _titleController,
                  autofocus: true,
                  decoration: const InputDecoration(
                    labelText: 'Evidence title *',
                    hintText: 'e.g. Distributed Telemetry Pipeline',
                    prefixIcon: Icon(Icons.stars_outlined, size: 20),
                  ),
                  validator: (v) => ValidationService.validateRequired(v, 'Title'),
                ),
                const SizedBox(height: 16),

                // Tags
                TextFormField(
                  controller: _tagsController,
                  decoration: const InputDecoration(
                    labelText: 'Skill tags (comma separated)',
                    hintText: 'e.g. Go, Kafka, Docker, Distributed Systems',
                    prefixIcon: Icon(Icons.label_outline_rounded, size: 20),
                  ),
                ),
                const SizedBox(height: 16),

                // Concise Result
                TextFormField(
                  controller: _resultController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Concise quantifiable result *',
                    hintText: 'e.g. Processed 15,000 events/sec with <20ms p99 latency during peak campus traffic.',
                    alignLabelWithHint: true,
                  ),
                  validator: (v) => ValidationService.validateRequired(v, 'Concise result'),
                ),
                const SizedBox(height: 16),

                // URL
                TextFormField(
                  controller: _urlController,
                  keyboardType: TextInputType.url,
                  decoration: const InputDecoration(
                    labelText: 'Reference link (GitHub PR, demo, blog)',
                    hintText: 'https://github.com/...',
                    prefixIcon: Icon(Icons.link_rounded, size: 20),
                  ),
                  validator: ValidationService.validateUrl,
                ),
                const SizedBox(height: 24),

                // Action buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Cancel'),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: _submit,
                      child: Text(isEditing ? 'Save Evidence' : 'Add Evidence'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

