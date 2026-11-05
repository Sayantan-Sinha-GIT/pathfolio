# Pathfolio — Project Progress & Feature Ledger

## Selected Stack & Architecture
- **App Platform**: Flutter 3.47.7 (Android release APK + Web at `/app/`).
- **Marketing Site**: Web-native semantic HTML5, CSS3, vanilla JS (Kinetic Career Dossier & Milestone Rail, self-hosted Fraunces/Jakarta/Mono typography, asymmetric 12-column hero grid with 3D perspective layered dossier object, 3 physical scroll-driven narrative chapters, live schema v1 JSON export, dark/light aware, tested for accessible contrast).
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
  - Warm Architectural Porcelain (`#F8F7F4` light default, `#0A1210` deep-forest slate dark)
  - Signature Alpine Verdigris (`#0F4D3F` light, `#2DD4BF` dark) & Architectural Brass (`#B87333`)
  - Self-hosted typography: `Fraunces` (600, 700), `Plus Jakarta Sans` (400, 500, 600, 700), `JetBrains Mono` (400, 500)
  - Dramatic editorial headline in `Fraunces` with italic display contrast (*"Track every loop. Own the evidence."*)
  - Living product-specific background: 5 dual-track architectural guide rails with active brass milestone velocity packets and luminous tracer tails, paired with breathing radial ambient illumination (`.architect-ambient-glow`)
  - Asymmetric 12-column hero composition (`1.15fr 0.85fr`) pairing an executive command briefing with a 3D Layered Career Dossier object with architectural folder tab (`DOSSIER // 2026-ENG-SYSTEMS`), underlay sheets, and scroll-tilt parallax
  - Staged entrance choreography: rendered milestone rail fill expands $247.8\text{px} \rightarrow 256.7\text{px}$, 3D card perspective settles, with 36.0% decoded pixel visual difference (467,059 differing pixels across the 1440x900 viewport)
  - Clarified user benefits & labeled illustrative sample data: replaced residual technical jargon with clear user benefits ("PRIVATE CAREER WORKSPACE • STORED SAFELY ON YOUR DEVICE", "Local Device Storage • JSON Backup", "Storage: Private On-Device"), and explicitly labeled the hero card illustrative ("SAMPLE DOSSIER // ILLUSTRATIVE PREVIEW", "PRIVATE LOCAL STORAGE • ILLUSTRATIVE DEMO", "Sample Dossier", "💡 Illustrative Example")
  - Three physical scroll-driven narrative chapters with automated Playwright browser gate verification:
    - Chapter 1: The Milestone Pipeline Runway (`#chapter-pipeline` / `#milestones`), carriage advances $x = 258\text{px} \rightarrow 858\text{px}$, progress bar scales $\text{scaleX } 0.243 \rightarrow 0.808$
    - Chapter 2: The STAR Evidence Assembly Deck (`#chapter-evidence` / `#star-matrix`), fragments converge from detached float into aligned proof sheet, brass verification seal stamps down ($\text{scale } 0.388 \rightarrow 0.949$, $\text{opacity } 0.00 \rightarrow 0.89$)
    - Chapter 3: Sovereign Dossier Folding & Sealing (`#chapter-vault` / `#privacy-vault`), dimensional envelope flap 3D folds shut ($\text{rotateX } -74^\circ \rightarrow -23^\circ$, opacity $0.71 \rightarrow 0.91$), hot brass wax seal presses down ($\text{translateY } -44\text{px} \rightarrow -14\text{px}$, $\text{scale } 0.61 \rightarrow 0.88$), schema code drawer slides open ($\text{translateY } 44\text{px} \rightarrow 14\text{px}$)
  - Unified design system across `/`, `/guide.html`, `/privacy.html`, and `/app/`

## Project Phases
1. **Foundation & Setup**: Workspace layout (`app/`, `site/`, `dist/`), Flutter app bootstrap, marketing site scaffold, git setup. [COMPLETE]
2. **Core App Implementation**: Models, repository layer, atomic persistence, schema v1 validation, pipeline state machine, task engine, evidence bank, demo workspace manager, export/import engine, settings/erase. [COMPLETE]
3. **Responsive Editorial UI**: Design system (porcelain surfaces, deep ink, Alpine Verdigris accent, typography, tactile interactions), dashboard, pipeline board/list, opportunity detail & timeline, task drawer/modal, evidence selector, onboarding & help, keyboard shortcuts, reduced-motion. [COMPLETE]
4. **Visual Overhaul & Kinetic Dossier Craft**: Rebuilt marketing site, guide, privacy, and Flutter theme tokens to a unified Kinetic Career Dossier system. [COMPLETE]
5. **Section 4A — Visual & Motion Review Loops**:
   - App Visual Loop (4 Iterations): Composition, Interaction, Craft, Release & Breakpoints. [COMPLETE]
   - Website Cinematic Motion Loop (6 Rounds): Visual World Audit (CodeSense motifs removed), Self-Hosted Typography, Chapter 1 Pipeline Runway, Chapter 2 STAR Assembly Deck, Chapter 3 Sovereign Vault Folding & Sealing, Responsive Breakpoints & Ergonomics. [COMPLETE]
6. **Automated Playwright Scroll Gate (Clean-Clone Ready)**:
   - Created root `package.json` declaring `playwright-core` and tracked `package-lock.json` for deterministic `npm ci` installs; implemented cross-platform browser discovery in `test-scroll-gate.js` without machine-specific hardcoded paths.
   - Enforced strict failures on 1024px/320px horizontal overflow, linked-route loading defects (HTTP 200 and title matching), and absence of computed chapter motion deltas.
   - Tested local (`http://127.0.0.1:8085`) and remote production (`https://pathfolio.pages.dev`).
   - Verified non-zero computed deltas for all 3 chapters on Desktop (1440x900) AND Phone (390x844) with screenshot pairs (C1: carriage transit $45\text{px} \rightarrow 164\text{px}$; C2: fragment opacity $0.56 \rightarrow 0.86$, seal $0 \rightarrow 0.59$; C3: flap fold, seal $0 \rightarrow 0.58$).
   - Asserted reduced-motion visibility & readability across all 12 key selectors on both desktop and mobile (0 hidden fragments, opacity 1, display/visibility valid).
   - Asserted mounted Flutter web view, glass pane, and active canvas (>211 KB rendered UI data) on `/app/` with 0 unhandled page errors and 0 failed bundle network requests.
   - Verified 1440/1024/768/390/320 viewports with zero horizontal overflow, sticky heading clearance, theme toggle, and linked pages. [COMPLETE]
7. **Section 5 — Bounded Test Loop (3 Iterations + Regression)**:
   - Automated unit/widget test suite (39 automated tests passing). [COMPLETE]
   - Iteration 1: 15 distinct cases + frozen CORE suite (11 cases). [COMPLETE]
   - Iteration 2: 14 distinct cases + CORE rerun. [COMPLETE]
   - Iteration 3: 15 distinct cases + CORE rerun. [COMPLETE]
   - `CHECK_QUALITY_CASES.ps1` quality gate: READY (44 distinct cases). [COMPLETE]
8. **Production Builds & Cloudflare Pages Deployment**:
   - Flutter web build with `--base-href /app/`. [COMPLETE]
   - Android release APK build (`flutter build apk --release` -> 51.0 MB). [COMPLETE]
   - Direct upload to Cloudflare Pages via Wrangler (`https://pathfolio.pages.dev/`). [COMPLETE]
   - Live browser verification at public Pages URL (`innerWidth: 390px, scrollWidth: 390px`, zero overflow, all drawer links working). [COMPLETE]
9. **GitHub Publication & Release**:
   - GitHub Actions CI workflow passing. [COMPLETE]
   - Secret scan clean. [COMPLETE]
   - GitHub Release `v1.0.1` updated with new release APK artifact. [COMPLETE]
10. **QA Hardening & Mobile Containment**:
    - 390px and 320px mobile viewports: eliminated overflow, moved drawer outside sticky header containing block to body root with 780px height, verified all 9 links visible and clickable. [COMPLETE]
    - Storage truth alignment: confirmed `shared_preferences` storage, removed all unverified claims of Keystore, IndexedDB guarantees, or hardware encryption. [COMPLETE]
    - Stage lifecycle alignment: aligned interactive demo and copy to `JobStage.rejected`. [COMPLETE]
    - Typography parity: bundled SIL Open Font License Plus Jakarta Sans and Fraunces in Flutter app, replaced Segoe UI. [COMPLETE]
11. **Comprehensive Foreground Motion Upgrade (Motion-Studio Elevation)**:
    - Executed full foreground motion upgrade to motion-studio / advertisement craft level across all visible content groups (referencing CodeSense, Grepless, and Haan).
    - Implemented staggered masked line typography reveals for the editorial headline (`.hero-line-inner.line-1`, `.line-2`), coordinated entrance for status badge, lead briefing, action buttons, proof ledger, and 3D perspective dossier settling.
    - Implemented scroll-led 3D layered dossier spread fanning underlay sheets (`#hero-underlay-1`, `#hero-underlay-2`) and folder tab (`#hero-dossier-tab`) with verified `matrix3d` depth.
    - Implemented independent blur-to-sharp unmasking for all section headers and eyebrows across all chapters (`.motion-header-group`, `.motion-title-inner`, `.motion-lead`).
    - Implemented runway cards stagger with active station highlighting (`.pipeline-runway-card.active`), tactile citation simulation button feedback (`#btn-cite-simulation` -> `#citation-feedback`), 3D envelope fold, wax seal press, and comparison grid stagger (`.motion-compare-box`).
    - Implemented Chapter 4 App Tour Gallery 3D perspective and parallax card reveal, Closing CTA ambient card elevation (`#closing-cta`), and staggered footer navigation columns (`.motion-footer-col`).
    - Embedded built-in lightweight HTTP static server in `test-scroll-gate.js` with full MIME support and SPA routing fallback for deterministic, clean-clone execution without external tools.
    - Verified automated Playwright gate on local (`http://127.0.0.1:8085`) and remote production (`https://pathfolio.pages.dev/`): 100% PASSED across Desktop (1440), Mobile (390), Narrow (320), Tablet (1024), Reduced Motion, No-JS mode (21+ selectors verified >= 0.95 opacity), Reverse Scroll (bottom -> top), Midpage Direct Reload, Anchor Jump Clearances, and Flutter App Canvas (211,546 bytes rendered data). [COMPLETE]
12. **Physical Scene Redesign (STAR Evidence Matrix, Sovereign Backup Vault, and Closing CTA)**:
    - Redesigned Section 02 (`#star-matrix`): Bounded desktop pinned evidence story (`220vh` sticky track on >= 992px, natural flow on phones) with separate STAR paper fragments traveling visibly across a spacious stage into an aligned interview dossier plate, dynamic SVG drawn connector links with animated dash offset, active scroll-stage citation previews (`#citation-stage-pill`), skill domain tabs, and tactile citation button feedback.
    - Redesigned Section 03 (`#privacy-vault`): Dimensional local-backup folder sequence where 3 collectible archival documents (Pipeline, Evidence, Notes) collect into a pocket base, 3D envelope flap folds shut, hot red-brass wax seal stamps down, coordinated status steppers update, and a collapsible `<details class="schema-inspector-details">` raw Schema v1 JSON export inspector replaces static JSON walls with genuine client-side `shared_preferences` export sample without fake encryption or cloud verification claims.
    - Redesigned Section 05 (`#closing-cta`): Monumental closing scene with scroll-lit typography (`.lit-word` spans illuminating word-by-word with Alpine verdigris / ink contrast), physical 3D dossier carrier leaves (`#closing-leaf-left`, `#closing-leaf-right` unfolding 12deg -> 0deg), and architectural launchpad CTA composition transition matching reference craft level (CodeSense/Grepless/Haan).
    - Preserved accepted hero, background, other sections, and 3D occlusion fix (front cards strictly in front of backing planes across all offsets and light/dark themes).
    - Verified phone fluid flow: zero sticky traps, zero text obstruction, seal never intersects text blocks (>35px clearance at 390px, >23px at 320px).
    - 100% automated Playwright gate pass locally and on live production Cloudflare Pages (`https://pathfolio.pages.dev/`). [COMPLETE]
13. **Faithful Owner-Supplied Design Implementation (`my-design/home.html`)**:
    - Kept `my-design/home.html` byte-for-byte untouched (43,390 bytes) and git-ignored.
    - Preserved original kit prompt D in `originals/CLAUDE_HOME_PROMPT.txt` and `START_HERE.txt`.
    - Vendored GSAP 3.12.5, ScrollTrigger, and Lenis dependencies in `site/vendor/` and `dist/vendor/` with local fallbacks.
    - Authored production stylesheet `site/styles.css` with authored design styles, font definitions, sticky anchor scroll clearance (`scroll-margin-top: 5rem`), overflow containment (`overflow-x: clip; contain: paint;`), and reduced-motion overrides.
    - Authored production script `site/app.js` with clean GSAP/ScrollTrigger/Lenis motion engine, canvas background, 3D dossier parallax, interactive pipeline scrubber, STAR evidence assembly, vault envelope 3D folding and wax seal, platform tabs, and closing CTA reveal.
    - Updated `site/index.html` referencing production styles/scripts, local vendor fallbacks, and production links.
    - Adapted `site/guide.html` and `site/privacy.html` to the new design system with embedded real product screenshots.
    - Modernized `test-scroll-gate.js` with side-by-side composite comparison against untouched reference at 1440 desktop and 390 mobile in both dark and light themes at 6 matched scene phases (24 composite PNGs).
    - Tested and verified real motion amplitude and state transitions across all scenes.
    - Verified responsive containment (zero overflow across 1440, 1024, 768, 390, 320), sticky clearance, reduced motion, no-JS fallback, reverse scroll, direct midpage reload, and Flutter web app mounting.
    - Fixed `_redirects` configuration for Cloudflare Pages clean URLs to eliminate redirect loops (`/app/* /app/index.html 200`).
    - Deployed via Wrangler to Cloudflare Pages (`https://pathfolio.pages.dev`); verified 100% PASS on remote production gate. [COMPLETE]
14. **Fidelity Hardening: Rolling Counters Geometry Fix & Accessible Mobile Navigation**:
    - Identified and fixed hero rolling counter strip geometry: reference `.od` flex container was stretching `.od span` height to 41.6px (33.6px on mobile) instead of the full 11-digit strip height ($457.6\text{px}$), causing clipped digits.
    - Updated `site/styles.css` with `align-items: flex-start; overflow: hidden;` and `.od-col` with `flex-shrink: 0; height: auto; min-height: 11em;`, and added `align-self: flex-start;` on `.proof dd`.
    - Mathematically guaranteed settled visible glyphs at exactly **6 pipeline stages, 2 platforms, 0 sign-ins, and 0 tracking scripts**.
    - Set truthful accessible screen-reader attributes (`aria-label="6 pipeline stages"`, `.sr-only`) and marked decorative digits `aria-hidden="true"`.
    - Verified static HTML fallback renders the exact digits without JavaScript.
    - Added compact, accessible mobile navigation drawer (`#mob-menu`, `#mob-toggle`, `#mob-backdrop`) in the supplied design visual language.
    - All 9 destinations (5 sections + guide, privacy, app, APK download) accessible on 390px and 320px viewports with tap targets $\ge 44\text{px}$, Escape key dismiss, backdrop click dismiss, link navigation auto-dismiss, and sticky header clearance ($> 15\text{px}$).
    - Updated `test-scroll-gate.js` with strict regressions: verified visible glyphs and bounding overlap $> 90\%$ via `document.elementFromPoint`, and verified complete mobile drawer interactions.
    - Clarified documentation across `PRD.md`, `PROGRESS.md`, `UI_REVIEW.md`, `MOTION_REVIEW.md`, and `MOTION_SPEC.md` establishing the owner HTML as the intended visual specification and marking historical benchmark comparisons as superseded. [COMPLETE]

## Feature Ledger (PRD Must Behaviors)

| ID | Behavior | Risk | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
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
