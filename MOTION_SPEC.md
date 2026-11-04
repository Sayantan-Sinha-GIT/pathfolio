# Pathfolio — Kinetic Career Dossier Motion & Visual Specification

## 1. Reference Identity Gate & Motif Audit

### CodeSense Benchmark Analysis (Craft floor, distinct visual world)
- **Palette**: Dark space void (`#0B0D12` / `#0B0E14`), glowing neon orange/amber accent (`#E06D44`, `rgba(224, 109, 68, 0.35)`), cyan terminal accents.
- **Font Style**: Display serif `Gloock` paired with `Schibsted Grotesk` body.
- **Hero Composition**: Asymmetric split — oversized headline on the far left, pseudo-IDE terminal / diff console with red/amber/green window dots on the right.
- **Background Motif**: Deep cosmic orbital field with drifting particles, elastic geometric proximity filaments, and glowing star nodes.
- **Motion Grammar**: Floating gravitational particles, travelling energy packet pulses along filaments, terminal typewriter logs.

### Shared Motifs Explicitly REMOVED from Pathfolio
1. **Dark cosmic space void**: Completely eliminated `#0B0D12` / `#0B0E14` black background. Replaced with Warm Archival Porcelain (`#F8F7F4` light default) and Deep Spruce/Forest Slate (`#0A1210` dark).
2. **Neon orange/amber glow & auroras**: Removed `--accent-glow: rgba(224, 109, 68, 0.35)` and atmospheric aurora gradient drift. Replaced with Alpine Verdigris (`#0F4D3F`) and Architectural Chamois/Brass (`#B87333`).
3. **Drifting star particles & spider-web filaments**: Removed canvas-driven particle constellation and elastic distance lines. Replaced with horizontal architectural guide rails with solid warm brass index beads (`#D4AF37`) and precision drafting grid rules.
4. **Floating code tags**: Removed floating technical labels in the background canvas.
5. **Terminal / mock IDE window hero**: Removed red/amber/green window dots, pseudo-terminal logs (`pathfolio@local:~$`), and developer observability framing. Replaced with an authentic 3D tactile candidate career dossier folder with underlay sheets.
6. **Tactile telemetry / military tropes**: Removed telemetry slash dividers (`CLIENT STORAGE / REMOTE TRACKING / BACKUP FORMAT`), `LOCAL_V1` radar badges, and devops telemetry styling.

### Pathfolio's New Distinct Choices (Private Career Workspace)
- **Visual Metaphor**: **The Kinetic Career Dossier & Architectural Milestone System**. An architectural, tangible personal workspace engineered for high-agency candidates. Fine archival paper surfaces, embossed dossier folders, tactile milestone tab indexing, and purposeful scroll-driven physical transitions.
- **Palette & Materials**:
  - Primary Ground (Light Mode default): Warm linen / architectural porcelain (`#F8F7F4`), soft recessed tray (`#F0EDE6`), crisp archival white card surfaces (`#FFFFFF`).
  - Deep Dossier (Dark Mode): Architect's deep-forest night studio (`#0A1210`), deep spruce card surfaces (`#121C18`), structural borders (`#1F332C`).
  - Signature Accent: **Alpine Verdigris / Confident Evergreen (`#0F4D3F` light, `#2DD4BF` dark)** — conveying permanence, executive polish, and natural growth.
  - Secondary Accent: **Architectural Chamois / Brass (`#B87333` / `#A16207`)** — highlighting active milestone dates and STAR evidence tags.
  - Structural Ink: Deep warm charcoal (`#16171A`), secondary warm graphite (`#525760`), muted stone (`#808693`).
- **Typography System (Self-Hosted)**:
  - Display / Headings: `Fraunces` (600, 700) — editorial authority, high typographic craft, bespoke career portfolio personality.
  - Body & UI: `Plus Jakarta Sans` (400, 500, 600, 700) — airy, modern, clean geometric clarity.
  - Tabular / Monospace: `JetBrains Mono` (400, 500) — technical precision for timestamps, STAR metrics, and schema inspection.
  - Reliable local font loading from `/fonts/` with zero external network font requests.
- **Hero Composition**:
  - Asymmetric 12-column editorial grid (`1.15fr 0.85fr`).
  - Left Briefing Column: Distinctive status badge (*"Private Career Command Center • Local Storage Only"*), editorial `Fraunces` headline (*"The Sovereign Career Dossier for High-Agency Engineers"*), concise value proposition, action buttons (*"Launch Web App (v1.0.1)"*, *"Download Android APK"*, *"Explore Runway ↓"*), and live proof ledger.
  - Right Dossier Column: **The 3D Layered Career Dossier Object** (`#hero-dossier-card`) with physical underlay sheets (`.dossier-underlay-sheet-1`, `.dossier-underlay-sheet-2`), 3D perspective scroll tilt parallax, candidate profile (*"Maya Lin — Staff Distributed Systems Engineer"*), and live milestone tab bar.

---

## 2. Layered Living Environment

1. **Layer 1: Architectural Paper Texture & Drafting Grid**:
   - Subtle tactile background with hairline drafting grid rules (32px grid in light mode, 140px × 36px ledger rules in dark mode).
   - Architectural registration marks at section corners providing tangible workspace depth.
2. **Layer 2: The Kinetic Milestone Ledger Canvas (`#dossier-canvas`)**:
   - Subtle geometric coordinate lines with moving milestone velocity pulses.
   - Smooth horizontal career guide rails across the viewport with gentle, flowing milestone pips (moving at 18px/s with silky easing).
   - Strictly throttled at 60fps via `requestAnimationFrame`, pauses when hidden or out of view, and honors `prefers-reduced-motion: reduce`.
3. **Layer 3: Structural Content Layer**:
   - Clean porcelain cards with crisp 1px borders (`#E4DFD7`) and subtle multi-layered physical shadows (`0 2px 8px rgba(0,0,0,0.03), 0 12px 28px rgba(0,0,0,0.05)`).

---

## 3. Staged Hero Sequence

- **Phase 0 (0.0s)**: Architectural grid and background canvas initialize; text rendered immediately with fallback fonts before webfont swap.
- **Phase 1 (0.2s - 0.5s)**: Dossier status seal and badge fade in (*"Private Career Command Center • Local Storage Only"*).
- **Phase 2 (0.4s - 0.8s)**: Editorial headline fades and rises smoothly into place with `Fraunces` letterform rendering.
- **Phase 3 (0.7s - 1.1s)**: Executive lead copy and action button group transition smoothly into place.
- **Phase 4 (0.9s - 1.6s & continuous)**: The 3D Layered Dossier reveals its interactive milestone tabs, active candidate profile, and scroll parallax tilt.

---

## 4. Scroll Narrative: Three Large Physical Chapters

Pathfolio features THREE large, distinct scroll-driven narrative chapters using actual scroll position, measured computed style transforms, and verified before/after deltas:

### Chapter 1: The Milestone Pipeline Runway (`#chapter-pipeline` / `#milestones`)
- **Visual Concept**: The multi-stage application journey physically progressing along an architectural runway track.
- **Scroll Transform Choreography**:
  - As the user scrolls into and through the chapter ($p \in [0, 1]$), the progress rail carriage (`#pipeline-rail-carriage`) translates along the physical track:
    $$\text{translateX} = p \times (\text{trackWidth} - \text{carriageWidth})$$
    Measured delta: $x = 258\text{px} \rightarrow 787\text{px}$.
  - The runway progress track (`#pipeline-scroll-bar`) physically grows via 2D scale transform:
    $$\text{transform: scaleX}(0.15 + p \times 0.85)$$
    Measured delta: $\text{scaleX} = 0.243 \rightarrow 0.741$.
  - The live telemetry badge (`#pipeline-live-telemetry`) synchronizes with the active station:
    Measured delta: `ACTIVE: 02 // APPLIED TRACKING` $\rightarrow$ `ACTIVE: 05 // WRITTEN OFFER`.
- **Interactive Component**: Tactile stage tabs (*Saved → Applied → Screening → Technical Loop → Executive Offer*). Clicking a stage switches the live dossier view: shows realistic days-in-stage metrics, recruiter coordination logs, and interview prep checklists.

### Chapter 2: The STAR Evidence Assembly Deck (`#chapter-evidence` / `#star-matrix`)
- **Visual Concept**: Structured interview talking points (Situation, Task, Action, Result) floating detached in space and physically converging/assembling into an indexed interview proof sheet.
- **Scroll Transform Choreography**:
  - The four STAR fragment cards (`#star-frag-situation`, `#star-frag-task`, `#star-frag-action`, `#star-frag-result`) enter in an exploded, detached state:
    $$\text{dist} = 60 \times (1 - p)$$
    $$\text{fragS: translate}(-0.9\text{dist}, 0.45\text{dist}) \text{ rotate}(-(1-p)\times 5^\circ)$$
    $$\text{fragT: translate}(0.9\text{dist}, -0.45\text{dist}) \text{ rotate}((1-p)\times 4^\circ)$$
    $$\text{fragA: translate}(-0.8\text{dist}, -0.4\text{dist}) \text{ rotate}((1-p)\times 3^\circ)$$
    $$\text{fragR: translate}(0.8\text{dist}, 0.5\text{dist}) \text{ rotate}(-(1-p)\times 4^\circ)$$
    Measured delta on `#star-frag-situation`:
    $\text{transform} = \text{matrix}(0.9967, -0.0801, 0.0801, 0.9967, -46, 23), \text{opacity} = 0.58 \rightarrow \text{matrix}(0.9999, -0.0122, 0.0122, 0.9999, -7, 4), \text{opacity} = 0.93$.
  - Central verification seal (`#star-assembly-seal`) stamps down into place as fragments align:
    $$\text{sealScale} = 0.3 + p \times 0.7, \quad \text{sealOpacity} = \text{clamp}((p - 0.2) / 0.7, 0, 1)$$
    Measured delta: $\text{scale} = 0.388 \rightarrow 0.908, \text{opacity} = 0.0 \rightarrow 0.80$.
- **Interactive Component**: Skill domain filter tabs (*Systems & Scale, Performance & Reliability, Security & Vault, Frontend Architecture*). Selecting a filter dynamically populates the evidence card with production-grade achievements, including an interactive *"Attach to Application"* demonstration.

### Chapter 3: Sovereign Dossier Folding & Sealing (`#chapter-vault` / `#privacy-vault`)
- **Visual Concept**: A physical, archival dossier packet being sealed shut with hot brass wax stamping down, while the local JSON schema drawer slides open to prove device-only data ownership.
- **Scroll Transform Choreography**:
  - The 3D envelope flap (`#vault-envelope-flap`) folds shut in true 3D perspective:
    $$\text{flapAngle} = -100 + p \times 85 \quad (\text{deg}), \quad \text{flapOpacity} = 0.6 + p \times 0.4$$
    Measured delta: $\text{rotateX} = -74.0^\circ (\text{opacity } 0.71) \rightarrow -23.0^\circ (\text{opacity } 0.91)$.
  - The hot brass wax seal (`#vault-wax-seal`) presses down from above:
    $$\text{sealY} = -50 \times (1 - p) \quad (\text{px}), \quad \text{sealScale} = 0.5 + p \times 0.5$$
    Measured delta: $\text{translateY} = -44\text{px} \rightarrow -14\text{px}, \text{scale} = 0.61 \rightarrow 0.88, \text{opacity} = 0.02 \rightarrow 0.69$.
  - The schema code drawer (`#vault-code-drawer`) slides smoothly into position:
    $$\text{drawerY} = 50 \times (1 - p) \quad (\text{px})$$
    Measured delta: $\text{translateY} = 44\text{px} \rightarrow 14\text{px}$.
- **Interactive Component**: Live **Schema v1 JSON Inspector & Export Generator**. Visitors can inspect a real, formatted Pathfolio backup payload and click *"Download Sample Backup (JSON)"* to generate a genuine v1 schema backup file that can be immediately imported into the live web or Android app.

---

## 5. Universal Route Consistency & Typography

- **Shared Navigation Bar**:
  - Consistent across `/`, `/guide.html`, and `/privacy.html`.
  - Brand seal with architectural "P" monogram and version tag.
  - Section navigation targets: `Dossier`, `Milestone Runway`, `STAR Assembly`, `Storage Vault`, `App Tour`, `Strategy Guide`, `Privacy Policy`.
  - Universal theme switcher with smooth SVG sun/moon icon transition.
  - Mobile slide-out drawer navigation for viewports under 768px, positioned outside the sticky header containing block to guarantee 100% link visibility and full viewport height scrolling.
- **Shared Footer**:
  - Consistent architectural layout with product mission, quick route links, GitHub repository, and MIT license citation.
- **Typography Matrix**:
  - Display: `Fraunces` (600, 700) for all main headings (`h1`, `h2`, `h3`).
  - Body: `Plus Jakarta Sans` (400, 500, 600, 700) for all paragraphs, lists, buttons, and navigation.
  - Mono: `JetBrains Mono` (400, 500) for badges, metrics, dates, code blocks, and schema payloads.
- **Reading Routes (`/guide.html` & `/privacy.html`)**:
  - Eliminate all ad-hoc inline styles.
  - Calmer, focused editorial reading layout (`max-width: 780px`, line-height `1.7`, generous paragraph rhythm).
  - Elegant section index rail and structured callout panels.
  - Shared styling tokens (`--bg`, `--surface`, `--surface-border`, `--ink-primary`, `--accent`).
- **Flutter Web App (`/app/`)**:
  - Updated theme tokens matching the Alpine Verdigris & Warm Porcelain identity.
  - Primary accent `#0F4D3F`, dark accent `#2DD4BF`, warm porcelain background `#FAF8F5`, white surface `#FFFFFF`.
  - Bundled SIL Open Font License `Plus Jakarta Sans` and `Fraunces` TTFs in `app/assets/fonts/` ensuring identical rendering on Android and Web.

---

## 6. Accessibility & Reduced Motion

- **`prefers-reduced-motion: reduce`**:
  - Halts background canvas animation loop immediately.
  - Renders a clean, high-contrast static architectural drafting grid.
  - Clamps all CSS transitions and animations: `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;`.
  - Forces scroll-driven elements into static assembled positions:
    - `.pipeline-scroll-bar { transform: scaleX(1) !important; }`
    - `.pipeline-rail-carriage { transform: translateX(0) !important; }`
    - `.star-fragment { transform: none !important; opacity: 1 !important; }`
    - `.star-assembly-seal { transform: scale(1) rotate(0deg) !important; opacity: 1 !important; }`
    - `.vault-envelope-flap { transform: none !important; opacity: 1 !important; }`
    - `.vault-wax-seal { transform: none !important; opacity: 1 !important; }`
    - `.vault-code-drawer { transform: none !important; opacity: 1 !important; }`
    - `.dossier-card { transform: none !important; }`
  - Preserves all interactive controls and complete content readability.
- **Keyboard & Screen Reader Support**:
  - Visible 2px high-contrast focus rings (`outline: 2px solid var(--accent); outline-offset: 2px`).
  - Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - Proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`, `role="region"`).
- **Responsive Overflow Guard**:
  - Evaluated and verified across 1440px desktop, 1024px tablet, 768px small tablet, 390px mobile, and 320px narrow mobile.
  - Exact `scrollWidth === innerWidth` on all viewports (`hasHorizontalOverflow: false`).

---

## 7. Automated Motion & Visual Verification Gate (`test-scroll-gate.js`)

The project includes an automated Playwright verification gate running portably from a clean clone:

1. **Dual-Viewport Scroll Motion Assertions**:
   - **Desktop (1440x900)**: Measures computed transforms and opacities across Chapter 1 (runway carriage & bar), Chapter 2 (STAR fragment assembly & seal), and Chapter 3 (envelope flap 3D fold & wax seal stamp).
   - **Phone (390x844)**: Measures the exact same three chapters with before/after scroll pairs, asserting non-zero physical transform deltas and opacities (e.g. carriage transit $45\text{px} \rightarrow 164\text{px}$, fragment opacity $0.56 \rightarrow 0.86$, wax seal press). Captures screenshot pairs for each chapter.
   - Any absent or static delta strictly fails the test with non-zero exit code.
2. **Reduced-Motion Static Readability Assertion**:
   - Evaluated at both desktop (1440px) and phone (390px) viewports under `prefers-reduced-motion: reduce`.
   - Asserts all chapter elements have `opacity >= 0.95`, `display !== 'none'`, `visibility !== 'hidden'`, rendered bounding box dimensions $> 0$, and no collapsing clip-paths.
3. **Flutter Web View & Canvas Integrity Assertion**:
   - Navigates to `/app/` with active `pageerror` and failed network request monitors.
   - Asserts mounted `<flutter-view>`, `<flt-glass-pane>`, and active `<canvas>`.
   - Asserts rendered canvas pixel data $> 200\text{ KB}$ (`dataUrlLength`), confirming that Flutter has painted the complete interactive UI rather than an empty blank canvas.
4. **Deterministic Clean-Clone Execution**:
   - Configured with `package.json` and tracked `package-lock.json`.
   - Installable via `npm ci` with automated cross-platform browser discovery (`channel: 'chrome'` / `channel: 'msedge'`).
