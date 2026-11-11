import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/opportunity.dart';
import '../models/stage.dart';
import '../models/task_item.dart';
import '../models/timeline_entry.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';
import 'opportunity_form_dialog.dart';
import 'task_form_dialog.dart';

class DashboardView extends StatelessWidget {
  final AppState appState;
  final Function(int tabIndex, {JobStage? stage, Opportunity? opportunity}) onNavigate;

  const DashboardView({
    super.key,
    required this.appState,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    final counts = appState.stageCounts;
    final overdue = appState.overdueTasks;
    final upcoming = appState.upcomingTasks;
    final recentTimeline = appState.recentTimelineEntries;
    final isDesktop = AppBreakpoints.isDesktop(context);
    final isMobile = AppBreakpoints.isMobile(context);

    final totalActive = appState.activeOpportunities.length;

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 24,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner if Demo Workspace is Active
          if (appState.isDemoWorkspace)
            Container(
              margin: const EdgeInsets.only(bottom: 24),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.amberBg,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.amber.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, color: AppColors.amber, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Demo Workspace Active — Sample opportunities and tasks are loaded for preview. Real data remains private on your device.',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Theme.of(context).brightness == Brightness.dark
                            ? Colors.amber[200]
                            : const Color(0xFF7A4500),
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () => appState.clearDemoWorkspace(),
                    child: const Text('Erase Demo Data', style: TextStyle(color: AppColors.amber, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Application Command Center',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      totalActive == 0
                          ? 'Zero active applications. Add your first opportunity below.'
                          : '$totalActive active applications across ${JobStage.values.length} stages.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
              if (!isMobile)
                Row(
                  children: [
                    OutlinedButton.icon(
                      icon: const Icon(Icons.add_task_rounded, size: 18),
                      label: const Text('New Task'),
                      onPressed: () => TaskFormDialog.show(context, appState: appState),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.add_rounded, size: 18),
                      label: const Text('New Opportunity'),
                      onPressed: () => OpportunityFormDialog.show(context, appState: appState),
                    ),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 24),

          // Stage Metrics Cards Grid
          LayoutBuilder(
            builder: (context, constraints) {
              final double cardWidth = isDesktop
                  ? (constraints.maxWidth - (5 * 12)) / 6
                  : (constraints.maxWidth - 12) / 2;

              return Wrap(
                spacing: 12,
                runSpacing: 12,
                children: JobStage.values.map((stage) {
                  final count = counts[stage] ?? 0;
                  return SizedBox(
                    width: cardWidth,
                    child: _StageMetricCard(
                      stage: stage,
                      count: count,
                      onTap: () {
                        // Navigate to Pipeline tab filtered to this stage
                        onNavigate(1, stage: stage);
                      },
                    ),
                  );
                }).toList(),
              );
            },
          ),
          const SizedBox(height: 32),

          // 2-Column Split: Action Items & Activity Timeline
          if (isDesktop)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 6,
                  child: _TasksDashboardSection(
                    appState: appState,
                    overdue: overdue,
                    upcoming: upcoming,
                    onNavigate: onNavigate,
                  ),
                ),
                const SizedBox(width: 24),
                Expanded(
                  flex: 5,
                  child: _ActivityTimelineSection(
                    timeline: recentTimeline,
                    appState: appState,
                    onNavigate: onNavigate,
                  ),
                ),
              ],
            )
          else ...[
            _TasksDashboardSection(
              appState: appState,
              overdue: overdue,
              upcoming: upcoming,
              onNavigate: onNavigate,
            ),
            const SizedBox(height: 32),
            _ActivityTimelineSection(
              timeline: recentTimeline,
              appState: appState,
              onNavigate: onNavigate,
            ),
          ],
        ],
      ),
    );
  }
}

class _StageMetricCard extends StatefulWidget {
  final JobStage stage;
  final int count;
  final VoidCallback onTap;

  const _StageMetricCard({
    required this.stage,
    required this.count,
    required this.onTap,
  });

  @override
  State<_StageMetricCard> createState() => _StageMetricCardState();
}

class _StageMetricCardState extends State<_StageMetricCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: InkWell(
        onTap: widget.onTap,
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: _isHovered
                ? (isDark ? AppColors.darkSurfaceSubdued : AppColors.lightSurfaceSubdued)
                : theme.cardTheme.color,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: _isHovered ? widget.stage.color : ((theme.cardTheme.shape as RoundedRectangleBorder?)?.side.color ?? AppColors.lightBorder),
              width: _isHovered ? 1.5 : 1.0,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: widget.stage.color.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(widget.stage.icon, size: 16, color: widget.stage.color),
                  ),
                  Text(
                    '${widget.count}',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: widget.count > 0 ? theme.colorScheme.onSurface : theme.hintColor,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                widget.stage.displayName,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 2),
              Text(
                'View list →',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: _isHovered ? widget.stage.color : theme.hintColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TasksDashboardSection extends StatelessWidget {
  final AppState appState;
  final List<TaskItem> overdue;
  final List<TaskItem> upcoming;
  final Function(int, {JobStage? stage, Opportunity? opportunity}) onNavigate;

  const _TasksDashboardSection({
    required this.appState,
    required this.overdue,
    required this.upcoming,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
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
                Expanded(
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        'Action Items & Deadlines',
                        style: theme.textTheme.titleMedium,
                      ),
                      if (overdue.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.crimsonBg,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.crimson.withOpacity(0.3)),
                          ),
                          child: Text(
                            '${overdue.length} overdue',
                            style: const TextStyle(fontSize: 11, color: AppColors.crimson, fontWeight: FontWeight.w600),
                          ),
                        ),
                    ],
                  ),
                ),
                TextButton.icon(
                  icon: const Icon(Icons.add_rounded, size: 16),
                  label: const Text('Add Task'),
                  onPressed: () => TaskFormDialog.show(context, appState: appState),
                ),
              ],
            ),
            const SizedBox(height: 14),

            if (overdue.isEmpty && upcoming.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 32),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.done_all_rounded, size: 36, color: theme.hintColor.withOpacity(0.5)),
                      const SizedBox(height: 10),
                      Text(
                        'All caught up. No pending deadlines or follow-ups.',
                        style: theme.textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
              )
            else ...[
              // Overdue List
              if (overdue.isNotEmpty) ...[
                const Text(
                  'OVERDUE',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: AppColors.crimson),
                ),
                const SizedBox(height: 8),
                ...overdue.map((task) => _TaskItemRow(task: task, appState: appState, isOverdue: true, dateFormat: dateFormat, onNavigate: onNavigate)),
                const SizedBox(height: 16),
              ],

              // Upcoming List
              if (upcoming.isNotEmpty) ...[
                Text(
                  'UPCOMING THIS WEEK',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.6,
                    color: theme.textTheme.labelSmall?.color,
                  ),
                ),
                const SizedBox(height: 8),
                ...upcoming.map((task) => _TaskItemRow(task: task, appState: appState, isOverdue: false, dateFormat: dateFormat, onNavigate: onNavigate)),
              ],
            ],
          ],
        ),
      ),
    );
  }
}

class _TaskItemRow extends StatelessWidget {
  final TaskItem task;
  final AppState appState;
  final bool isOverdue;
  final DateFormat dateFormat;
  final Function(int, {JobStage? stage, Opportunity? opportunity}) onNavigate;

  const _TaskItemRow({
    required this.task,
    required this.appState,
    required this.isOverdue,
    required this.dateFormat,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    final opp = appState.getOpportunityById(task.opportunityId);
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Checkbox(
            value: task.isCompleted,
            activeColor: AppColors.accent,
            onChanged: (_) => appState.toggleTaskComplete(task.id),
          ),
          Expanded(
            child: InkWell(
              borderRadius: BorderRadius.circular(6),
              onTap: opp != null ? () => onNavigate(1, opportunity: opp) : null,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      task.title,
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w500,
                        decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    if (opp != null)
                      Text(
                        '${opp.company} • ${opp.role}',
                        style: TextStyle(fontSize: 11.5, color: theme.hintColor),
                      ),
                  ],
                ),
              ),
            ),
          ),
          if (task.dueDate != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: isOverdue ? AppColors.crimsonBg : theme.dividerColor.withOpacity(0.15),
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
            icon: const Icon(Icons.edit_outlined, size: 16),
            tooltip: 'Edit Task',
            onPressed: () => TaskFormDialog.show(
              context,
              appState: appState,
              initialTask: task,
              initialOpportunityId: task.opportunityId,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActivityTimelineSection extends StatelessWidget {
  final List<TimelineEntry> timeline;
  final AppState appState;
  final Function(int, {JobStage? stage, Opportunity? opportunity}) onNavigate;

  const _ActivityTimelineSection({
    required this.timeline,
    required this.appState,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('MMM d, h:mm a');

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity History',
              style: theme.textTheme.titleMedium,
            ),
            const SizedBox(height: 6),
            Text(
              'Chronological local log of stage progressions, completed actions, and applications.',
              style: theme.textTheme.bodySmall,
            ),
            const SizedBox(height: 16),

            if (timeline.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 32),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.history_toggle_off_rounded, size: 36, color: theme.hintColor.withOpacity(0.5)),
                      const SizedBox(height: 10),
                      Text(
                        'No activity logged yet. Activity appears as you update applications.',
                        style: theme.textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: timeline.length,
                separatorBuilder: (_, __) => const Divider(height: 16),
                itemBuilder: (context, index) {
                  final entry = timeline[index];
                  final opp = appState.getOpportunityById(entry.opportunityId);

                  IconData icon = Icons.circle_outlined;
                  Color iconColor = theme.hintColor;

                  if (entry.actionType == 'created') {
                    icon = Icons.add_circle_outline_rounded;
                    iconColor = AppColors.blue;
                  } else if (entry.actionType == 'stage_change') {
                    icon = Icons.swap_horiz_rounded;
                    iconColor = AppColors.accent;
                  } else if (entry.actionType == 'task_completed') {
                    icon = Icons.check_circle_rounded;
                    iconColor = AppColors.emerald;
                  } else if (entry.actionType == 'archived') {
                    icon = Icons.archive_outlined;
                    iconColor = theme.hintColor;
                  }

                  return InkWell(
                    borderRadius: BorderRadius.circular(6),
                    onTap: opp != null ? () => onNavigate(1, opportunity: opp) : null,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 2),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(top: 2),
                            child: Icon(icon, size: 16, color: iconColor),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  entry.description,
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    if (opp != null) ...[
                                      Text(
                                        opp.company,
                                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: theme.hintColor),
                                      ),
                                      const SizedBox(width: 6),
                                      Text('•', style: TextStyle(fontSize: 11, color: theme.hintColor)),
                                      const SizedBox(width: 6),
                                    ],
                                    Text(
                                      dateFormat.format(entry.timestamp),
                                      style: TextStyle(fontSize: 11, color: theme.hintColor),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}

