# Pathfolio — UI/UX Visual Review & Quality Log (Section 4A)

## Design Brief & Benchmarks
- **Audience & Context**: Students and early-career software engineers managing technical application cycles.
- **Visual Aesthetic**: The Kinetic Career Dossier — warm porcelain backgrounds (`#F8F7F4`), deep ink typography (`#16171A`), confident Alpine Verdigris accent (`#0F4D3F` light, `#2DD4BF` dark), architectural brass milestones (`#B87333`), tactile hairline borders, and clear semantic status indicators.
- **CodeSense Motif Removal Audit**: Completely removed dark cosmic space void, neon orange filaments, floating particle nodes, red/amber/green IDE window dots, and pseudo-terminal logs. Replaced with an architectural milestone rail, tactile candidate dossier card with underlay sheets, self-hosted typography, and structured STAR evidence matrix.
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
| 1. Composition | Landing page (1440x900), App Onboarding (1440x900), App Dashboard (1440x900) | `screenshots/dashboard-desktop-1440.png` | Accent color was previously mismatched terracotta; side nav header Row in tablet mode risked overflow when compact | Aligned `AppColors.accent` to `#0F4D3F` (Alpine Verdigris) and `darkAccent` to `#2DD4BF`; expanded side nav width to 240px; wrapped brand title Column in Expanded | Anchor flow from Onboarding into Dashboard verified with full visual hierarchy | First-viewport hierarchy clear with obvious primary actions. |
| 2. Interaction | Pipeline Kanban & List (1440x900, 1024x768), Opportunity Form modal, Task modal, Evidence selector | `screenshots/evidence-desktop-1440.png` | Action items header row flex clashed on medium viewports with the "Add Task" button; dialogs lacked safe default focus on Cancel | Converted Action Items header to flex wrap; guaranteed destructive dialogs autofocus Cancel button; verified keyboard dismiss | Repeated anchor: created opportunity, changed stage via popup chip menu, verified live counter updates | Pipeline interaction fully functional across viewports. |
| 3. Craft | Evidence Bank (1440x900), Settings & Data Privacy (1440x900, 1024x768), Dark Mode | `screenshots/settings-desktop-1440.png` | Settings theme toggle segmented button caused 7.1px horizontal wrap warning on 1024px tablet; plain text in evidence cards needed stronger visual tags | Refactored Settings theme selector to responsive Wrap layout; styled skill badges with subtle rounded pill tags and high contrast | Repeated anchor: added evidence item, verified citation chip in opportunity detail, exported JSON backup | Craft parity matches editorial porcelain/ink direction; contrast verified for high readability on tested displays. |
| 4. Release & Breakpoints | Mobile Viewport (390x844), Narrow Viewport (320x600), Live Cloudflare Pages (`https://pathfolio.pages.dev/app/`) | `screenshots/app-mobile-390.png` | Bottom navigation bar icons on 320px narrow screens needed safe spacing; mobile AppBar required clear title | Verified Flutter NavigationBar with responsive destination icons; tested horizontal scroll for stage chips on 320px; confirmed live production deployment | Full key journey executed end-to-end on live Cloudflare Pages URL without layout errors or broken links | Zero visual overflow across all 4 target breakpoints. |

---

## Part 2: Public Website Cinematic Motion & Visual Log (6 Rounds)

*Detailed frame analysis, frame pacing, and motion lifecycle documented in `MOTION_SPEC.md` and `MOTION_REVIEW.md`.*

| Round | Surface / Screens / States / Viewports | Screenshot / Rendered Evidence | Defects Observed | Fixes Applied | Repeated Anchor Check | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Composition & Motifs | Hero, Milestone Dossier at 1440×900 (t0, t1.5s) | `screenshots/local-desktop-1440-t0.png`, `screenshots/local-desktop-1440-t1.5.png` | Homepage was previously too quiet and copied CodeSense cosmic graph; hero composition was flat | Overhauled to Haan-level craft: asymmetric 12-column hero grid (`1.15fr 0.85fr`), 3D perspective layered career dossier card (`#hero-dossier-card` with physical underlay sheets and scroll-tilt parallax), warm porcelain `#F8F7F4` default | Display headline in `Fraunces` serif immediately readable before animation completes; primary CTA prominent above fold | PASSED |
| 2. Self-Hosted Typography | Computed styles across all elements (`h1`, `h2`, `p`, `button`, `code`) | `document.fonts` inspection in DevTools | System fonts were used without self-hosted loading, causing fallback shifts | Self-hosted 8 woff2 files in `/fonts/` (`Fraunces` 600/700, `Plus Jakarta Sans` 400/500/600/700, `JetBrains Mono` 400/500); verified `status: "loaded"` in browser | Clean typography hierarchy with zero external font requests | PASSED |
| 3. Chapter 1: Pipeline Runway | Scroll depth 25%, `#chapter-pipeline` / `#milestones` | `screenshots/local-chapter1-before.png`, `screenshots/local-chapter1-after.png` | Scroll animations were non-functional or purely time-based | Built requestAnimationFrame scroll-driven controller: `#pipeline-rail-carriage` advances $x = 258\text{px} \rightarrow 787\text{px}$, `#pipeline-scroll-bar` scales $\text{scaleX } 0.243 \rightarrow 0.741$, telemetry updates from `02 // APPLIED` to `05 // WRITTEN OFFER` | Tested full progression across all 6 stages (`Saved` through `Rejected`) | PASSED |
| 4. Chapter 2: STAR Assembly Deck | Scroll depth 50%, `#chapter-evidence` / `#star-matrix` | `screenshots/local-chapter2-before.png`, `screenshots/local-chapter2-after.png` | STAR fragments were static cards lacking physical assembly metaphor | Created dynamic scroll assembly: Situation, Task, Action, Result fragments converge from detached state (`matrix(0.996, ...)` $\rightarrow$ `matrix(0.999, ...)`, opacity $0.58 \rightarrow 0.93$) and central verification seal stamps down ($\text{scale } 0.388 \rightarrow 0.908$, $\text{opacity } 0.0 \rightarrow 0.80$) | Category filter tabs and live citation attachment fully responsive | PASSED |
| 5. Chapter 3: Sovereign Vault | Scroll depth 75%, `#chapter-vault` / `#privacy-vault` | `screenshots/local-chapter3-before.png`, `screenshots/local-chapter3-after.png` | Vault lacked tangible security and privacy interaction | Built 3D dossier packet sealing: dimensional envelope flap folds shut ($\text{rotateX } -74^\circ \rightarrow -23^\circ$, opacity $0.71 \rightarrow 0.91$), hot brass wax seal presses down ($\text{translateY } -44\text{px} \rightarrow -14\text{px}$, $\text{scale } 0.61 \rightarrow 0.88$), schema code drawer slides open ($\text{translateY } 44\text{px} \rightarrow 14\text{px}$) | Verified valid schema v1 JSON sample download matching app backup schema | PASSED |
| 6. Responsive Breakpoints & Ergonomics | Desktop (1440px), Tablet (1024px), Mobile (390px), Narrow (320px) | `screenshots/local-mobile-390-hero.png`, `screenshots/local-mobile-390-menu-open.png`, `screenshots/local-tablet-1024.png`, `screenshots/local-narrow-320.png` | At 1024px, 3D card tilt protruded 2.3px; at 320px, `.btn` `white-space: nowrap` caused 33px overflow | Added `overflow-x: hidden; max-width: 100vw;` on `html` and `body`, bounded `.hero-dossier-col` with `max-width: 580px; margin: 0 auto; overflow: hidden;` at 1024px, wrapped `.star-assembly-deck` with `overflow: hidden`, and added responsive button wrapping/padding for $\le 390\text{px}$ and $\le 340\text{px}$ | Measured in Playwright: `hasOverflow: false` across all 5 viewports (1440, 1024, 768, 390, 320). Mobile drawer opens to 780px with all 9 links visible | PASSED |

---

## Part 3: QA Hardening & Truth Verification Addendum

Following independent QA audit, critical truth and ergonomics hardening items were verified:
1. **True Mobile Viewport & Menu Drawer Containment**:
   - Eliminated horizontal scroll blowout on 390px and 320px (`scrollWidth === innerWidth === 390px` and `320px`).
   - Resolved CSS containing-block trap where `.site-header`'s `backdrop-filter: blur(12px)` clipped `.mobile-nav-drawer` to 64.8px. Moved `#mobile-nav` to body root with full viewport height (`780px` visible space beneath header).
   - Guarded canvas milestone rails and pips away from hero text zone, ensuring zero dots or lines obscure hero headline or body copy.
2. **Storage Truth & Architecture Alignment**:
   - Confirmed `IStorageService` implementation is purely `SharedPreferences` (browser `localStorage` on web, sandboxed app storage on Android).
   - Removed all unsupported claims of "Android Keystore", "guaranteed IndexedDB", "hardware encryption", or "libsodium".
3. **Six-Stage Lifecycle Scope (`stage.dart`)**:
   - Aligned stages to `JobStage`: `Saved`, `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`.
   - Removed unverified mentions of automatic reminders, total-compensation calculations, and immutable audit ledgers.
4. **App Font & Theme Parity**:
   - Bundled SIL Open Font License `Plus Jakarta Sans` and `Fraunces` TTFs in `app/assets/fonts/` and registered in `app/pubspec.yaml`.
   - Replaced missing `Segoe UI` with `Plus Jakarta Sans` in `app_theme.dart` for true cross-platform typography on Android and Web.
   - Refined dark theme to a distinct deep-forest ink dossier (`#0A1210` base, `#121C18` surface) and light theme to warm porcelain (`#F8F7F4` / `#FAF8F5`).
5. **Storage Architecture Tradeoffs & Neutrality**:
   - Replaced all biased claims in the Chapter 3 comparison grid with neutral, balanced storage tradeoffs between centralized cloud (automatic cross-device sync, remote storage) and local-first client architecture (zero telemetry, offline resilience).
   - Honestly documented browser storage limitations (profile scoping, cache clearing impact, incognito behavior) and the versioned JSON export/restore transfer mechanism.
