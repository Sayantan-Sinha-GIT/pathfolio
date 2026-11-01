import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/opportunity.dart';
import '../models/stage.dart';
import '../services/validation_service.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';

class OpportunityFormDialog extends StatefulWidget {
  final AppState appState;
  final Opportunity? initialOpportunity;
  final JobStage? initialStage;

  const OpportunityFormDialog({
    super.key,
    required this.appState,
    this.initialOpportunity,
    this.initialStage,
  });

  static Future<Opportunity?> show(
    BuildContext context, {
    required AppState appState,
    Opportunity? initialOpportunity,
    JobStage? initialStage,
  }) {
    return showDialog<Opportunity>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => OpportunityFormDialog(
        appState: appState,
        initialOpportunity: initialOpportunity,
        initialStage: initialStage,
      ),
    );
  }

  @override
  State<OpportunityFormDialog> createState() => _OpportunityFormDialogState();
}

class _OpportunityFormDialogState extends State<OpportunityFormDialog> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _companyController;
  late TextEditingController _roleController;
  late TextEditingController _urlController;
  late TextEditingController _locationController;
  late TextEditingController _salaryController;
  late TextEditingController _notesController;

  late JobStage _stage;
  DateTime? _applicationDate;
  DateTime? _nextActionDate;
  late List<String> _attachedEvidenceIds;

  final DateFormat _dateFormat = DateFormat('MMM d, yyyy');

  @override
  void initState() {
    super.initState();
    final opp = widget.initialOpportunity;
    _companyController = TextEditingController(text: opp?.company ?? '');
    _roleController = TextEditingController(text: opp?.role ?? '');
    _urlController = TextEditingController(text: opp?.sourceUrl ?? '');
    _locationController = TextEditingController(text: opp?.location ?? '');
    _salaryController = TextEditingController(text: opp?.salaryNote ?? '');
    _notesController = TextEditingController(text: opp?.privateNotes ?? '');

    _stage = opp?.stage ?? widget.initialStage ?? JobStage.saved;
    _applicationDate = opp?.applicationDate;
    _nextActionDate = opp?.nextActionDate;
    _attachedEvidenceIds = List.from(opp?.attachedEvidenceIds ?? []);
  }

  @override
  void dispose() {
    _companyController.dispose();
    _roleController.dispose();
    _urlController.dispose();
    _locationController.dispose();
    _salaryController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate({required bool isApplicationDate}) async {
    final now = DateTime.now();
    final initial = isApplicationDate
        ? (_applicationDate ?? now)
        : (_nextActionDate ?? now.add(const Duration(days: 3)));

    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
    );

    if (picked != null) {
      setState(() {
        if (isApplicationDate) {
          _applicationDate = picked;
        } else {
          _nextActionDate = picked;
        }
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final company = _companyController.text.trim();
    final role = _roleController.text.trim();
    final url = _urlController.text.trim().isNotEmpty ? _urlController.text.trim() : null;
    final location = _locationController.text.trim();
    final salary = _salaryController.text.trim();
    final notes = _notesController.text.trim();

    if (widget.initialOpportunity == null) {
      final created = await widget.appState.createOpportunity(
        company: company,
        role: role,
        stage: _stage,
        sourceUrl: url,
        location: location,
        salaryNote: salary,
        applicationDate: _applicationDate,
        nextActionDate: _nextActionDate,
        privateNotes: notes,
        attachedEvidenceIds: _attachedEvidenceIds,
      );
      if (mounted) Navigator.of(context).pop(created);
    } else {
      final updated = widget.initialOpportunity!.copyWith(
        company: company,
        role: role,
        stage: _stage,
        sourceUrl: url,
        location: location,
        salaryNote: salary,
        applicationDate: _applicationDate,
        nextActionDate: _nextActionDate,
        privateNotes: notes,
        attachedEvidenceIds: _attachedEvidenceIds,
      );
      await widget.appState.updateOpportunity(updated);
      if (mounted) Navigator.of(context).pop(updated);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.initialOpportunity != null;
    final allEvidence = widget.appState.allEvidence;

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 580, maxHeight: 720),
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 16, 16),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isEditing ? 'Edit Opportunity' : 'New Opportunity',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Track applications, interview milestones, and follow-ups.',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    tooltip: 'Close dialog',
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            // Scrollable Form Body
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Company & Role Row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _companyController,
                              decoration: const InputDecoration(
                                labelText: 'Company name *',
                                hintText: 'e.g. Stripe, Linear',
                                prefixIcon: Icon(Icons.business_outlined, size: 20),
                              ),
                              validator: (v) => ValidationService.validateRequired(v, 'Company name'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _roleController,
                              decoration: const InputDecoration(
                                labelText: 'Role title *',
                                hintText: 'e.g. Systems Engineer',
                                prefixIcon: Icon(Icons.badge_outlined, size: 20),
                              ),
                              validator: (v) => ValidationService.validateRequired(v, 'Role title'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Stage Selector & Source URL
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 5,
                            child: DropdownButtonFormField<JobStage>(
                              value: _stage,
                              decoration: const InputDecoration(
                                labelText: 'Current stage',
                                prefixIcon: Icon(Icons.filter_list_rounded, size: 20),
                              ),
                              items: JobStage.values.map((s) {
                                return DropdownMenuItem(
                                  value: s,
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 10,
                                        height: 10,
                                        decoration: BoxDecoration(
                                          color: s.color,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(s.displayName),
                                    ],
                                  ),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _stage = val);
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            flex: 7,
                            child: TextFormField(
                              controller: _urlController,
                              keyboardType: TextInputType.url,
                              decoration: const InputDecoration(
                                labelText: 'Job posting / referral URL',
                                hintText: 'https://...',
                                prefixIcon: Icon(Icons.link_rounded, size: 20),
                              ),
                              validator: ValidationService.validateUrl,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Location & Salary
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _locationController,
                              decoration: const InputDecoration(
                                labelText: 'Location / Work mode',
                                hintText: 'e.g. Seattle, WA • Hybrid',
                                prefixIcon: Icon(Icons.location_on_outlined, size: 20),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _salaryController,
                              decoration: const InputDecoration(
                                labelText: 'Salary / Compensation note',
                                hintText: 'e.g. \$130k base + equity',
                                prefixIcon: Icon(Icons.payments_outlined, size: 20),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Dates Row
                      Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              borderRadius: BorderRadius.circular(8),
                              onTap: () => _pickDate(isApplicationDate: true),
                              child: InputDecorator(
                                decoration: InputDecoration(
                                  labelText: 'Application date',
                                  prefixIcon: const Icon(Icons.calendar_today_outlined, size: 18),
                                  suffixIcon: _applicationDate != null
                                      ? IconButton(
                                          icon: const Icon(Icons.clear_rounded, size: 18),
                                          onPressed: () => setState(() => _applicationDate = null),
                                        )
                                      : null,
                                ),
                                child: Text(
                                  _applicationDate != null
                                      ? _dateFormat.format(_applicationDate!)
                                      : 'Not specified',
                                  style: TextStyle(
                                    color: _applicationDate != null
                                        ? Theme.of(context).textTheme.bodyLarge?.color
                                        : Theme.of(context).hintColor,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: InkWell(
                              borderRadius: BorderRadius.circular(8),
                              onTap: () => _pickDate(isApplicationDate: false),
                              child: InputDecorator(
                                decoration: InputDecoration(
                                  labelText: 'Next action date',
                                  prefixIcon: const Icon(Icons.alarm_outlined, size: 18),
                                  suffixIcon: _nextActionDate != null
                                      ? IconButton(
                                          icon: const Icon(Icons.clear_rounded, size: 18),
                                          onPressed: () => setState(() => _nextActionDate = null),
                                        )
                                      : null,
                                ),
                                child: Text(
                                  _nextActionDate != null
                                      ? _dateFormat.format(_nextActionDate!)
                                      : 'No deadline set',
                                  style: TextStyle(
                                    color: _nextActionDate != null
                                        ? Theme.of(context).textTheme.bodyLarge?.color
                                        : Theme.of(context).hintColor,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Private Notes
                      TextFormField(
                        controller: _notesController,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          labelText: 'Private notes & interview strategy',
                          hintText: 'Notes on hiring manager, technical expectations, question prep...',
                          alignLabelWithHint: true,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Evidence Attachment Section
                      if (allEvidence.isNotEmpty) ...[
                        Text(
                          'Attach Career Evidence',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Select evidence items from your career bank to reference in this application:',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: allEvidence.map((ev) {
                            final isAttached = _attachedEvidenceIds.contains(ev.id);
                            return FilterChip(
                              label: Text(ev.title),
                              selected: isAttached,
                              onSelected: (selected) {
                                setState(() {
                                  if (selected) {
                                    _attachedEvidenceIds.add(ev.id);
                                  } else {
                                    _attachedEvidenceIds.remove(ev.id);
                                  }
                                });
                              },
                              selectedColor: AppColors.accentLight,
                              checkmarkColor: AppColors.accent,
                            );
                          }).toList(),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),

            // Dialog Actions Footer
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    icon: Icon(isEditing ? Icons.check_rounded : Icons.add_rounded, size: 18),
                    label: Text(isEditing ? 'Save Changes' : 'Create Opportunity'),
                    onPressed: _submit,
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

