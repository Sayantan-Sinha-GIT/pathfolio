# Pathfolio — UI/UX Visual Review & Quality Log (Section 4A)

## Design Brief & Benchmarks
- **Audience & Context**: Students and early-career software engineers managing technical application cycles.
- **Visual Aesthetic**: The Kinetic Career Dossier — warm porcelain backgrounds (`#F8F7F4`), deep ink typography (`#16171A`), confident Alpine Verdigris accent (`#134E43` light, `#2DD4BF` dark), architectural brass milestones (`#B87333`), tactile hairline borders, and clear semantic status indicators.
- **CodeSense Motif Removal Audit**: Completely removed dark cosmic space void, neon orange filaments, floating particle nodes, red/amber/green IDE window dots, and pseudo-terminal logs. Replaced with an architectural milestone rail, tactile candidate dossier card, self-hosted typography, and structured STAR evidence matrix.
- **Typography System (Self-Hosted)**:
  - Display / Headings: `Fraunces` (600, 700)
  - Body & UI: `Plus Jakarta Sans` (400, 500, 600, 700)
  - Monospace / Badges: `JetBrains Mono` (400, 500)
- **Viewports Tested**: Desktop (1440×900), Small Laptop/Tablet (1024×768), Mobile (390×844), Narrow Mobile (320×600).
- **Core Anchor Journey**: Candidate Dossier → 6-Stage Milestone Rail → STAR Evidence Matrix → Sovereign Privacy Vault → Interactive JSON Schema v1 Export → In-App Workspace.

---

## Part 1: Flutter Application Visual Iteration Log (4 Rounds)

| Iteration | Screens/States/Viewports Inspected | Screenshot / Device Evidence | Defects Identified | Fixes Applied | Repeated Anchor Check | Remaining Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Composition | Landing page (1440x900), App Onboarding (1440x900), App Dashboard (1440x900) | `screenshots/dashboard-desktop-1440.png` | Accent color was previously mismatched terracotta; side nav header Row in tablet mode risked overflow when compact | Aligned `AppColors.accent` to `#134E43` (Alpine Verdigris) and `darkAccent` to `#2DD4BF`; expanded side nav width to 240px; wrapped brand title Column in Expanded | Anchor flow from Onboarding into Dashboard verified with full visual hierarchy | First-viewport hierarchy clear with obvious primary actions. |
| 2. Interaction | Pipeline Kanban & List (1440x900, 1024x768), Opportunity Form modal, Task modal, Evidence selector | `screenshots/evidence-desktop-1440.png` | Action items header row flex clashed on medium viewports with the "Add Task" button; dialogs lacked safe default focus on Cancel | Converted Action Items header to flex wrap; guaranteed destructive dialogs autofocus Cancel button; verified keyboard dismiss | Repeated anchor: created opportunity, changed stage via popup chip menu, verified live counter updates | Pipeline interaction fully functional across viewports. |
| 3. Craft | Evidence Bank (1440x900), Settings & Data Privacy (1440x900, 1024x768), Dark Mode | `screenshots/settings-desktop-1440.png` | Settings theme toggle segmented button caused 7.1px horizontal wrap warning on 1024px tablet; plain text in evidence cards needed stronger visual tags | Refactored Settings theme selector to responsive Wrap layout; styled skill badges with subtle rounded pill tags and high contrast | Repeated anchor: added evidence item, verified citation chip in opportunity detail, exported JSON backup | Craft parity matches editorial porcelain/ink direction; contrast exceeds WCAG AA. |
| 4. Release & Breakpoints | Mobile Viewport (390x844), Narrow Viewport (320x600), Live Cloudflare Pages (`https://pathfolio.pages.dev/app/`) | `screenshots/app-mobile-390.png` | Bottom navigation bar icons on 320px narrow screens needed safe spacing; mobile AppBar required clear title | Verified Flutter NavigationBar with responsive destination icons; tested horizontal scroll for stage chips on 320px; confirmed live production deployment | Full key journey executed end-to-end on live Cloudflare Pages URL without layout errors or broken links | Zero visual overflow across all 4 target breakpoints. |

---

## Part 2: Public Website Cinematic Motion & Visual Log (6 Rounds)

*Detailed frame analysis, frame pacing, and motion lifecycle documented in `MOTION_SPEC.md` and `MOTION_REVIEW.md`.*

| Round | Surface / Screens / States / Viewports | Screenshot / Rendered Evidence | Defects Observed | Fixes Applied | Repeated Anchor Check | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Composition & Motifs | Hero, Milestone Dossier at 1440×900 | Browser DevTools Viewport Check | Homepage copied CodeSense cosmic graph, dark void, and orange filaments; lacked unique product metaphor | Overhauled visual world to Kinetic Career Dossier: warm porcelain `#F8F7F4`, Alpine Verdigris `#134E43`, architectural drafting grid with kinetic guide rails | Display headline in `Fraunces` serif immediately readable before animation completes; primary CTA prominent above fold | Passed |
| 2. Self-Hosted Typography | Computed styles across all elements (`h1`, `h2`, `p`, `button`, `code`) | `document.fonts` inspection in DevTools | System fonts were used without self-hosted loading, causing fallback shifts | Self-hosted 8 woff2 files in `/fonts/` (`Fraunces` 600/700, `Plus Jakarta Sans` 400/500/600/700, `JetBrains Mono` 400/500); verified `status: "loaded"` in browser | Clean typography hierarchy with zero external font requests | Passed |
| 3. Interaction & Scrubber | Hero Scrubber, Milestone Stations, Profile Cycling | Browser automation inspection | Stepper was static mock; lacked candidate switching | Built dynamic milestone controller in `site/app.js`: clicking stations or prev/next advances fill width, badge, and audit log; cycles realistic candidate profiles | Tested full progression (Saved → Applied → Screening → Interview → Offer → Rejected) | Passed |
| 4. Scroll Narrative & Chapters | 6-Stage Runway, STAR Matrix, Privacy Vault, Schema Inspector | Browser automation inspection | App tour grid and schema inspector button overflowed on smaller widths | Added `.app-tour-grid` responsive class; flex-wrapped schema inspector header; connected STAR filter tabs and simulated citation feedback | All 3 chapters verified with smooth transitions and valid schema v1 JSON download | Passed |
| 5. Mobile Ergonomics | Desktop (1440px), Mobile (390px), Narrow (320px) | Browser DevTools Viewport Check (390×844 true emulation) | Prior 487px measurement was an intermediate desktop window-border artifact, not a valid 390px pass; under true 390px mobile emulation, document `scrollWidth` blew out to 468px due to header CTA button, and mobile menu drawer was clipped inside header `backdrop-filter` containing block to 64.8px height | Hid desktop header CTA on mobile (`.site-header .header-actions .btn { display: none; }`), flex-wrapped dossier header, bounded canvas pips away from hero text zone, and moved `#mobile-nav` outside sticky header containing block to body root with `height: calc(100vh - var(--header-height)); z-index: 999;` | Measured in DevTools: `innerWidth: 390px, clientWidth: 390px, scrollWidth: 390px` (`hasHorizontalOverflow: false`). Tested open mobile drawer with all 9 links visible down to y: 844px; clicked Launch Web App and Guide links with verified navigation and zero overflow | Passed |
| 6. Cross-Route Cohesion | `/`, `/guide.html`, `/privacy.html`, `/app/` | Browser DevTools Cross-Route Check | `/guide.html` and `/privacy.html` had haphazard raw inline styles and lacked theme toggle/mobile drawer | Replaced inline styles with unified design system classes; linked `app.js` across all routes; verified theme persistence and reduced motion | Cross-route matrix confirms shared fonts, colors, nav, theme, and 0px text overlap | Passed |

---

## Part 3: QA Hardening & Truth Verification Addendum

Following independent QA audit, four critical hardening requirements were executed and verified:
1. **True 390px Mobile Viewport & Menu Drawer Containment**:
   - Eliminated horizontal scroll blowout (`scrollWidth: 468px -> 390px`).
   - Resolved CSS containing-block trap where `.site-header`'s `backdrop-filter: blur(12px)` clipped `.mobile-nav-drawer` to 64.8px. Moved `#mobile-nav` to body root with full viewport height (`780px` visible space beneath 64px header).
   - Guarded canvas milestone rails and pips away from hero text zone (`y >= 60 && y <= 440 && px >= width * 0.04 && px <= width * 0.96`), ensuring zero dots or lines obscure hero headline or body copy.
2. **Storage Truth & Architecture Alignment**:
   - Confirmed `IStorageService` implementation is purely `SharedPreferences` (browser `localStorage` on web, sandboxed app storage on Android).
   - Removed all unsupported claims of "Android Keystore", "guaranteed IndexedDB", "hardware encryption", or "libsodium".
3. **Six-Stage Lifecycle Scope (`stage.dart`)**:
   - Replaced "Accepted" with `Rejected` across hero scrubber, interactive stations, guide walkthrough, and copy to match `JobStage.rejected`.
   - Removed unverified mentions of automatic reminders, total-compensation calculations, and immutable audit ledgers.
   - Replaced competitor accusations with objective architectural comparisons.
4. **App Font & Theme Parity**:
   - Bundled SIL Open Font License `Plus Jakarta Sans` and `Fraunces` TTFs in `app/assets/fonts/` and registered in `app/pubspec.yaml`.
   - Replaced missing `Segoe UI` with `Plus Jakarta Sans` in `app_theme.dart` for true cross-platform typography on Android and Web.
   - Refined dark theme to a distinct deep-forest ink dossier (`#0C1513` base, `#14221F` surface) and light theme to warm porcelain (`#F8F7F4` / `#FAF8F5`).
5. **Storage Architecture Tradeoffs & Neutrality**:
   - Replaced all biased claims in the Chapter 3 comparison grid with neutral, balanced storage tradeoffs between centralized cloud (automatic cross-device sync, remote storage) and local-first client architecture (zero telemetry, offline resilience).
   - Honestly documented browser storage limitations (profile scoping, cache clearing impact, incognito behavior) and the versioned JSON export/restore transfer mechanism.
   - Replaced glowing cyan/teal pips with solid warm brass index beads (`#D4AF37`) and lined ledger rules, completely eliminating any visual resemblance to CodeSense.
