import 'package:flutter/material.dart';
import 'models/opportunity.dart';
import 'models/stage.dart';
import 'services/storage_service.dart';
import 'state/app_state.dart';
import 'theme/app_theme.dart';
import 'views/dashboard_view.dart';
import 'views/pipeline_view.dart';
import 'views/opportunity_detail_view.dart';
import 'views/evidence_bank_view.dart';
import 'views/settings_view.dart';
import 'views/onboarding_dialog.dart';
import 'views/guide_dialog.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final storage = SharedPrefsStorageService();
  final appState = AppState(storage: storage);
  await appState.initialize();

  runApp(PathfolioApp(appState: appState));
}

class PathfolioApp extends StatefulWidget {
  final AppState appState;

  const PathfolioApp({super.key, required this.appState});

  @override
  State<PathfolioApp> createState() => _PathfolioAppState();
}

class _PathfolioAppState extends State<PathfolioApp> {
  @override
  void initState() {
    super.initState();
    widget.appState.addListener(_onStateChange);
  }

  @override
  void dispose() {
    widget.appState.removeListener(_onStateChange);
    super.dispose();
  }

  void _onStateChange() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pathfolio — Job Search Command Center',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: widget.appState.themeMode,
      home: AppScaffold(appState: widget.appState),
    );
  }
}

class AppScaffold extends StatefulWidget {
  final AppState appState;

  const AppScaffold({super.key, required this.appState});

  @override
  State<AppScaffold> createState() => _AppScaffoldState();
}

class _AppScaffoldState extends State<AppScaffold> {
  int _currentTabIndex = 0;
  String? _selectedOpportunityId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      OnboardingDialog.showIfNeeded(context, widget.appState);
    });
  }

  void _handleNavigate(int index, {JobStage? stage, Opportunity? opportunity}) {
    setState(() {
      _currentTabIndex = index;
      _selectedOpportunityId = opportunity?.id;
      if (stage != null) {
        widget.appState.setStageFilter(stage);
      }
    });
  }

  void _selectOpportunity(Opportunity opp) {
    setState(() {
      _selectedOpportunityId = opp.id;
    });
  }

  void _clearSelectedOpportunity() {
    setState(() {
      _selectedOpportunityId = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = AppBreakpoints.isDesktop(context);
    final isTablet = AppBreakpoints.isTablet(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Widget bodyContent;
    if (_selectedOpportunityId != null) {
      bodyContent = OpportunityDetailView(
        opportunityId: _selectedOpportunityId!,
        appState: widget.appState,
        onBack: _clearSelectedOpportunity,
      );
    } else {
      switch (_currentTabIndex) {
        case 0:
          bodyContent = DashboardView(
            appState: widget.appState,
            onNavigate: _handleNavigate,
          );
          break;
        case 1:
          bodyContent = PipelineView(
            appState: widget.appState,
            onSelectOpportunity: _selectOpportunity,
          );
          break;
        case 2:
          bodyContent = EvidenceBankView(
            appState: widget.appState,
          );
          break;
        case 3:
          bodyContent = SettingsView(
            appState: widget.appState,
          );
          break;
        default:
          bodyContent = DashboardView(
            appState: widget.appState,
            onNavigate: _handleNavigate,
          );
      }
    }

    if (isDesktop || isTablet) {
      // Desktop / Tablet Side Navigation Rail
      return Scaffold(
        body: Row(
          children: [
            // Side Nav
            Container(
              width: isDesktop ? 240 : 72,
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                border: Border(
                  right: BorderSide(
                    color: ((theme.cardTheme.shape as RoundedRectangleBorder?)?.side.color ?? AppColors.lightBorder),
                  ),
                ),
              ),
              child: Column(
                children: [
                  // Brand Header
                  Padding(
                    padding: EdgeInsets.symmetric(
                      horizontal: isDesktop ? 16 : 8,
                      vertical: 20,
                    ),
                    child: Row(
                      mainAxisAlignment: isDesktop ? MainAxisAlignment.start : MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(7),
                          decoration: BoxDecoration(
                            color: AppColors.accent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.compass_calibration_rounded,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        if (isDesktop) ...[
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Pathfolio',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                                Text(
                                  'Command Center',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  const SizedBox(height: 12),

                  // Navigation Items
                  _NavButton(
                    icon: Icons.dashboard_outlined,
                    activeIcon: Icons.dashboard_rounded,
                    label: 'Dashboard',
                    isSelected: _currentTabIndex == 0 && _selectedOpportunityId == null,
                    isDesktop: isDesktop,
                    onTap: () => _handleNavigate(0),
                  ),
                  _NavButton(
                    icon: Icons.view_kanban_outlined,
                    activeIcon: Icons.view_kanban_rounded,
                    label: 'Pipeline',
                    isSelected: _currentTabIndex == 1 || _selectedOpportunityId != null,
                    isDesktop: isDesktop,
                    badgeCount: widget.appState.activeOpportunities.length,
                    onTap: () => _handleNavigate(1),
                  ),
                  _NavButton(
                    icon: Icons.stars_outlined,
                    activeIcon: Icons.stars_rounded,
                    label: 'Evidence Bank',
                    isSelected: _currentTabIndex == 2,
                    isDesktop: isDesktop,
                    badgeCount: widget.appState.allEvidence.length,
                    onTap: () => _handleNavigate(2),
                  ),
                  _NavButton(
                    icon: Icons.settings_outlined,
                    activeIcon: Icons.settings_rounded,
                    label: 'Settings',
                    isSelected: _currentTabIndex == 3,
                    isDesktop: isDesktop,
                    onTap: () => _handleNavigate(3),
                  ),

                  const Spacer(),
                  const Divider(height: 1),

                  // Footer actions (Guide / Theme Toggle)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                    child: Column(
                      children: [
                        Material(
                          color: Colors.transparent,
                          child: ListTile(
                            dense: true,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            leading: const Icon(Icons.help_outline_rounded, size: 20),
                            title: isDesktop ? const Text('Guide & FAQs') : null,
                            onTap: () => GuideDialog.show(context),
                          ),
                        ),
                        Material(
                          color: Colors.transparent,
                          child: ListTile(
                            dense: true,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            leading: Icon(
                              isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                              size: 20,
                            ),
                            title: isDesktop ? Text(isDark ? 'Light Mode' : 'Dark Mode') : null,
                            onTap: () {
                              widget.appState.setThemeMode(
                                isDark ? ThemeMode.light : ThemeMode.dark,
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Content Body
            Expanded(child: bodyContent),
          ],
        ),
      );
    } else {
      // Mobile Layout with Top App Bar and Bottom Navigation Bar
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Icon(Icons.compass_calibration_rounded, color: Colors.white, size: 16),
              ),
              const SizedBox(width: 10),
              const Text('Pathfolio', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.help_outline_rounded),
              tooltip: 'User Guide',
              onPressed: () => GuideDialog.show(context),
            ),
          ],
        ),
        body: bodyContent,
        bottomNavigationBar: NavigationBar(
          selectedIndex: _selectedOpportunityId != null ? 1 : _currentTabIndex,
          onDestinationSelected: (idx) => _handleNavigate(idx),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard_rounded),
              label: 'Dashboard',
            ),
            NavigationDestination(
              icon: Icon(Icons.view_kanban_outlined),
              selectedIcon: Icon(Icons.view_kanban_rounded),
              label: 'Pipeline',
            ),
            NavigationDestination(
              icon: Icon(Icons.stars_outlined),
              selectedIcon: Icon(Icons.stars_rounded),
              label: 'Evidence',
            ),
            NavigationDestination(
              icon: Icon(Icons.settings_outlined),
              selectedIcon: Icon(Icons.settings_rounded),
              label: 'Settings',
            ),
          ],
        ),
      );
    }
  }
}

class _NavButton extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isSelected;
  final bool isDesktop;
  final int? badgeCount;
  final VoidCallback onTap;

  const _NavButton({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isSelected,
    required this.isDesktop,
    this.badgeCount,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = isSelected ? AppColors.accent : theme.textTheme.bodyMedium?.color;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: EdgeInsets.symmetric(
            horizontal: isDesktop ? 14 : 10,
            vertical: 10,
          ),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.accent.withOpacity(0.1) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisAlignment: isDesktop ? MainAxisAlignment.start : MainAxisAlignment.center,
            children: [
              Icon(isSelected ? activeIcon : icon, size: 20, color: color),
              if (isDesktop) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: color,
                    ),
                  ),
                ),
                if (badgeCount != null && badgeCount! > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.accent : theme.dividerColor,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '$badgeCount',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : theme.textTheme.bodySmall?.color,
                      ),
                    ),
                  ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
