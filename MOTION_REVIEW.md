# Pathfolio — Website Cinematic Motion Review Log (Section 4A)

## Visual Direction & Motion Spec
- **Product Metaphor**: **The Career Trajectory & Proof Constellation**.
- **Palette**: Deep Ink (`#0B0D11`), Warm Porcelain (`#FAF8F5`), Terracotta Momentum (`#C85A32`), Emerald Proof (`#10B981`), Cyan Coordinates (`#38BDF8`).
- **Target Surfaces**: Public marketing landing page (`/`), User Guide (`/guide.html`), Privacy Policy (`/privacy.html`), and embedded Flutter Web App (`/app/`).
- **Viewports Inspected**:
  - Desktop: 1440 × 900
  - Tablet / Small Laptop: 1024 × 768
  - Mobile: 390 × 844
  - Narrow Mobile: 320 × 600
- **Anchor Journey**:
  1. Staged Hero & Tactical Command Deck (headline, status beacon, dual CTAs, live stepper).
  2. Chapter 01: Six-Stage Flight Path Runway (interactive tabs, velocity telemetry, protocol, checklist).
  3. Chapter 02: STAR Evidence Matrix (category tabs, situation/task/action/result dossier, interview simulation).
  4. Chapter 03: Zero-Knowledge Privacy Vault (interactive comparison: local shield vs cloud data leakage).
  5. Interactive Product Demonstration (playable workspace, opportunity switch, stage moves, tasks, valid schema v1 JSON export).

---

## Six-Round Visual & Motion Review Ledger

### Round 1 — COMPOSITION & INITIAL TIME DELTA
- **Inspected**: Viewport 1440×900 desktop; initial load at `t0` vs. settled continuous drift at `t + 4.6s`.
- **Observed Evidence**:
  - Initial Frame (`screenshots/site-desktop-1440-t0.png`): Display headline *"The Considered Command Center for Your Career Trajectory"* immediately readable before animation completes. Eyebrow badge displays pulsating emerald beacon (`#10B981`). Dual CTAs (*"Launch Web App →"*, *"Download Android APK (50.8 MB)"*) prominent above the fold. Tactical command deck initializes at Stage: *"Screening"*, stepper width `50%`.
  - Later Frame (`screenshots/site-desktop-1440-t2.png`): Canvas constellation nodes (`p99 -42%`, `v1 schema`, `zero-downtime`, `4.2M events`, `local-vault`, `15k req/s`) visibly drift across coordinates with dynamic proximity filaments. Tactical deck auto-cycles forward into *"Final Round"*, stepper width advances to `83.3%`, terminal log updates dynamically to: *"Executive debrief underway. Compensation parameters locked locally."*
- **Defects & Corrections**: None; contrast exceeds WCAG AA standards, initial layout stable without layout shift (CLS: 0).
- **Repeated Anchor Check**: Full hero sequence verified across time.

### Round 2 — INTERACTION & BEHAVIOR
- **Inspected**: All interactive controls exercised programmatically via browser execution.
- **Observed Evidence**:
  - Hero Scrubber: Next button advances stage; previous button reverses stage; cycle toggle successfully pauses auto-play (*"⏸ Pause Auto-Play"*).
  - Flight Path Runway: Clicking Stage 04 (Technical) smoothly animates panel badge to *"STAGE 04 :: TECHNICAL ASSESSMENT"*, updates velocity to *"VELOCITY: 7-10 DAYS EXPECTED"*, and presents role-specific checklist.
  - STAR Evidence Matrix: Category tabs (*Scaling, Reliability, Caching, Incident*) switch instant talking points. Clicking *"⚡ Simulate Citing in Interview"* triggers active citation feedback bar: *"Simulated Citation Attached to Opportunity dossier: Linear — Founding Systems Engineer"*.
  - Privacy Vault Toggle: Switching between *"Pathfolio Local Sandbox"* and *"Conventional Cloud Job Platforms"* displays dynamic network leak diagram (14+ third-party trackers vs 0 external calls).
  - Interactive Demo Console: Selecting *Stripe* switches active opportunity; clicking *Offer* transition logs immediate dated entry (`2026-11-02 14:29 Stage transitioned from Technical → Offer`); task checkbox toggling updates completion badges and recalculates overdue counts; Export button generates authentic Schema v1 JSON backup.
- **Defects & Corrections**: None; all click/touch targets meet >48px ergonomics with visible focus rings.
- **Repeated Anchor Check**: Verified transition across all 5 interactive modules.

### Round 3 — CRAFT & EDITORIAL THEME DUALITY
- **Inspected**: Visual polish, typography, letter-spacing, and dark/light theme switching.
- **Observed Evidence**:
  - Theme Toggle: Clicking `#theme-toggle` switches from Tactical Deep Ink (`#0B0D11`) to Warm Editorial Porcelain (`#FAF8F5`) with smooth 400ms CSS transitions (`screenshots/site-desktop-light-theme.png`).
  - Font Hierarchy: Monospace technical labels (`ui-monospace`), crisp display headings (`-apple-system`), and editorial body copy maintain high readability across both modes.
  - Micro-interactions: Laser-etched hairline borders (`--surface-border`), glowing status beacons, and hover elevations respond cleanly without jank.
- **Defects & Corrections**: Verified theme icon toggles between sun and moon SVGs and persists preference to `localStorage['pathfolio-site-theme']`.
- **Repeated Anchor Check**: Tested complete hero, flight path, and demo console in both light and dark themes.

### Round 4 — RELEASE & RESPONSIVE BREAKPOINTS
- **Inspected**: 1440×900 desktop, 1024×768 tablet, 390×844 mobile, and 320×600 narrow mobile.
- **Observed Evidence**:
  - 1024px Tablet: Two-column grid wraps cleanly; canvas scales particle density; zero horizontal overflow (`scrollWidth: 1011px <= innerWidth: 1026px`).
  - 390px Mobile (`screenshots/site-mobile-390-hero.png`, `screenshots/site-mobile-390-flight.png`, `screenshots/site-mobile-390-demo.png`): Header collapses nav to clean brand + theme toggle + Launch CTA; hero displays full-width tactile action buttons; flight runway displays 2-column touch tiles; interactive console stacks vertically with easy thumb reach.
  - 320px Narrow (`screenshots/site-narrow-320.png`): Zero horizontal overflow; font sizes adjust gracefully; all cards and buttons stay within screen boundaries without clipping.
- **Defects & Corrections**: None; verified touch friendliness and responsive text scaling.
- **Repeated Anchor Check**: Anchor journey navigable on both desktop and mobile viewports.

### Round 5 — MOTION PERFORMANCE & REDUCED-MOTION
- **Inspected**: Frame pacing, throttled rAF loop, IntersectionObserver offscreen pausing, tab visibility handlers, and `prefers-reduced-motion` compliance.
- **Observed Evidence**:
  - Frame Pacing: Measured 60 consecutive frames via rAF: Average delta `6.96ms`, `144 FPS` sustained on high-refresh display with max delta `7.30ms`. Zero stutter or frame drops.
  - Offscreen Throttling: `IntersectionObserver` halts canvas rendering when hero is scrolled out of viewport, reducing GPU utilization to 0%.
  - Tab Visibility: `visibilitychange` listener immediately suspends canvas animation when the browser tab is hidden or minimized.
  - Reduced Motion Fallback (`screenshots/site-desktop-reduced-motion.png`): Emulating `prefers-reduced-motion: reduce` completely disables atmospheric gradient drifting (`display: none`), ceases the continuous canvas animation loop, and renders an elegant, high-contrast static constellation frame with zero motion.
- **Defects & Corrections**: Device pixel ratio capped at `Math.min(window.devicePixelRatio || 1, 2)` to eliminate excessive memory on Retina displays.
- **Repeated Anchor Check**: All interactive components remain 100% accessible and usable in reduced-motion mode.

### Round 6 — FINAL VISUAL COMPARISON & INTEGRATION
- **Inspected**: Full scroll narrative (0%, 25%, 50%, 75%, 100%), live links, deep-link routing into `/app/`, documentation pages, and GitHub links.
- **Observed Evidence**:
  - Scroll Chapters:
    - 0% Hero (`screenshots/site-desktop-1440-t0.png`)
    - 25% Scroll (`screenshots/site-desktop-1440-scroll25.png`): Flight Path Pipeline
    - 50% Scroll (`screenshots/site-desktop-1440-scroll50.png`): STAR Evidence Matrix
    - 75% Scroll (`screenshots/site-desktop-1440-scroll75.png`): Zero-Knowledge Privacy Vault
    - 100% Scroll / Demo (`screenshots/site-desktop-1440-demo.png`): Playable In-Browser Console
  - Live Routing Parity: Navigating to `/app/` loads the Flutter Web Application with 200 OK via `_redirects` SPA fallback; user guide at `/guide.html` and privacy disclosure at `/privacy.html` load cleanly with shared aesthetic and functioning theme toggle.
  - Public Assets: Verified direct links to latest Android APK release (`app-release.apk`) and GitHub repository (`Sayantan-Sinha-GIT/pathfolio`).
- **Defects & Corrections**: None; production build completely verified and ready for deployment.
- **Repeated Anchor Check**: End-to-end user path verified from marketing site directly into working Flutter workspace.
