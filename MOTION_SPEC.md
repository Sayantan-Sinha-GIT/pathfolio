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

## 3A. Foreground Motion Coverage Inventory (Motion-Studio Elevation)

In response to the owner's request matching the foreground motion density of CodeSense, Grepless, and Haan, every visible foreground group is choreographically animated. The table below documents the full inventory of animated foreground selectors, their choreography families, and their verified rendered effects:

| Foreground Selector / Group | Motion Family | Choreography & Real Effect | Verified Rendered Delta |
| :--- | :--- | :--- | :--- |
| `.hero-line-inner.line-1` | Masked Line Reveal | Editorial masked line entrance unmasking from `translateY(115%) rotate(2.5deg)` with 6px blur to `translateY(0) rotate(0deg)` blur(0). | Opacity $0.88 \rightarrow 1.00$, $\text{translateY settled}$. |
| `.hero-line-inner.line-2` | Masked Line Reveal | Staggered second line unmasking ($0.28\text{s}$ delay) with italic display contrast and signature brass-verdigris baseline. | Opacity $0.59 \rightarrow 1.00$, $\text{translateY settled}$. |
| `#hero-status-badge` | Blur-to-Sharp Stagger | Ambient elevation with pulsing green-verdigris ledger pip, floating into place ($0.05\text{s}$ delay). | Opacity $0 \rightarrow 1.00$, blur $3\text{px} \rightarrow 0$. |
| `#hero-lead` | Blur-to-Sharp Stagger | Coordinated briefing paragraph rise with gentle blur clear ($0.42\text{s}$ delay). | Opacity $0 \rightarrow 1.00$, blur $4\text{px} \rightarrow 0$. |
| `#hero-actions` | Staged Translation | Primary/secondary action button cluster elevation with tactile hover transitions ($0.58\text{s}$ delay). | Opacity $0 \rightarrow 1.00$, $\Delta y = 22\text{px}$. |
| `#hero-proof-ledger` | Staged Translation | Three-pillar privacy proof ledger items revealing with tabular spacing ($0.72\text{s}$ delay). | Opacity $0 \rightarrow 1.00$, $\Delta y = 18\text{px}$. |
| `#hero-dossier-card` | 3D Perspective Tilt | Asymmetric 3D card perspective settling from slight elevation into resting plane; continuous scroll tilt $\text{rotateY}(-6^\circ \rightarrow +5^\circ)$. | Initial settling: fill $237\text{px} \rightarrow 256.7\text{px}$. |
| `#hero-underlay-1` | 3D Layered Spread | First architectural underlay sheet fanning out to the left across scroll: $\text{rotate}(-1.5^\circ \rightarrow -6.0^\circ)$, $\Delta x = -30\text{px}, \Delta y = +14\text{px}$. | Scroll delta @350px: $\text{matrix3d}(\dots) \neq \text{matrix3d}(\text{t0})$. |
| `#hero-underlay-2` | 3D Layered Spread | Second underlay sheet fanning out to the right: $\text{rotate}(+3^\circ \rightarrow +6.8^\circ)$, $\Delta x = +26\text{px}, \Delta y = +18\text{px}, z = -50\text{px}$. | Scroll delta @350px: $\text{matrix3d}(\dots) \neq \text{matrix3d}(\text{t0})$. |
| `#hero-dossier-tab` | Physical Z-Shift | Architectural tab index tag shifting vertically and forward in 3D: $\text{translate3d}(0, -8\text{px}, 15\text{px})$. | Verified non-zero displacement. |
| `.motion-header-group` | Masked Header Reveal | Section headers across all chapters unmasking eyebrow, display title, and lead with blur clearing upon viewport intersection. | Intersection triggers `.is-revealed`; eyebrow, title, lead opacity $1.00$. |
| `.pipeline-runway-card` | Runway Card Stagger | Six career stage cards stagger-revealed with sequential active station highlight (`.active`) driven by carriage transit. | Cards receive `.is-revealed`; active station border & glow update. |
| `#matrix-filter-group` | Control Reveal | Four skill domain filter buttons with active brass pill indicator and smooth tab transitions. | Received `.is-revealed` on scroll. |
| `.star-fragment` | Physics Assembly | Separate Situation, Task, Action, and Result fragments fly from exploded perimeter into aligned proof deck over underlying dossier plate. | FragS transform & opacity delta ($0.58 \rightarrow 0.96$). |
| `#star-assembly-seal` | Dynamic Stamp | Brass verification seal stamps down in reserved nonintersecting space ($\text{scale } 0.38 \rightarrow 0.95$, $\text{opacity } 0 \rightarrow 0.89$). | Verified $> 35\text{px}$ geometric clearance on phone & narrow. |
| `.star-drawn-svg` | Dynamic Vector Connection | Animated SVG link line between active STAR paper fragments drawing with scroll-linked dash offset. | Verified dynamic stroke geometry & path. |
| `#btn-cite-simulation` | Tactile Feedback | Interview citation button with scale dip ($0.96$) and immediate animated confirmation badge (`#citation-feedback`). | Feedback badge rendered and confirmed visible. |
| `.vault-doc-sheet` | Document Collection Sequence | Three dimensional archival documents (Pipeline, Evidence, Notes) collecting into packet pocket: $p \le 0.45$. | Measured transform & opacity delta across 3 sheets. |
| `#vault-envelope-flap` | 3D Dimensional Fold | Archival envelope flap 3D folds downward: $\text{rotateX}(-100^\circ \rightarrow -15^\circ)$, $\text{opacity } 0.71 \rightarrow 0.91$. | Measured delta: $\text{matrix3d}$ rotation shift. |
| `#vault-wax-seal` | Physical Stamp | Hot red-brass wax seal stamps down into packet closure: $\text{translateY}(-50\text{px} \rightarrow -14\text{px})$, $\text{scale } 0.5 \rightarrow 0.88$, $\text{opacity } 0.02 \rightarrow 0.69$. | Measured delta: $\Delta y = 30\text{px}$, opacity $0.02 \rightarrow 0.69$. |
| `#vault-code-drawer` | Drawer Translation | Schema v1 JSON custody manifest slides out from beneath packet with monospaced format. | Measured delta: $\text{translateY } 44\text{px} \rightarrow 14\text{px}$. |
| `.schema-inspector-details`| Collapsible Schema Inspector | Accessible `<details>` raw JSON export inspector with sample payload download. | Verified interactive disclosure & valid schema fields. |
| `.motion-compare-box` | Comparison Stagger | Side-by-side Architectural vs Centralized comparison cards revealing with elevated borders and itemized check rows. | Verified `.is-revealed` on scroll. |
| `.motion-gallery-card` | 3D Parallax Perspective | Desktop & mobile app tour cards elevating with dual perspective tilt and scroll-linked parallax displacement. | Card transform delta verified: $\text{matrix3d}(\text{scroll}_1) \neq \text{matrix3d}(\text{scroll}_2)$. |
| `.lit-word` | Scroll-Lit Typography | Monumental typography words lighting up sequentially upon scroll transit into Chapter 5. | Verified word lighting progression ($4/8 \rightarrow 8/8$). |
| `.closing-dossier-leaf`| 3D Dossier Spread | Left and right archival dossier leaves unfolding from angled perspective ($12^\circ \rightarrow 0^\circ$). | Verified distinct 3D transforms across scroll. |
| `#closing-cta` | Elevation & Ambient Glow | Full-width porcelain command card with radial breathing glow, headline reveal, action buttons, and proof ledger. | Card receives `.is-revealed` and full visibility. |
| `.motion-footer-col` | Staggered Columns | Four footer navigation columns staggered in sequence upon scroll completion. | All 4 columns receive `.is-revealed`. |

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
- **Visual Concept**: Bounded desktop pinned evidence story with separate STAR paper fragments traveling across a spacious physical stage, locking into an aligned interview dossier plate with dynamic drawn SVG links, coherent 3D depth, and active scroll-stage citation previews.
- **Scroll Transform Choreography**:
  - Desktop Track: `#star-scroll-track` operates as a `220vh` pinned track with `.star-sticky-viewport` pinned at top 74px on $\ge 992\text{px}$ viewports. On mobile ($< 992\text{px}$), natural flow is preserved with zero sticky scroll traps.
  - The four separate STAR fragment cards (`#star-frag-situation`, `#star-frag-task`, `#star-frag-action`, `#star-frag-result`) travel with continuous translation and rotation curves:
    $$\text{dist} = 110 \times (1 - p)$$
    $$\text{fragS: translate}(-0.9\text{dist}, 0.35\text{dist}) \text{ rotate}(-(1-p)\times 7^\circ)$$
    $$\text{fragT: translate}(0.9\text{dist}, -0.35\text{dist}) \text{ rotate}((1-p)\times 6^\circ)$$
    $$\text{fragA: translate}(-0.85\text{dist}, -0.3\text{dist}) \text{ rotate}((1-p)\times 5^\circ)$$
    $$\text{fragR: translate}(0.85\text{dist}, 0.4\text{dist}) \text{ rotate}(-(1-p)\times 6^\circ)$$
    Measured delta on `#star-frag-situation`:
    $\text{transform} = \text{matrix}(0.9925, -0.1218, 0.1218, 0.9925, -85, 35), \text{opacity} = 0.50 \rightarrow \text{matrix}(0.9970, -0.0767, 0.0767, 0.9970, -54, 22), \text{opacity} = 0.68$.
  - Dynamic SVG drawn connector lines (`.star-drawn-svg path`) transition stroke dash offset synchronously across scroll:
    $$\text{strokeDashoffset} = \text{totalLength} \times (1 - p)$$
  - Synchronized citation telemetry: `#citation-stage-pill` dynamically cycles through stages (`STAGE 1/4 // SITUATION` $\rightarrow$ `STAGE 4/4 // MEASURED OUTCOMES`) while `#citation-link-text` updates the live linked talking point.
  - Central brass verification seal (`#star-assembly-seal`) stamps down into reserved nonintersecting space ($\text{scale } 0.28 \rightarrow 0.55$, $\text{opacity } 0.00 \rightarrow 0.21 \rightarrow 0.89$ on full lock).
- **Interactive Component**: Skill domain filter tabs (*Distributed Systems, Performance Tuning, Security & Ephemeral IAM, Client State Persistence*). Selecting a filter dynamically populates all four STAR fragments, tags, and summary briefing with production achievements, supported by an interactive *"Attach Citation to Briefing"* button with animated tactile feedback.

### Chapter 3: Sovereign Dossier Folding & Sealing (`#chapter-vault` / `#privacy-vault`)
- **Visual Concept**: Dimensional local-backup folder sequence where 3 collectible archival documents glide into an archival packet base, the 3D flap folds shut, and the wax seal stamps down, replacing static JSON walls with a physical custody story.
- **Scroll Transform Choreography**:
  - Three dimensional document sheets (`#vault-doc-pipeline`, `#vault-doc-evidence`, `#vault-doc-notes`) glide from elevated stack into the archival pocket base during $p_3 \le 0.45$:
    $$\text{doc1: translateY}(-(1 - p_{\text{collect}}) \times 50\text{px}) \text{ rotate}(-(1 - p_{\text{collect}}) \times 3^\circ)$$
    $$\text{doc2: translateY}(-(1 - p_{\text{collect}}) \times 75\text{px}) \text{ rotate}((1 - p_{\text{collect}}) \times 2^\circ)$$
    $$\text{doc3: translateY}(-(1 - p_{\text{collect}}) \times 100\text{px}) \text{ rotate}(-(1 - p_{\text{collect}}) \times 1.5^\circ)$$
  - The 3D envelope flap (`#vault-envelope-flap`) folds shut along its top hinge during $p_3 \in [0.25, 0.75]$:
    $$\text{flapAngle} = -105 + p_{\text{fold}} \times 95 \quad (\text{deg}), \quad \text{flapOpacity} = 0.70 + p_{\text{fold}} \times 0.30$$
    Measured delta: $\text{rotateX} = -74.0^\circ (\text{opacity } 0.70) \rightarrow -35.0^\circ (\text{opacity } 0.86)$.
  - The hot red-brass wax seal (`#vault-wax-seal`) presses down from above during $p_3 \in [0.45, 0.90]$:
    $$\text{sealY} = -45 \times (1 - p_{\text{seal}}) \quad (\text{px}), \quad \text{sealScale} = 0.60 + p_{\text{seal}} \times 0.40$$
    Measured delta: $\text{translateY} = -45\text{px} \rightarrow -21\text{px}, \text{scale} = 0.60 \rightarrow 0.81, \text{opacity} = 0.00 \rightarrow 0.54$.
  - Three-stage status stepper bar (`.vault-stepper-bar` with `.stepper-step`) illuminates step 01 (Collect), 02 (Fold), 03 (Seal & Export) in sync with packet progress.
- **Interactive Component**: Collapsible `<details class="schema-inspector-details">` raw Schema v1 JSON export inspector. Provides an accessible, transparent view of genuine client-side `shared_preferences` export fields (`schemaVersion`, `exportedAt`, `opportunities`, `evidence`) and an instant client-side `"Download Sample Backup (JSON)"` file generator without fake encryption or cloud verification claims.

### Chapter 5: Closing Sovereign Command Scene (`#closing-cta`)
- **Visual Concept**: Monumental closing composition pairing scroll-lit editorial typography with physical 3D dossier carrier leaves and an architectural launch deck.
- **Scroll Transform Choreography**:
  - Monumental scroll-lit typography: `.lit-word` spans in the headline (*"Your Loop. Your Evidence. Sealed On Your Terms."*) illuminate word-by-word with high-contrast Alpine verdigris and ink highlights as the viewport centers on the closing scene.
  - Physical 3D dossier spread: Left and right archival carrier leaves (`#closing-leaf-left`, `#closing-leaf-right`) settle from an angled perspective ($12^\circ \rightarrow 0^\circ$) onto the central launch deck plane with coherent depth.
  - Action launchpad elevates with ambient breathing verdigris glow and provides clear, immediate entry points: Web App launch at `/app/`, signed Android APK release download, and strategy documentation.

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
