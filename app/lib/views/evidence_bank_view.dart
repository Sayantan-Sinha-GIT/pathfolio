import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/evidence_item.dart';
import '../state/app_state.dart';
import '../theme/app_theme.dart';
import 'evidence_form_dialog.dart';

class EvidenceBankView extends StatefulWidget {
  final AppState appState;

  const EvidenceBankView({super.key, required this.appState});

  @override
  State<EvidenceBankView> createState() => _EvidenceBankViewState();
}

class _EvidenceBankViewState extends State<EvidenceBankView> {
  final TextEditingController _searchController = TextEditingController();
  String _filterTag = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _launchUrl(String? url) async {
    if (url == null || url.isEmpty) return;
    final uri = Uri.tryParse(url);
    if (uri != null && await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _confirmDelete(BuildContext context, EvidenceItem ev) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Evidence Item?'),
        content: Text(
          'Are you sure you want to delete "${ev.title}"? Any opportunities referencing this evidence item will have the reference safely detached without corrupting their history.',
        ),
        actions: [
          TextButton(
            autofocus: true,
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.crimson),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await widget.appState.deleteEvidence(ev.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    final allEvidence = widget.appState.allEvidence;
    final isMobile = AppBreakpoints.isMobile(context);
    final theme = Theme.of(context);

    // Extract all unique tags
    final Set<String> allTags = {};
    for (final ev in allEvidence) {
      allTags.addAll(ev.skillTags);
    }

    // Filter evidence by search & tag
    final q = _searchController.text.trim().toLowerCase();
    final filtered = allEvidence.where((ev) {
      final matchesQuery = q.isEmpty ||
          ev.title.toLowerCase().contains(q) ||
          ev.conciseResult.toLowerCase().contains(q) ||
          ev.skillTags.any((t) => t.toLowerCase().contains(q));
      final matchesTag = _filterTag.isEmpty || ev.skillTags.contains(_filterTag);
      return matchesQuery && matchesTag;
    }).toList();

    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 24,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Career Evidence Bank',
                      style: theme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Store quantifiable achievements and proof to cite during interviews.',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton.icon(
                icon: const Icon(Icons.add_rounded, size: 18),
                label: const Text('New Evidence'),
                onPressed: () => EvidenceFormDialog.show(context, appState: widget.appState),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Search & Tag Filter Bar
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: (theme.cardTheme.shape as RoundedRectangleBorder).side.color,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: isMobile ? double.infinity : 320,
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search accomplishments, technologies...',
                      prefixIcon: const Icon(Icons.search_rounded, size: 20),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              onPressed: () => setState(() => _searchController.clear()),
                            )
                          : null,
                    ),
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                if (allTags.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        FilterChip(
                          label: const Text('All Skills'),
                          selected: _filterTag.isEmpty,
                          onSelected: (_) => setState(() => _filterTag = ''),
                        ),
                        const SizedBox(width: 6),
                        ...allTags.map((tag) => Padding(
                              padding: const EdgeInsets.only(right: 6),
                              child: FilterChip(
                                label: Text(tag),
                                selected: _filterTag == tag,
                                onSelected: (sel) => setState(() => _filterTag = sel ? tag : ''),
                              ),
                            )),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Evidence Grid / List
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.stars_rounded, size: 48, color: theme.hintColor.withOpacity(0.4)),
                        const SizedBox(height: 16),
                        Text(
                          allEvidence.isEmpty ? 'Evidence bank is empty' : 'No matching evidence found',
                          style: theme.textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          allEvidence.isEmpty
                              ? 'Record key engineering milestones, performance metrics, and project links.'
                              : 'Try adjusting your search query or skill filter.',
                          style: theme.textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.add_rounded, size: 18),
                          label: const Text('Add First Evidence'),
                          onPressed: () => EvidenceFormDialog.show(context, appState: widget.appState),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final ev = filtered[index];
                      // Find which opportunities cite this evidence
                      final citingOpps = widget.appState.allOpportunities
                          .where((o) => o.attachedEvidenceIds.contains(ev.id))
                          .toList();

                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(18),
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
                                        Text(ev.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                                        const SizedBox(height: 6),
                                        Text(ev.conciseResult, style: const TextStyle(fontSize: 13.5, height: 1.45)),
                                      ],
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      IconButton(
                                        icon: const Icon(Icons.edit_outlined, size: 18),
                                        tooltip: 'Edit Evidence',
                                        onPressed: () => EvidenceFormDialog.show(
                                          context,
                                          appState: widget.appState,
                                          initialEvidence: ev,
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.crimson),
                                        tooltip: 'Delete Evidence',
                                        onPressed: () => _confirmDelete(context, ev),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),

                              // Tags & Citing Opportunities Row
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                crossAxisAlignment: WrapCrossAlignment.center,
                                children: [
                                  ...ev.skillTags.map((tag) => Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: theme.dividerColor.withOpacity(0.15),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(tag, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                                      )),
                                  if (ev.sourceUrl != null && ev.sourceUrl!.isNotEmpty)
                                    InkWell(
                                      onTap: () => _launchUrl(ev.sourceUrl),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: AppColors.accentLight,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: const Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.open_in_new_rounded, size: 12, color: AppColors.accent),
                                            SizedBox(width: 4),
                                            Text('Link ↗', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.accent)),
                                          ],
                                        ),
                                      ),
                                    ),
                                  if (citingOpps.isNotEmpty)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppColors.blueBg,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(
                                        'Referenced in ${citingOpps.map((o) => o.company).join(', ')}',
                                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.blue),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

