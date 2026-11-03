# Pathfolio — Project Progress & Feature Ledger

## Selected Stack & Architecture
- **App Platform**: Flutter 3.47.7 (Android release APK + Web at `/app/`).
- **Marketing Site**: Web-native semantic HTML5, CSS3, vanilla JS (Kinetic Career Dossier & Milestone Rail, self-hosted Fraunces/Jakarta/Mono typography, 6-stage milestone runway, STAR matrix, privacy vault, live schema v1 JSON export, dark/light aware, WCAG AA).
- **Storage**: Local-only client persistence (`shared_preferences` + structured repository abstraction with atomic commits and schema validation). Zero cloud database, zero telemetry, full offline capability.
- **Hosting & Deployment**: Cloudflare Pages Direct Upload via authenticated Wrangler (`srimantasutapa123@gmail.com`). Marketing site at root `/`, Flutter web app at `/app/` with SPA routing redirect fallback.
- **VCS & Release**: GitHub repository under `Sayantan-Sinha-GIT`, GitHub Actions CI workflow, signed/release Android APK, GitHub Release with attached APK.

## Visual Overhaul: Kinetic Career Dossier & Milestone Rail
- **CodeSense Motifs Removed**:
  - Removed black cosmic void (`#0B0D12` / `#0B0E14`)
  - Removed neon orange/amber cosmic filaments (`--accent-glow: rgba(224, 109, 68, 0.35)`) and aurora clouds
  - Removed floating star particles and distance spider-webs
  - Removed terminal window with red/amber/green window dots and monospaced command logs
  - Removed developer observability / telemetric jargon
- **New Pathfolio Visual World**:
  - Warm Architectural Porcelain (`#F8F7F4` light default, `#111317` obsidian night studio dark)
  - Signature Alpine Verdigris (`#134E43` light, `#2DD4BF` dark) & Architectural Brass (`#B87333`)
  - Self-hosted typography: `Fraunces` (600, 700), `Plus Jakarta Sans` (400, 500, 600, 700), `JetBrains Mono` (400, 500)
  - Centerpiece: Interactive Kinetic Milestone Dossier Card with 6 tactile stages and realistic candidate profile cycling
  - Unified design system across `/`, `/guide.html`, `/privacy.html`, and `/app/`

## Project Phases
1. **Foundation & Setup**: Workspace layout (`app/`, `site/`, `dist/`), Flutter app bootstrap, marketing site scaffold, git setup. [COMPLETE]
2. **Core App Implementation**: Models, repository layer, atomic persistence, schema v1 validation, pipeline state machine, task engine, evidence bank, demo workspace manager, export/import engine, settings/erase. [COMPLETE]
3. **Responsive Editorial UI**: Design system (porcelain surfaces, deep ink, Alpine Verdigris accent, typography, tactile interactions), dashboard, pipeline board/list, opportunity detail & timeline, task drawer/modal, evidence selector, onboarding & help, keyboard shortcuts, reduced-motion. [COMPLETE]
4. **Visual Overhaul & Kinetic Dossier Craft**: Rebuilt marketing site, guide, privacy, and Flutter theme tokens to a unified Kinetic Career Dossier system. [COMPLETE]
5. **Section 4A — Visual & Motion Review Loops**:
   - App Visual Loop (4 Iterations): Composition, Interaction, Craft, Release & Breakpoints. [COMPLETE]
   - Website Cinematic Motion Loop (6 Rounds): Visual World Audit (CodeSense motifs removed), Self-Hosted Typography, Hero Milestone Scrubber, Scroll Narrative Chapters, Mobile Viewport Ergonomics, Cross-Route Matrix & Parity. [COMPLETE]
6. **Section 5 — Bounded Test Loop (3 Iterations + Regression)**:
   - Automated unit/widget test suite (39 automated tests passing). [COMPLETE]
   - Iteration 1: 15 distinct cases + frozen CORE suite (11 cases). [COMPLETE]
   - Iteration 2: 14 distinct cases + CORE rerun. [COMPLETE]
   - Iteration 3: 15 distinct cases + CORE rerun. [COMPLETE]
   - `CHECK_QUALITY_CASES.ps1` quality gate: READY (44 distinct cases). [COMPLETE]
7. **Production Builds & Cloudflare Pages Deployment**:
   - Flutter web build with `--base-href /app/`. [COMPLETE]
   - Android release APK build (`flutter build apk --release` -> 51.0 MB). [COMPLETE]
   - Direct upload to Cloudflare Pages via Wrangler (`https://pathfolio.pages.dev/`). [COMPLETE]
   - Live browser verification at public Pages URL (`innerWidth: 390px, scrollWidth: 390px`, zero overflow, all drawer links working). [COMPLETE]
8. **GitHub Publication & Release**:
   - GitHub Actions CI workflow passing. [COMPLETE]
   - Secret scan clean. [COMPLETE]
   - GitHub Release `v1.0.1` updated with new release APK artifact. [COMPLETE]
9. **QA Hardening & Mobile Containment**:
   - 390px mobile viewport: eliminated 468px overflow, moved drawer outside sticky header containing block to body root with 780px height, verified all 9 links visible and clickable. [COMPLETE]
   - Storage truth alignment: confirmed `shared_preferences` storage, removed all unverified claims of Keystore, IndexedDB guarantees, or hardware encryption. [COMPLETE]
   - Stage lifecycle alignment: aligned interactive demo and copy to `JobStage.rejected`. [COMPLETE]
   - Typography parity: bundled SIL Open Font License Plus Jakarta Sans and Fraunces in Flutter app, replaced Segoe UI. [COMPLETE]

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
