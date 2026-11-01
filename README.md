# Pathfolio — Job Search Command Center

> A considered, private, offline-first career workspace for students and early-career software engineers. Track multi-stage applications, keep follow-up momentum, and cite quantifiable engineering achievements during interviews — with 100% of your data staying on your device.

[![CI](https://github.com/Sayantan-Sinha-GIT/pathfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Sayantan-Sinha-GIT/pathfolio/actions/workflows/ci.yml)
[![Live Web App](https://img.shields.io/badge/Live%20Web%20App-pathfolio.pages.dev%2Fapp%2F-blue)](https://pathfolio.pages.dev/app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Live Links & Downloads

- **Live Web Application**: [https://pathfolio.pages.dev/app/](https://pathfolio.pages.dev/app/)
- **Marketing & Documentation Site**: [https://pathfolio.pages.dev/](https://pathfolio.pages.dev/)
- **Privacy Architecture Breakdown**: [https://pathfolio.pages.dev/privacy.html](https://pathfolio.pages.dev/privacy.html)
- **User Strategy Guide**: [https://pathfolio.pages.dev/guide.html](https://pathfolio.pages.dev/guide.html)
- **Android Release APK**: [Download APK from GitHub Releases](https://github.com/Sayantan-Sinha-GIT/pathfolio/releases/latest/download/app-release.apk)

---

## Why Pathfolio?

Commercial career platforms frequently monetize candidate salary expectations, private interview talking points, and application velocity. 

**Pathfolio** is engineered with a strict local-first philosophy:
- **Zero Cloud Databases & Zero Telemetry**: All opportunities, private notes, follow-up deadlines, and career evidence items are stored solely inside your local browser or Android app sandbox.
- **No Mandatory Login**: Open the app and start organizing instantly.
- **Atomic Versioned Backups**: Export and restore your complete workspace as a single version 1 JSON file anytime.
- **Tactile Editorial Craft**: Built with warm porcelain surfaces, deep ink typography, and high-contrast accessibility (WCAG AA compliant, keyboard shortcuts, reduced motion).

---

## Core Features

### 1. 6-Stage Application Pipeline
Move applications across `Saved`, `Applied`, `Screening`, `Interview`, `Offer`, and `Rejected`. Every stage transition is recorded in a chronological, dated **Activity Timeline** so you can audit how long interview cycles take.

### 2. Follow-Up Deadlines & Overdue Alerts
Attach actionable follow-up tasks (e.g. *"Complete systems coding assessment"*, *"Send post-interview thank you email"*) with optional due dates. The dashboard surfaces overdue and upcoming deadlines by local calendar day.

### 3. Career Evidence Bank
Store quantifiable engineering milestones formatted with the STAR principle (Situation, Task, Action, Result) with skill tags and source PR/demo links. Reference evidence items across multiple job applications without uploading files or duplicating notes.

### 4. Interactive Sample Demo Workspace
Explore Pathfolio immediately with pre-loaded, realistic student and early-career job applications, interview milestones, and evidence items. Demo data is clearly flagged with a warning banner and can be erased with a single click.

### 5. Cross-Platform Responsive UX
Runs seamlessly on Android and Web across desktop (1440×900), tablet (1024×768), standard mobile (390×844), and narrow mobile (320px) screens with zero layout clipping.

---

## Architecture & Tech Stack

```
pathfolio/
├── app/                  # Flutter 3.47 cross-platform app (Android + Web)
│   ├── lib/
│   │   ├── models/       # Domain entities: Opportunity, JobStage, TaskItem, EvidenceItem, BackupData
│   │   ├── services/     # StorageService, ValidationService, DemoDataFactory
│   │   ├── state/        # AppState (ChangeNotifier with atomic commits & filter engine)
│   │   ├── theme/        # AppTheme (editorial porcelain & deep ink palette, responsive breakpoints)
│   │   └── views/        # Dashboard, Pipeline Kanban, Opportunity Detail, Evidence Bank, Settings
│   └── test/             # Comprehensive unit and widget test suite (37 tests)
├── site/                 # Web-native semantic marketing site (HTML5, CSS3, vanilla JS)
├── dist/                 # Combined Cloudflare Pages production bundle (Site at /, Flutter Web at /app/)
├── QUALITY_CASES.md      # 44 executed test cases across 3 bounded rounds
├── REGRESSION_RUNS.md    # Repeated frozen CORE regression suite execution log
└── UI_REVIEW.md          # 4-round visual review & breakpoint evidence log
```

- **Framework**: Flutter 3.47.7 (Dart 3.13.5).
- **Client Persistence**: `shared_preferences` abstracted behind an atomic repository interface (`IStorageService`).
- **Web Hosting**: Cloudflare Pages Direct Upload via Wrangler CLI.
- **Android Target**: Release APK (`app-release.apk`) built with Java 17 and Android SDK 36.

---

## Verification & Quality Gates

Pathfolio adheres to the Antigravity-Kit testing protocol:
- **Automated Tests**: 39 unit and widget tests covering models, validation, timeline tracking, repository operations, single-snapshot restore persistence, and failed-write rollback.
- **Quality Gate**: Passed `CHECK_QUALITY_CASES.ps1` with 44 distinct executed test cases across 3 iterations:
  - Iteration 1 (Baseline): 15 distinct cases + frozen 11-case CORE suite.
  - Iteration 2 (Adversarial): 14 distinct cases + CORE rerun.
  - Iteration 3 (Combinations & Release): 15 distinct cases + CORE rerun.
  - Coverage floors met: >=3 cases per Must requirement, >=6 cases per High-risk requirement (M02, M07, M08).
- **Visual Review (Section 4A)**: 4 completed visual review-and-fix iterations documented in `UI_REVIEW.md` across 1440px desktop, 1024px tablet, 390px mobile, and 320px narrow mobile viewports.

---

## Local Development & Build

### Prerequisites
- Flutter SDK 3.47+
- Java 17 (for Android APK builds)
- Node.js 18+ (for local preview / deployment tools)

### Running Flutter App Locally
```bash
cd app
flutter pub get
flutter run -d chrome    # Or flutter run -d android
```

### Running Test Suite
```bash
cd app
flutter test
flutter analyze --no-fatal-infos
```

### Building Production Bundles
```bash
# Build Flutter Web bundle for /app/ base path
cd app
flutter build web --base-href "/app/" --release

# Build Android Release APK
flutter build apk --release
```

The Android release build requires `app/android/key.properties` and the matching private keystore in `app/android/app/`. They are ignored by git. A private backup was saved at `%USERPROFILE%\.codex\secrets\pathfolio`; copy both files to a separate safe place before changing computers. The public `v1.0.1` APK uses this dedicated release key. The earlier `v1.0.0` APK used Flutter's default debug key and cannot be updated in place with the new release key; uninstall it before installing `v1.0.1` if you installed that early version.

The web app registers `app/web/pathfolio-sw.js` to cache the app shell on first load. Once that installation completes, the web app can reopen offline. Local browser records are independent of the cache and remain on that browser profile.

---

## Honest Limitations

1. **Storage Scoping**: Browser storage is isolated per browser profile and domain. Data created in Chrome on one computer will not automatically sync to Edge or an Android phone without exporting and importing a JSON backup.
2. **Browser Cache Clearing**: Clearing "Cookies and Site Data" in browser settings will delete local records. Users are advised to export regular JSON backups.
3. **External Links**: Job application URLs are opened via system browser. Pathfolio does not auto-scrape private job board portals.
4. **Offline Setup**: The web app needs one complete online load to cache its app shell. The Android APK works offline after installation.

---

## License

MIT License. Copyright (c) 2026 Sayantan Sinha.
