import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/opportunity.dart';
import '../models/stage.dart';
import '../models/task_item.dart';
import '../models/evidence_item.dart';
import '../models/timeline_entry.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';
import 'opportunity_form_dialog.dart';
import 'task_form_dialog.dart';

class OpportunityDetailView extends StatelessWidget {
  final String opportunityId;
  final AppState appState;
  final VoidCallback onBack;

  const OpportunityDetailView({
    super.key,
    required this.opportunityId,
    required this.appState,
    required this.onBack,
  });

  Future<void> _launchUrl(BuildContext context, String? urlString) async {
    if (urlString == null || urlString.isEmpty) return;
    final uri = Uri.tryParse(urlString);
    if (uri != null && await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open external link safely.')),
        );
      }
    }
  }

  Future<void> _confirmDelete(BuildContext context, Opportunity opp) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Opportunity?'),
        content: Text(
          'Are you sure you want to permanently delete "${opp.company} — ${opp.role}" and all its attached tasks and timeline? This action cannot be undone.',
        ),
        actions: [
          // Cancel receives safe initial focus
          TextButton(
            autofocus: true,
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.crimson),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Delete Permanently'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await appState.deleteOpportunity(opp.id);
      onBack();
    }
  }

  void _showAttachEvidenceDialog(BuildContext context, Opportunity opp) {
    final allEvidence = appState.allEvidence;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            title: const Text('Attach Career Evidence'),
            content: SizedBox(
              width: 480,
              child: allEvidence.isEmpty
                  ? const Text('Your Career Evidence Bank is currently empty. Add evidence items from the Evidence Bank tab first.')
                  : Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: allEvidence.map((ev) {
                        final isAttached = opp.attachedEvidenceIds.contains(ev.id);
                        return FilterChip(
                          label: Text(ev.title),
                          selected: isAttached,
                          selectedColor: AppColors.accentLight,
                          checkmarkColor: AppColors.accent,
                          onSelected: (_) async {
                            await appState.toggleAttachEvidence(opp.id, ev.id);
                            setModalState(() {});
                          },
                        );
                      }).toList(),
                    ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('Done'),
              ),
            ],
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final opp = appState.getOpportunityById(opportunityId);
    if (opp == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Opportunity not found or was deleted.'),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: onBack, child: const Text('Back to Pipeline')),
          ],
        ),
      );
    }

    final tasks = appState.tasksForOpportunity(opp.id);
    final timeline = appState.timelineForOpportunity(opp.id);
    final evidence = appState.evidenceForOpportunity(opp.id);
    final dateFormat = DateFormat('MMMM d, yyyy');
    final isDesktop = AppBreakpoints.isDesktop(context);
    final isMobile = AppBreakpoints.isMobile(context);
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 24,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Back Link & Actions Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                icon: const Icon(Icons.arrow_back_rounded, size: 18),
                label: const Text('Back to Pipeline'),
                onPressed: onBack,
              ),
              Row(
                children: [
                  if (opp.isArchived)
                    OutlinedButton.icon(
                      icon: const Icon(Icons.unarchive_outlined, size: 16),
                      label: const Text('Restore'),
                      onPressed: () => appState.restoreOpportunity(opp.id),
                    )
                  else
                    OutlinedButton.icon(
                      icon: const Icon(Icons.archive_outlined, size: 16),
                      label: const Text('Archive'),
                      onPressed: () => appState.archiveOpportunity(opp.id),
                    ),
                  const SizedBox(width: 8),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.edit_outlined, size: 16),
                    label: const Text('Edit'),
                    onPressed: () => OpportunityFormDialog.show(
                      context,
                      appState: appState,
                      initialOpportunity: opp,
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.delete_outline_rounded, color: AppColors.crimson),
                    tooltip: 'Delete Opportunity',
                    onPressed: () => _confirmDelete(context, opp),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Main Title & Overview Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              opp.company,
                              style: theme.textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              opp.role,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                                color: theme.hintColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: opp.stage.containerColor,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: opp.stage.color.withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(width: 8, height: 8, decoration: BoxDecoration(color: opp.stage.color, shape: BoxShape.circle)),
                            const SizedBox(width: 8),
                            Text(
                              opp.stage.displayName,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: opp.stage.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Key Details Grid
                  Wrap(
                    spacing: 24,
                    runSpacing: 12,
                    children: [
                      if (opp.location.isNotEmpty)
                        _DetailMetric(label: 'Location / Work Mode', value: opp.location, icon: Icons.location_on_outlined),
                      if (opp.salaryNote.isNotEmpty)
                        _DetailMetric(label: 'Compensation', value: opp.salaryNote, icon: Icons.payments_outlined),
                      if (opp.applicationDate != null)
                        _DetailMetric(label: 'Application Date', value: dateFormat.format(opp.applicationDate!), icon: Icons.calendar_today_outlined),
                      if (opp.nextActionDate != null)
                        _DetailMetric(label: 'Next Action Deadline', value: dateFormat.format(opp.nextActionDate!), icon: Icons.alarm_outlined),
                      if (opp.sourceUrl != null && opp.sourceUrl!.isNotEmpty)
                        InkWell(
                          onTap: () => _launchUrl(context, opp.sourceUrl),
                          child: _DetailMetric(
                            label: 'Job Posting Link',
                            value: 'Open External URL ↗',
                            icon: Icons.open_in_new_rounded,
                            isLink: true,
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Interactive Stage Progress Bar
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Stage Progression', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 6),
                  Text('Click any stage below to update the status and record timeline history:', style: theme.textTheme.bodySmall),
                  const SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: JobStage.values.map((s) {
                        final isCurrent = opp.stage == s;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Row(
                              children: [
                                Icon(s.icon, size: 16, color: isCurrent ? Colors.white : s.color),
                                const SizedBox(width: 6),
                                Text(s.displayName),
                              ],
                            ),
                            selected: isCurrent,
                            selectedColor: s.color,
                            labelStyle: TextStyle(
                              color: isCurrent ? Colors.white : null,
                              fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                            ),
                            onSelected: (val) {
                              if (val) appState.changeOpportunityStage(opp.id, s);
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // 2-Column Split: Tasks & Evidence on Left, Notes & Timeline on Right
          if (isDesktop)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 6,
                  child: Column(
                    children: [
                      _buildTasksCard(context, opp, tasks),
                      const SizedBox(height: 20),
                      _buildEvidenceCard(context, opp, evidence),
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  flex: 5,
                  child: Column(
                    children: [
                      _buildNotesCard(context, opp),
                      const SizedBox(height: 20),
                      _buildTimelineCard(context, timeline),
                    ],
                  ),
                ),
              ],
            )
          else ...[
            _buildTasksCard(context, opp, tasks),
            const SizedBox(height: 20),
            _buildNotesCard(context, opp),
            const SizedBox(height: 20),
            _buildEvidenceCard(context, opp, evidence),
            const SizedBox(height: 20),
            _buildTimelineCard(context, timeline),
          ],
        ],
      ),
    );
  }

  Widget _buildTasksCard(BuildContext context, Opportunity opp, List<TaskItem> tasks) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('MMM d');

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Follow-up Tasks (${tasks.length})', style: theme.textTheme.titleMedium),
                ElevatedButton.icon(
                  icon: const Icon(Icons.add_rounded, size: 16),
                  label: const Text('Add Task'),
                  onPressed: () => TaskFormDialog.show(
                    context,
                    appState: appState,
                    initialOpportunityId: opp.id,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (tasks.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Center(
                  child: Text(
                    'No tasks attached to this opportunity yet.',
                    style: theme.textTheme.bodyMedium,
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: tasks.length,
                separatorBuilder: (_, __) => const Divider(height: 8),
                itemBuilder: (context, index) {
                  final task = tasks[index];
                  final isOverdue = task.isOverdue();

                  return Row(
                    children: [
                      Checkbox(
                        value: task.isCompleted,
                        activeColor: AppColors.accent,
                        onChanged: (_) => appState.toggleTaskComplete(task.id),
                      ),
                      Expanded(
                        child: Text(
                          task.title,
                          style: TextStyle(
                            fontSize: 13.5,
                            decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                          ),
                        ),
                      ),
                      if (task.dueDate != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          margin: const EdgeInsets.only(right: 8),
                          decoration: BoxDecoration(
                            color: isOverdue ? AppColors.crimsonBg : theme.dividerColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            dateFormat.format(task.dueDate!),
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: isOverdue ? AppColors.crimson : theme.textTheme.bodyMedium?.color,
                            ),
                          ),
                        ),
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, size: 18),
                        tooltip: 'Edit Task',
                        onPressed: () => TaskFormDialog.show(
                          context,
                          appState: appState,
                          initialTask: task,
                          initialOpportunityId: opp.id,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline_rounded, size: 18),
                        tooltip: 'Delete Task',
                        onPressed: () => appState.deleteTask(task.id),
                      ),
                    ],
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildEvidenceCard(BuildContext context, Opportunity opp, List<EvidenceItem> evidence) {
    final theme = Theme.of(context);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Referenced Career Evidence (${evidence.length})', style: theme.textTheme.titleMedium),
                OutlinedButton.icon(
                  icon: const Icon(Icons.link_rounded, size: 16),
                  label: const Text('Manage Attachments'),
                  onPressed: () => _showAttachEvidenceDialog(context, opp),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (evidence.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Center(
                  child: Text(
                    'No career evidence linked. Attach achievements to cite during interviews.',
                    style: theme.textTheme.bodyMedium,
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: evidence.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final ev = evidence[index];
                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: theme.cardTheme.color,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: theme.dividerColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(ev.title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                        const SizedBox(height: 4),
                        Text(ev.conciseResult, style: const TextStyle(fontSize: 12.5)),
                        if (ev.skillTags.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 4,
                            children: ev.skillTags.map((tag) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: theme.dividerColor.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(tag, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w500)),
                            )).toList(),
                          ),
                        ],
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotesCard(BuildContext context, Opportunity opp) {
    final theme = Theme.of(context);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Private Notes & Strategy', style: theme.textTheme.titleMedium),
                IconButton(
                  icon: const Icon(Icons.edit_outlined, size: 18),
                  tooltip: 'Edit notes',
                  onPressed: () => OpportunityFormDialog.show(context, appState: appState, initialOpportunity: opp),
                ),
              ],
            ),
            const SizedBox(height: 12),
            opp.privateNotes.isEmpty
                ? Text('No private notes recorded. Click edit to jot down talking points.', style: theme.textTheme.bodyMedium)
                : Text(opp.privateNotes, style: const TextStyle(fontSize: 13.5, height: 1.5)),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineCard(BuildContext context, List<TimelineEntry> timeline) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('MMM d, yyyy • h:mm a');

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Activity Timeline', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            if (timeline.isEmpty)
              Text('No timeline activity logged yet.', style: theme.textTheme.bodyMedium)
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: timeline.length,
                separatorBuilder: (_, __) => const Divider(height: 12),
                itemBuilder: (context, index) {
                  final te = timeline[index];
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(te.description, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w500)),
                      const SizedBox(height: 2),
                      Text(dateFormat.format(te.timestamp), style: TextStyle(fontSize: 11, color: theme.hintColor)),
                    ],
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}

class _DetailMetric extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final bool isLink;

  const _DetailMetric({
    required this.label,
    required this.value,
    required this.icon,
    this.isLink = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 18, color: isLink ? AppColors.accent : theme.hintColor),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(fontSize: 11, color: theme.hintColor)),
            Text(
              value,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isLink ? AppColors.accent : theme.colorScheme.onSurface,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

