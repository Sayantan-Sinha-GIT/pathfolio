import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pathfolio/main.dart';
import 'package:pathfolio/services/storage_service.dart';
import 'package:pathfolio/state/app_state.dart';

void main() {
  testWidgets('PathfolioApp renders onboarding dialog and navigates to dashboard on start', (WidgetTester tester) async {
    // Set a standard desktop/laptop viewport
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final storage = InMemoryStorageService();
    final appState = AppState(storage: storage);
    await appState.initialize();

    await tester.pumpWidget(PathfolioApp(appState: appState));
    await tester.pumpAndSettle();

    // Verify Onboarding Dialog appears
    expect(find.text('Welcome to Pathfolio'), findsOneWidget);
    expect(find.text('Start Fresh & Empty'), findsOneWidget);

    // Tap "Start Fresh & Empty"
    await tester.tap(find.text('Start Fresh & Empty'));
    await tester.pumpAndSettle();

    // Verify Dashboard is visible
    expect(find.text('Application Command Center'), findsOneWidget);
    expect(find.text('Pipeline'), findsWidgets);
    expect(find.text('Evidence Bank'), findsWidgets);
    expect(find.text('Settings'), findsWidgets);

    // Navigate to Pipeline tab
    await tester.tap(find.text('Pipeline').first);
    await tester.pumpAndSettle();
    expect(find.text('Application Pipeline'), findsOneWidget);

    // Navigate to Evidence Bank tab
    await tester.tap(find.text('Evidence Bank').first);
    await tester.pumpAndSettle();
    expect(find.text('Career Evidence Bank'), findsOneWidget);

    // Navigate to Settings tab
    await tester.tap(find.text('Settings').first);
    await tester.pumpAndSettle();
    expect(find.text('Settings & Data Privacy'), findsOneWidget);
  });
}
