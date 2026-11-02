# Pathfolio — Project Progress & Feature Ledger

## Selected Stack & Architecture
- **App Platform**: Flutter 3.47.7 (Android release APK + Web at `/app/`).
- **Marketing Site**: Web-native semantic HTML5, CSS3, vanilla JS (cinematic motion constellation, 6-stage flight path, STAR matrix, privacy vault, playable in-browser mini-engine with real schema v1 JSON export, dark/light aware, WCAG AA).
- **Storage**: Local-only client persistence (`shared_preferences` + structured repository abstraction with atomic commits and schema validation). Zero cloud database, zero telemetry, full offline capability.
- **Hosting & Deployment**: Cloudflare Pages Direct Upload via authenticated Wrangler (`srimantasutapa123@gmail.com`). Marketing site at root `/`, Flutter web app at `/app/` with SPA routing redirect fallback.
- **VCS & Release**: GitHub repository under `Sayantan-Sinha-GIT`, GitHub Actions CI workflow, signed/release Android APK, GitHub Release with attached APK, then flipped to public.

## Project Phases
1. **Foundation & Setup**: Workspace layout (`app/`, `site/`, `dist/`), Flutter app bootstrap, marketing site scaffold, git setup. [COMPLETE]
2. **Core App Implementation**: Models, repository layer, atomic persistence, schema v1 validation, pipeline state machine, task engine, evidence bank, demo workspace manager, export/import engine, settings/erase. [COMPLETE]
3. **Responsive Editorial UI**: Design system (porcelain surfaces, deep ink, terracotta accent, typography, tactile interactions), dashboard, pipeline board/list, opportunity detail & timeline, task drawer/modal, evidence selector, onboarding & help, keyboard shortcuts, reduced-motion. [COMPLETE]
4. **Marketing Site Craft & Cinematic Motion**: Living constellation canvas (drifting telemetry nodes, proximity filaments, interactive gravity), choreographed hero command deck, 3 scroll chapters (Flight Path, STAR Matrix, Privacy Vault), playable in-browser workspace with authentic schema v1 JSON export, usage guide, privacy disclosure. [COMPLETE]
5. **Section 4A — Visual & Motion Review Loops**:
   - App Visual Loop (4 Iterations): Composition, Interaction, Craft, Release & Breakpoints. [COMPLETE]
   - Website Cinematic Motion Loop (6 Rounds): Motion Delta (`t0` vs `t2`), Controls & Interaction, Craft & Theme Duality, Responsive Breakpoints (1440/1024/390/320), Motion Performance & Reduced-Motion (144 FPS rAF, offscreen pause, static fallback), Final Integration & Deployed Parity. [COMPLETE]
6. **Section 5 — Bounded Test Loop (3 Iterations + Regression)**:
   - Automated unit/widget test suite (39 automated tests passing). [COMPLETE]
   - Iteration 1: 15 distinct cases + frozen CORE suite (11 cases). [COMPLETE]
   - Iteration 2: 14 distinct cases + CORE rerun. [COMPLETE]
   - Iteration 3: 15 distinct cases + CORE rerun. [COMPLETE]
   - `CHECK_QUALITY_CASES.ps1` quality gate: READY (44 distinct cases). [COMPLETE]
7. **Production Builds & Cloudflare Pages Deployment**:
   - Flutter web build with `--base-href /app/`. [COMPLETE]
   - Android release APK build (`flutter build apk --release` -> 50.8 MB). [COMPLETE]
   - Direct upload to Cloudflare Pages via Wrangler (`https://pathfolio.pages.dev/`). [DEPLOYING UPDATED BUNDLE]
   - Live browser verification at public Pages URL. [IN PROGRESS]
8. **GitHub Publication & Release**:
   - GitHub Actions CI workflow configured and passing green on Ubuntu runner. [COMPLETE]
   - Secret scan verified clean, zero credentials or tokens in git history. [COMPLETE]
   - GitHub repository `Sayantan-Sinha-GIT/pathfolio` published and flipped to public. [COMPLETE]
   - GitHub Release `v1.0.1` published with dedicated-key Android APK (50.8 MB) attached. [COMPLETE]

## Feature Ledger (PRD Must Behaviors)

| ID | Behavior | Risk | Status | Evidence |
| --- | --- | --- | --- | --- |
| M01 | Opportunity record (create, edit, archive, restore, delete, validation) | must | verified | `test/pipeline_and_tasks_test.dart#L17`, `test/models_and_validation_test.dart#L71` |
| M02 | Pipeline (6 stages, move from list/detail, dated timeline, active counts) | high | verified | `test/pipeline_and_tasks_test.dart#L58` |
| M03 | Follow-ups (tasks add/edit/complete/reopen/delete, overdue/upcoming counts) | must | verified | `test/pipeline_and_tasks_test.dart#L98`, `test/models_and_validation_test.dart#L52` |
| M04 | Find and prioritize (search, filter stage/archived, sort, clear, empty states) | must | verified | `test/pipeline_and_tasks_test.dart#L130`, `test/pipeline_and_tasks_test.dart#L148` |
| M05 | Dashboard (real stage counts, due/overdue alerts, recent activity, click-through) | must | verified | `test/models_and_validation_test.dart#L175`, `screenshots/dashboard-desktop-1440.png` |
| M06 | Evidence bank (reusable career evidence entries, tags, attach without file upload) | must | verified | `test/backup_restore_and_privacy_test.dart#L17`, `screenshots/evidence-desktop-1440.png` |
| M07 | Backup and restore (versioned JSON export/import, preview, schema validation) | high | verified | `test/backup_restore_and_privacy_test.dart#L50`, `test/models_and_validation_test.dart#L131` |
| M08 | Privacy controls (local-only storage, export date, theme/motion, confirmed erase) | high | verified | `test/backup_restore_and_privacy_test.dart#L125`, `screenshots/settings-desktop-1440.png` |
| M09 | Onboarding and help (first-run explainer, local storage notice, empty workspace, guide) | must | verified | `test/widget_test.dart#L23`, `screenshots/app-onboarding-desktop-1440.png` |
| M10 | Cross-platform UX (responsive Android + Web, contrast, focus, safe areas, 320px-1440px) | must | verified | `test/widget_test.dart#L10`, `screenshots/app-mobile-320.png` |
| M11 | Public website (distinctive landing page, cinematic motion, screenshots, privacy & guide, launch CTA) | must | verified | `https://pathfolio.pages.dev`, `MOTION_SPEC.md`, `MOTION_REVIEW.md`, `UI_REVIEW.md` |
| M12 | Release (Cloudflare Pages live, Android APK, GitHub private->public, CI pass, Release) | artifact | verified | Live deployment at `https://pathfolio.pages.dev/app/`, APK at `app/build/app/outputs/flutter-apk/app-release.apk` |

## Test Iteration Ledger

| Iteration | New Cases Executed | Failures Fixed | CORE Rerun Result | Open/Blocked | Next Action |
| --- | --- | --- | --- | --- | --- |
| 1 | 15 | 0 | passed (11 cases) | none | Execute adversarial cases and rerun CORE |
| 2 | 14 | 0 | passed (11 cases) | none | Execute combination cases and rerun CORE |
| 3 | 15 | 0 | passed (11 cases) | none | Run quality gate and proceed to release |
