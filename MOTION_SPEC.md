# Pathfolio — Kinetic Career Dossier Motion & Visual Specification

## 1. Reference Identity Gate & Motif Audit

### CodeSense Benchmark Analysis (Craft floor, distinct visual world)
- **Palette**: Dark space void (`#0B0D12` / `#0B0E14`), glowing neon orange/amber accent (`#E06D44`, `rgba(224, 109, 68, 0.35)`), cyan terminal accents.
- **Font Style**: Display serif `Gloock` paired with `Schibsted Grotesk` body.
- **Hero Composition**: Asymmetric split — oversized headline on the far left, pseudo-IDE terminal / diff console with red/amber/green window dots on the right.
- **Background Motif**: Deep cosmic orbital field with drifting particles, elastic geometric proximity filaments, and glowing star nodes.
- **Motion Grammar**: Floating gravitational particles, travelling energy packet pulses along filaments, terminal typewriter logs.

### Shared Motifs Explicitly REMOVED from Pathfolio
1. **Dark cosmic space void**: Completely eliminated `#0B0D12` / `#0B0E14` black background.
2. **Neon orange/amber glow & auroras**: Removed `--accent-glow: rgba(224, 109, 68, 0.35)` and atmospheric aurora gradient drift.
3. **Drifting star particles & spider-web filaments**: Removed canvas-driven particle constellation and elastic distance lines.
4. **Floating code tags**: Removed floating technical labels in the background canvas.
5. **Terminal / mock IDE window hero**: Removed red/amber/green window dots, pseudo-terminal logs (`pathfolio@local:~$`), and developer observability framing.
6. **Tactile telemetry / military tropes**: Removed slash dividers (`CLIENT STORAGE / REMOTE TRACKING / BACKUP FORMAT`), `LOCAL_V1` radar badges, and devops telemetry styling.

### Pathfolio's New Distinct Choices (Private Career Workspace)
- **Visual Metaphor**: **The Kinetic Career Dossier & Milestone Rail**. An architectural, tangible personal workspace engineered for high-agency candidates. Fine archival paper surfaces, embossed dossier folders, tactile milestone tab indexing, and purposeful linear momentum.
- **Palette & Materials**:
  - Primary Ground (Light Mode default): Warm linen / architectural porcelain (`#F8F7F4`), soft recessed tray (`#F0EDE6`), crisp archival white card surfaces (`#FFFFFF`).
  - Deep Dossier (Dark Mode): Architect's obsidian night studio (`#111317`), dark slate card surfaces (`#181B21`), structural borders (`#292F3B`).
  - Signature Accent: **Alpine Verdigris / Confident Evergreen (`#134E43` light, `#2DD4BF` dark)** — conveying permanence, executive polish, and natural growth.
  - Secondary Accent: **Architectural Chamois / Brass (`#B87333` / `#A16207`)** — highlighting active milestone dates and STAR evidence tags.
  - Structural Ink: Deep warm charcoal (`#16171A`), secondary warm graphite (`#525760`), muted stone (`#808693`).
- **Typography System (Self-Hosted)**:
  - Display / Headings: `Fraunces` (600, 700) — editorial authority, high typographic craft, bespoke career portfolio personality.
  - Body & UI: `Plus Jakarta Sans` (400, 500, 600, 700) — airy, modern, clean geometric clarity.
  - Tabular / Monospace: `JetBrains Mono` (400, 500) — technical precision for timestamps, STAR metrics, and schema inspection.
  - Reliable local font loading from `/fonts/` with zero external network font requests.
- **Hero Composition**:
  - Full-width balanced editorial presentation.
  - Centered executive briefing: Distinctive dossier badge, Fraunces headline (*"The Private Career Dossier for Ambitious Engineers"*), concise product value proposition.
  - Direct Action Bar: Primary "Launch Web App →" (verdigris pill), Secondary "Download Android APK", anchor link to "Interactive Dossier".
  - Hero Centerpiece: **The Kinetic Milestone Dossier Card** — an interactive tactile dossier folder featuring a 6-stage milestone progression rail, live candidate profile (*"Maya Lin — Senior Distributed Systems Engineer"*), milestone scrubber, and linked STAR evidence citation.

---

## 2. Layered Living Environment

1. **Layer 1: Architectural Paper Texture & Drafting Grid**:
   - Subtle tactile background with ultra-faint hairline drafting grid lines (32px grid at 4% opacity).
   - Architectural registration marks at section corners providing tangible workspace depth.
2. **Layer 2: The Kinetic Milestone Ledger Canvas (`#dossier-canvas`)**:
   - Subtle geometric coordinate lines with moving milestone velocity pulses.
   - Smooth horizontal career guide rails across the viewport with gentle, flowing milestone pips (moving at 18px/s with silky easing).
   - Interactive mouse/touch proximity gently reveals subtle architectural ledger ticks and milestone connectors.
   - Strictly throttled at 60fps via `requestAnimationFrame`, pauses when hidden or out of view, and honors `prefers-reduced-motion: reduce`.
3. **Layer 3: Structural Content Layer**:
   - Clean porcelain cards with crisp 1px borders (`#E4DFD7`) and subtle multi-layered physical shadows (`0 2px 8px rgba(0,0,0,0.03), 0 12px 28px rgba(0,0,0,0.05)`).

---

## 3. Staged Hero Sequence

- **Phase 0 (0.0s)**: Architectural grid and background canvas initialize; text rendered immediately with fallback fonts before webfont swap.
- **Phase 1 (0.2s - 0.5s)**: Dossier status seal and badge fade in (*"Private Career Workspace • Local Storage Only"*).
- **Phase 2 (0.4s - 0.8s)**: Editorial headline fades and rises smoothly into place with Fraunces letterform rendering.
- **Phase 3 (0.7s - 1.1s)**: Executive lead copy and action button group transition smoothly into place.
- **Phase 4 (0.9s - 1.6s & continuous)**: The Kinetic Dossier Card reveals its interactive milestone rail:
  - 6 milestone stations (`Saved`, `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`).
  - Active milestone indicator smoothly slides across stages.
  - Attached STAR evidence badge displays quantifiable impact metrics (*"Reduced p99 latency by 38% under 15k req/s"*).
  - Users can scrub forward and backward through milestones, immediately seeing candidate timeline history update.

---

## 4. Scroll Narrative: Three Distinct Chapters

### Chapter 1: The Milestone Pipeline Rail (Operational Velocity)
- **Visual Concept**: The multi-stage application journey visualized as an architectural progress rail.
- **Choreography**: Stepped milestone stages with progressive reveal lines that connect stage to stage as the user scrolls.
- **Interactive Component**: Tactile stage tabs (*Saved → Applied → Screening → Technical Loop → Executive Offer*). Clicking a stage switches the live dossier view: shows realistic days-in-stage metrics, recruiter coordination logs, and interview prep checklists.

### Chapter 2: The STAR Evidence Matrix (Quantifiable Interview Proof)
- **Visual Concept**: Structured interview talking points mapped to the Situation, Task, Action, Result framework.
- **Choreography**: Subtle stagger entry with tactile elevation on hover/focus.
- **Interactive Component**: Skill domain filter tabs (*Systems & Scale, Performance & Reliability, Security & Vault, Frontend Architecture*). Selecting a filter dynamically populates the evidence card with production-grade achievements, including an interactive *"Attach to Application"* demonstration.

### Chapter 3: Sovereign Privacy & Atomic Vault (Storage Architecture)
- **Visual Concept**: Architectural comparison between commercial job portals (cloud surveillance, resume scraping, automated rejections) and Pathfolio's sandboxed device storage.
- **Choreography**: Side-by-side comparative inspection card with clear privacy badges.
- **Interactive Component**: Live **Schema v1 JSON Inspector & Export Generator**. Visitors can inspect a real, formatted Pathfolio backup payload and click *"Download Sample Backup (JSON)"* to generate a genuine v1 schema backup file that can be immediately imported into the live web or Android app.

---

## 5. Universal Route Consistency & Typography

- **Shared Navigation Bar**:
  - Consistent across `/`, `/guide.html`, and `/privacy.html`.
  - Brand seal with architectural "P" monogram and version tag.
  - Clear section navigation and route links.
  - Universal theme switcher with smooth SVG sun/moon icon transition.
  - Mobile slide-out drawer navigation for viewports under 800px.
- **Shared Footer**:
  - Consistent architectural layout with product mission, quick route links, GitHub repository, and license citation.
- **Typography Matrix**:
  - Display: `Fraunces` (600, 700) for all main headings (`h1`, `h2`, `h3`).
  - Body: `Plus Jakarta Sans` (400, 500, 600, 700) for all paragraphs, lists, buttons, and navigation.
  - Mono: `JetBrains Mono` (400, 500) for badges, metrics, dates, code blocks, and schema payloads.
- **Reading Routes (`/guide.html` & `/privacy.html`)**:
  - Eliminate all ad-hoc inline styles.
  - Calmer, focused editorial reading layout (`max-width: 780px`, line-height `1.7`, generous paragraph rhythm).
  - Elegant section index rail and structured callout panels.
  - Shared styling tokens (`--bg`, `--surface`, `--border`, `--ink-primary`, `--accent`).
- **Flutter Web App (`/app/`)**:
  - Updated theme tokens matching the Alpine Verdigris & Warm Porcelain identity.
  - Primary accent `#134E43`, dark accent `#2DD4BF`, warm porcelain background `#FAF8F5`, white surface `#FFFFFF`.
  - Clean font fallbacks aligning with Plus Jakarta Sans and modern sans geometry.

---

## 6. Accessibility & Reduced Motion

- **`prefers-reduced-motion: reduce`**:
  - Stops canvas animation loop immediately.
  - Renders a clean, high-contrast static architectural grid.
  - Replaces CSS keyframe transitions with instant opacity changes.
  - Preserves 100% of interactive controls and content availability.
- **Keyboard & Screen Reader Support**:
  - Visible 2px high-contrast focus rings (`outline: 2px solid var(--accent); outline-offset: 2px`).
  - Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - Proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`, `role="region"`).
- **Color Contrast**:
  - All body text meets WCAG AAA standards (>7:1 ratio).
  - All headings, badges, and controls meet WCAG AA standards (>4.5:1 ratio).
