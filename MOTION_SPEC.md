# Pathfolio — Cinematic Web Motion Specification

## 1. Product Metaphor & Visual World
- **Product Metaphor**: **The Career Trajectory & Proof Constellation**.
  Early-career engineering job hunting is not a flat spreadsheet; it is an active navigation through high-stakes technical milestones, interview debriefs, and verifiable career proof.
  Pathfolio's visual world represents this as a living command deck: luminous career nodes (STAR achievements, latency reductions, architecture benchmarks) connected by kinetic filaments and velocity trails, grounded on tactical porcelain/ink editorial surfaces with hairline coordinate radar lines.
- **Palette & Materials**:
  - Deep Ink & Tactical Night: `#0B0D11` background, `#12151C` cards, `#1D222E` borders.
  - Editorial Light Mode (theme toggle): Warm porcelain `#FAF8F5`, soft parchment `#F3EFEA`, deep ink `#16171A`.
  - Signal Accents: Terracotta `#C85A32` (action & momentum), Amber `#D97706` (active screening & deadlines), Emerald `#10B981` (verified offers & proof), Cyan/Blue `#38BDF8` (system coordinates).
  - Tactile textures: Laser-etched coordinate hairlines, glowing beacon indicators, and subtle mesh gradients.

---

## 2. Layered Living Environment
The background is an active 3-layer system rendering continuous, perceptible motion:
1. **Layer 1: Ambient Mesh Aura**:
   - Slow-drifting radial atmospheric gradients (`aurora-1`, `aurora-2`) that subtly cycle hue and position over 24-second loops, providing warmth without distracting from text.
2. **Layer 2: Interactive Kinetic Constellation Canvas (`#career-canvas`)**:
   - 2D Canvas with floating career evidence nodes labeled with real engineering proof metrics (*"p99 -40%", "v1 schema", "zero-downtime", "4.2M events", "local vault"*).
   - Kinetic filaments link nodes that drift within proximity.
   - Directed energy pulses ("momentum packets") travel along connected paths.
   - Pointer / touch proximity creates an interactive gravitational pull that gently brightens and connects nearby career nodes.
3. **Layer 3: Coordinate Radar & Editorial Grid**:
   - Technical coordinate hairline grid with active telemetry markers (`STATUS: LOCAL_ONLY`, `LAT: 37.77 LON: -122.41`, `PACKETS_EXTERNAL: 0`, `ENGINE: FLUTTER_3.47`).

---

## 3. Staged Hero Sequence
- **Phase 0 (0.0s)**: Background canvas starts gently drifting; coordinate grid renders; hero text is immediately readable with clean typography.
- **Phase 1 (0.2s - 0.6s)**: Eyebrow pill slides and fades in with pulsing green status beacon (*"100% Client-Side • Zero Cloud Tracking • Works Offline"*).
- **Phase 2 (0.4s - 0.9s)**: Primary display headline cascades in with crisp letter-spacing: *"The Considered Command Center for Your Career Trajectory."*
- **Phase 3 (0.7s - 1.2s)**: Lead paragraph and dual CTAs (*"Launch Web App ↗"*, *"Download Android APK ↓"*) fade up.
- **Phase 4 (1.0s - 2.5s & continuous)**: The Hero Interactive Command Deck comes alive:
  - An interactive opportunity card (*"Linear — Systems Engineer"*) animates through pipeline stages with glowing connector beams.
  - Live activity feed logs stage updates in real time with timestamp badges.
  - Interactive stage scrubber allows users to take manual control of the preview.

---

## 4. Scroll Narrative: Three Distinct Chapters

### Chapter 1: The 6-Stage Flight Path (Pipeline Flow)
- **Visual Narrative**: Career progression visualized as a directed runway rather than static cards.
- **Scroll Transition**: An animated horizontal/vertical glowing filament advances across the stages as the user scrolls into view.
- **Interactive Component**: Interactive stage tabs (*Saved → Applied → Screening → Technical → Final → Offer*). Clicking a stage dynamically updates the telemetry panel, showing real-time days-in-stage velocity, sample recruiter notes, and interview prep checklists.

### Chapter 2: The STAR Evidence Matrix (Proof That Wins Offers)
- **Visual Narrative**: Quantifiable achievements synthesized into instant interview talking points.
- **Scroll Transition**: Cards reveal with subtle staggered depth translation and glowing border highlights.
- **Interactive Component**: Category selector (*System Architecture, Performance Tuning, High-Availability, Security*). Clicking dynamically renders an interactive STAR card with real technical metrics, complete with a *"Simulate Citing in Interview"* button that animates an evidence tag snapping into an active application dossier.

### Chapter 3: The Zero-Knowledge Privacy Vault (Local Sandbox vs. Cloud Surveillance)
- **Visual Narrative**: A side-by-side architectural flow diagram comparing standard cloud platforms (data leaking to external ad networks, recruiters, recruiters' spam lists) with Pathfolio's enclosed local vault.
- **Scroll Transition**: Dynamic packet stream visualizer showing external packet counts remaining strictly at `0` for Pathfolio while leaking on conventional platforms.
- **Interactive Component**: Interactive toggle between *"Standard Cloud Job Board"* and *"Pathfolio Local Vault"* showing the visual firewall locking down all local records.

---

## 5. The Real Interactive Product Demonstration
- Embedded live mini-workspace directly on the landing page:
  1. Pick an application (*Linear, Stripe, Cloudflare, Figma*).
  2. Advance stages (*Applied → Screening → Technical → Offer*) with live count adjustments.
  3. Attach real STAR evidence tags.
  4. Toggle follow-up tasks with dynamic overdue/upcoming counters.
  5. **Generate & Download Real Pathfolio v1 JSON Backup**: Generates an authentic, valid JSON export file matching the production schema that can be immediately imported into the real Pathfolio web or Android app!
  6. Direct jump into `/app/` with preloaded state.

---

## 6. Mobile & Responsive Adaptation
- **Tablet (1024px)**: Grid shifts to 2-column layout; canvas particle density reduced by 30%; hero maintains side-by-side balance.
- **Mobile (390px) & Narrow (320px)**:
  - Canvas scales canvas pixel buffer, caps particle count to 22 nodes, and replaces hover with touch tap-to-focus.
  - Flight path pipeline scrolls horizontally with snap points and clear active indicators.
  - Interactive simulator stacks into tactile touch cards with full tap targets (>48px).
  - Navigation switches to a sleek slide-down mobile menu.

---

## 7. Reduced-Motion & Accessibility Replacement
- Evaluates `(prefers-reduced-motion: reduce)`:
  - Canvas stops `requestAnimationFrame` loop and renders an elegant, high-contrast static starfield grid with zero motion.
  - CSS animations and keyframe transforms transition instantly via `opacity: 1` and `transform: none`.
  - All interactive controls (stage switcher, STAR matrix, interactive simulator, JSON export) remain 100% functional via keyboard (Tab, Enter, Space) and screen readers with complete ARIA attributes.

---

## 8. Performance Budget & Ownership
- Animation loop throttled by `requestAnimationFrame`.
- `IntersectionObserver` halts canvas rendering when the hero scrolls out of view.
- Document `visibilitychange` listener suspends rendering when the browser tab is hidden or minimized.
- Device pixel ratio capped at `Math.min(window.devicePixelRatio || 1, 2)` to eliminate GPU fill-rate bottlenecks.
- Zero external heavyweight animation dependencies (pure native Canvas 2D + vanilla CSS transforms) ensures ultra-fast page load under 150ms.

