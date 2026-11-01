import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/opportunity.dart';
import '../models/stage.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';
import 'opportunity_form_dialog.dart';

class PipelineView extends StatefulWidget {
  final AppState appState;
  final Function(Opportunity) onSelectOpportunity;

  const PipelineView({
    super.key,
    required this.appState,
    required this.onSelectOpportunity,
  });

  @override
  State<PipelineView> createState() => _PipelineViewState();
}

class _PipelineViewState extends State<PipelineView> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = widget.appState.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = widget.appState;
    final isDesktop = AppBreakpoints.isDesktop(context);
    final isMobile = AppBreakpoints.isMobile(context);
    final theme = Theme.of(context);

    final filteredList = appState.filteredOpportunities;

    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 24,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header & Quick Add
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Application Pipeline',
                      style: theme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Manage opportunities through each phase of hiring.',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton.icon(
                icon: const Icon(Icons.add_rounded, size: 18),
                label: const Text('Add Opportunity'),
                onPressed: () => OpportunityFormDialog.show(
                  context,
                  appState: appState,
                  initialStage: appState.stageFilter,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Search, Filter & Sort Controls Bar
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: ((theme.cardTheme.shape as RoundedRectangleBorder?)?.side.color ?? AppColors.lightBorder),
              ),
            ),
            child: Wrap(
              spacing: 12,
              runSpacing: 12,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                // Search Field
                SizedBox(
                  width: isMobile ? double.infinity : 280,
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search company, role, notes...',
                      prefixIcon: const Icon(Icons.search_rounded, size: 20),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                appState.setSearchQuery('');
                              },
                            )
                          : null,
                    ),
                    onChanged: (val) => appState.setSearchQuery(val),
                  ),
                ),

                // Stage Dropdown Filter
                DropdownButton<JobStage?>(
                  value: appState.stageFilter,
                  hint: const Text('All Stages'),
                  underline: const SizedBox(),
                  borderRadius: BorderRadius.circular(8),
                  items: [
                    const DropdownMenuItem(
                      value: null,
                      child: Text('All Stages'),
                    ),
                    ...JobStage.values.map(
                      (s) => DropdownMenuItem(
                        value: s,
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: s.color,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(s.displayName),
                          ],
                        ),
                      ),
                    ),
                  ],
                  onChanged: (val) => appState.setStageFilter(val),
                ),

                // Sort Order
                DropdownButton<String>(
                  value: appState.sortBy,
                  underline: const SizedBox(),
                  borderRadius: BorderRadius.circular(8),
                  items: const [
                    DropdownMenuItem(value: 'recent', child: Text('Sort: Recent Updates')),
                    DropdownMenuItem(value: 'nextAction', child: Text('Sort: Next Action Date')),
                    DropdownMenuItem(value: 'company', child: Text('Sort: Company (A-Z)')),
                    DropdownMenuItem(value: 'applied', child: Text('Sort: Application Date')),
                  ],
                  onChanged: (val) {
                    if (val != null) appState.setSortBy(val);
                  },
                ),

                // Active / Archived Toggle
                FilterChip(
                  label: Text(appState.showArchived ? 'Archived Records' : 'Active Pipeline'),
                  selected: appState.showArchived,
                  onSelected: (val) => appState.setShowArchived(val),
                  avatar: Icon(
                    appState.showArchived ? Icons.archive_rounded : Icons.check_circle_outline_rounded,
                    size: 16,
                  ),
                ),

                // Reset Filters Button
                if (appState.hasActiveFilters)
                  TextButton.icon(
                    icon: const Icon(Icons.filter_alt_off_rounded, size: 16),
                    label: const Text('Clear Filters'),
                    onPressed: () {
                      _searchController.clear();
                      appState.clearFilters();
                    },
                  ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Main Pipeline Content
          Expanded(
            child: filteredList.isEmpty
                ? _buildEmptyState(context, appState)
                : (isDesktop && appState.stageFilter == null && !appState.showArchived)
                    ? _buildKanbanBoard(context, appState)
                    : _buildOpportunityList(context, filteredList, appState),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, AppState appState) {
    final theme = Theme.of(context);
    final hasFilters = appState.hasActiveFilters;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            hasFilters ? Icons.filter_list_off_rounded : Icons.folder_open_rounded,
            size: 48,
            color: theme.hintColor.withOpacity(0.4),
          ),
          const SizedBox(height: 16),
          Text(
            hasFilters ? 'No opportunities match your current filters' : 'No opportunities recorded yet',
            style: theme.textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            hasFilters
                ? 'Try clearing the search query or changing the stage filter.'
                : 'Click "Add Opportunity" above to record your first job application.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 20),
          if (hasFilters)
            OutlinedButton(
              onPressed: () {
                _searchController.clear();
                appState.clearFilters();
              },
              child: const Text('Clear All Filters'),
            )
          else
            ElevatedButton.icon(
              icon: const Icon(Icons.add_rounded, size: 18),
              label: const Text('Create First Opportunity'),
              onPressed: () => OpportunityFormDialog.show(context, appState: appState),
            ),
        ],
      ),
    );
  }

  Widget _buildKanbanBoard(BuildContext context, AppState appState) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final colWidth = 260.0;

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: JobStage.values.map((stage) {
              final stageOpps = appState.filteredOpportunities
                  .where((o) => o.stage == stage)
                  .toList();

              return Container(
                width: colWidth,
                margin: const EdgeInsets.only(right: 14),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardTheme.color?.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: ((Theme.of(context).cardTheme.shape as RoundedRectangleBorder?)?.side.color ?? AppColors.lightBorder),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Column Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: stage.containerColor,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(9)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(color: stage.color, shape: BoxShape.circle),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              stage.displayName,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: Theme.of(context).brightness == Brightness.dark
                                    ? Colors.white
                                    : const Color(0xFF1F2937),
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.8),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${stageOpps.length}',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Column Cards
                    Expanded(
                      child: ListView.separated(
                        padding: const EdgeInsets.all(10),
                        itemCount: stageOpps.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final opp = stageOpps[index];
                          return _OpportunityCard(
                            opportunity: opp,
                            appState: appState,
                            onTap: () => widget.onSelectOpportunity(opp),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }

  Widget _buildOpportunityList(
    BuildContext context,
    List<Opportunity> list,
    AppState appState,
  ) {
    return ListView.separated(
      padding: const EdgeInsets.only(bottom: 24),
      itemCount: list.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final opp = list[index];
        return _OpportunityCard(
          opportunity: opp,
          appState: appState,
          isWide: true,
          onTap: () => widget.onSelectOpportunity(opp),
        );
      },
    );
  }
}

class _OpportunityCard extends StatelessWidget {
  final Opportunity opportunity;
  final AppState appState;
  final VoidCallback onTap;
  final bool isWide;

  const _OpportunityCard({
    required this.opportunity,
    required this.appState,
    required this.onTap,
    this.isWide = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tasks = appState.tasksForOpportunity(opportunity.id);
    final pendingTasks = tasks.where((t) => !t.isCompleted).length;
    final dateFormat = DateFormat('MMM d');

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Row: Company, Role & Stage Action Menu
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          opportunity.company,
                          style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          opportunity.role,
                          style: TextStyle(fontSize: 13, color: theme.hintColor),
                        ),
                      ],
                    ),
                  ),

                  // Stage Popup Menu
                  PopupMenuButton<JobStage>(
                    tooltip: 'Change stage',
                    initialValue: opportunity.stage,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: opportunity.stage.color.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(color: opportunity.stage.color, shape: BoxShape.circle),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            opportunity.stage.displayName,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: opportunity.stage.color,
                            ),
                          ),
                          const Icon(Icons.arrow_drop_down, size: 16),
                        ],
                      ),
                    ),
                    onSelected: (newStage) {
                      appState.changeOpportunityStage(opportunity.id, newStage);
                    },
                    itemBuilder: (context) => JobStage.values.map((s) {
                      return PopupMenuItem(
                        value: s,
                        child: Row(
                          children: [
                            Container(width: 8, height: 8, decoration: BoxDecoration(color: s.color, shape: BoxShape.circle)),
                            const SizedBox(width: 8),
                            Text(s.displayName),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Badges: Location, Compensation, Evidence
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  if (opportunity.location.isNotEmpty)
                    _InfoBadge(
                      icon: Icons.location_on_outlined,
                      label: opportunity.location,
                    ),
                  if (opportunity.salaryNote.isNotEmpty)
                    _InfoBadge(
                      icon: Icons.payments_outlined,
                      label: opportunity.salaryNote,
                    ),
                  if (opportunity.attachedEvidenceIds.isNotEmpty)
                    _InfoBadge(
                      icon: Icons.stars_rounded,
                      label: '${opportunity.attachedEvidenceIds.length} evidence',
                      color: AppColors.accent,
                    ),
                  if (pendingTasks > 0)
                    _InfoBadge(
                      icon: Icons.check_circle_outline_rounded,
                      label: '$pendingTasks pending tasks',
                    ),
                  if (opportunity.nextActionDate != null)
                    _InfoBadge(
                      icon: Icons.alarm_outlined,
                      label: 'Due ${dateFormat.format(opportunity.nextActionDate!)}',
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

class _InfoBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;

  const _InfoBadge({
    required this.icon,
    required this.label,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final badgeColor = color ?? theme.hintColor;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: theme.dividerColor.withOpacity(0.12),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: badgeColor),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: badgeColor),
          ),
        ],
      ),
    );
  }
}

