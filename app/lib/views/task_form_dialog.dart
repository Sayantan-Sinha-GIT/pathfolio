import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/task_item.dart';
import '../services/validation_service.dart';
import '../state/app_state.dart';

class TaskFormDialog extends StatefulWidget {
  final AppState appState;
  final String? initialOpportunityId;
  final TaskItem? initialTask;

  const TaskFormDialog({
    super.key,
    required this.appState,
    this.initialOpportunityId,
    this.initialTask,
  });

  static Future<TaskItem?> show(
    BuildContext context, {
    required AppState appState,
    String? initialOpportunityId,
    TaskItem? initialTask,
  }) {
    return showDialog<TaskItem>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => TaskFormDialog(
        appState: appState,
        initialOpportunityId: initialOpportunityId,
        initialTask: initialTask,
      ),
    );
  }

  @override
  State<TaskFormDialog> createState() => _TaskFormDialogState();
}

class _TaskFormDialogState extends State<TaskFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  DateTime? _dueDate;
  String? _opportunityId;
  final DateFormat _dateFormat = DateFormat('MMM d, yyyy');

  @override
  void initState() {
    super.initState();
    final task = widget.initialTask;
    _titleController = TextEditingController(text: task?.title ?? '');
    _dueDate = task?.dueDate;
    _opportunityId = task?.opportunityId ?? widget.initialOpportunityId;

    if (_opportunityId == null && widget.appState.activeOpportunities.isNotEmpty) {
      _opportunityId = widget.appState.activeOpportunities.first.id;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  Future<void> _pickDueDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? now.add(const Duration(days: 2)),
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
    );
    if (picked != null) {
      setState(() => _dueDate = picked);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_opportunityId == null || _opportunityId!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select or create an opportunity first.')),
      );
      return;
    }

    final title = _titleController.text.trim();

    if (widget.initialTask == null) {
      final task = await widget.appState.addTask(
        opportunityId: _opportunityId!,
        title: title,
        dueDate: _dueDate,
      );
      if (mounted) Navigator.of(context).pop(task);
    } else {
      final updated = widget.initialTask!.copyWith(
        opportunityId: _opportunityId!,
        title: title,
        dueDate: _dueDate,
      );
      await widget.appState.updateTask(updated);
      if (mounted) Navigator.of(context).pop(updated);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.initialTask != null;
    final opportunities = widget.appState.allOpportunities;

    return Dialog(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 480),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isEditing ? 'Edit Follow-up Task' : 'Add Follow-up Task',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 6),
                Text(
                  'Keep momentum on interview rounds and recruiter messages.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 20),

                // Opportunity Selector (if not locked)
                if (widget.initialOpportunityId == null && opportunities.isNotEmpty) ...[
                  DropdownButtonFormField<String>(
                    initialValue: _opportunityId,
                    decoration: const InputDecoration(
                      labelText: 'Attached Opportunity *',
                      prefixIcon: Icon(Icons.business_outlined, size: 20),
                    ),
                    items: opportunities.map((opp) {
                      return DropdownMenuItem(
                        value: opp.id,
                        child: Text('${opp.company} — ${opp.role}', overflow: TextOverflow.ellipsis),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _opportunityId = val);
                    },
                  ),
                  const SizedBox(height: 16),
                ],

                // Title
                TextFormField(
                  controller: _titleController,
                  autofocus: true,
                  decoration: const InputDecoration(
                    labelText: 'Task title *',
                    hintText: 'e.g. Follow up on interview feedback',
                    prefixIcon: Icon(Icons.check_circle_outline, size: 20),
                  ),
                  validator: (v) => ValidationService.validateRequired(v, 'Task title'),
                ),
                const SizedBox(height: 16),

                // Due Date
                InkWell(
                  borderRadius: BorderRadius.circular(8),
                  onTap: _pickDueDate,
                  child: InputDecorator(
                    decoration: InputDecoration(
                      labelText: 'Due date (optional)',
                      prefixIcon: const Icon(Icons.event_outlined, size: 20),
                      suffixIcon: _dueDate != null
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              onPressed: () => setState(() => _dueDate = null),
                            )
                          : null,
                    ),
                    child: Text(
                      _dueDate != null ? _dateFormat.format(_dueDate!) : 'No due date set',
                      style: TextStyle(
                        color: _dueDate != null
                            ? Theme.of(context).textTheme.bodyLarge?.color
                            : Theme.of(context).hintColor,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Buttons
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
                      child: Text(isEditing ? 'Save Task' : 'Add Task'),
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

