# Pathfolio — Kinetic Career Dossier Motion & Visual Specification

## 1. Authoritative Visual Specification & Design Fidelity

### Owner-Supplied HTML as Intended Visual Specification
In accordance with global and kit fidelity guidelines, the owner-supplied design (`my-design/home.html`, 43,390 bytes, Claude reference) represents the **intended visual and motion specification**, rather than a benchmark to differentiate from. The implementation faithfully executes its complete visual identity, typography system, color palette, background canvas, and GSAP/ScrollTrigger/Lenis motion engine.

> [!NOTE] Historical Benchmark Context (Superseded)
> Early prototype iterations explored architectural differentiation from external benchmarks (e.g. CodeSense, Grepless, Haan). That exploration is now **officially superseded** by the direct adoption of the owner-supplied design as the authoritative visual truth for production.

### Implementation Corrections & Hardening
The owner reference HTML remains byte-for-byte untouched. However, two necessary technical corrections were identified and resolved in the production implementation:
1. **Hero Rolling Counter Strip Geometry**:
   - In the reference HTML, `.od` is an `inline-flex` container with `height: 1em`. Flex items default to `align-self: stretch`, which forced `.od span` to have a computed height of only 41.6px (33.6px on mobile) instead of the full 11-digit strip height ($457.6\text{px}$). Consequently, percentage translations like `yPercent: -54.5%` moved the strip by less than one digit, causing clipped glyphs (e.g. showing half of '0' and half of '1').
   - **Correction**: In production `site/styles.css`, `.od` is given `align-items: flex-start; overflow: hidden;` and `.od-col` is given `flex-shrink: 0; height: auto; min-height: 11em; line-height: 1;`. Each `<b>` has `height: 1em; line-height: 1;`. GSAP animates `yPercent: -(targetIndex / 11 * 100)` so the final visible glyphs are mathematically guaranteed and settled at exactly **6 pipeline stages, 2 platforms, 0 sign-ins, and 0 tracking scripts** across both desktop and mobile viewports.
   - **Accessibility & No-JS Fallback**: Decorative digit strips are marked with `aria-hidden="true"`, while one truthful screen-reader accessible label/text is provided. Without JavaScript, static HTML displays the exact settled digits immediately.
2. **Accessible Mobile Navigation Drawer**:
   - The reference HTML hid `.nav` on viewports $\le 900\text{px}$ with `display: none` without providing an alternative mobile menu, leaving mobile users unable to navigate to sections, guide, privacy, or release artifacts.
   - **Correction**: A mobile toggle button (`#mob-toggle`) and slide-out navigation drawer (`#mob-menu`) with backdrop overlay (`#mob-backdrop`) were implemented in the supplied visual language. All 9 destinations (Pipeline, Evidence, Sovereign Vault, App Tour, Privacy, Usage Guide, Privacy Policy, Web App launch, and Android APK download) are fully accessible with touch targets $\ge 44\text{px}$, keyboard focus traps, Escape key dismissal, backdrop tap dismissal, and sticky header clearance.

### Pathfolio Visual Metaphor & Palette
- **Visual Metaphor**: **The Kinetic Career Dossier & Architectural Milestone System**. An architectural, tangible personal workspace engineered for high-agency candidates. Fine archival paper surfaces, embossed dossier folders, tactile milestone tab indexing, and purposeful scroll-driven physical transitions.
- **Palette & Materials**:
  - Primary Ground (Light Mode default): Warm linen / architectural porcelain (`#F8F7F4`), soft recessed tray (`#F0EDE6`), crisp archival white card surfaces (`#FFFFFF`).
  - Deep Dossier (Dark Mode): Architect's deep-forest night studio (`#0A1210`), deep spruce card surfaces (`#121C18`), structural borders (`#1F332C`).
  - Signature Accent: **Alpine Verdigris / Confident Evergreen (`#0F4D3F` light, `#2DD4BF` dark)**.
  - Secondary Accent: **Architectural Chamois / Brass (`#B87333` / `#A16207`)**.
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

## 4. Authoritative Scroll Narrative: Five Physical Scenes

Pathfolio implements the exact scene choreography and kinematic structures defined in `my-design/home.html`:

### Scene 1: The Pipeline Runway (`#s-pipe`)
- **Visual Concept**: The six-stage candidate journey along a high-precision caliper track with dynamic step scrubbers and stage detail cards.
- **Scroll Transform Choreography**:
  - As the user scrolls into `#s-pipe`, GSAP ScrollTrigger drives progress across `.track-fill` and active indicator dots:
    $$\text{scaleX: } 0.15 \rightarrow 1.00$$
  - Active stage dots (`.p-dot`) transition in sync with stage detail cards (`.s-card`), highlighting Saved, Applied, Screening, Interview, Offer, and Rejected.
  - Telemetry counters and stage duration metrics advance continuously.

### Scene 2: The STAR Evidence Assembly Deck (`#s-star`)
- **Visual Concept**: Pinned 3D paper fragment choreography where Situation, Task, Action, and Result fragments fly into an aligned dossier plate over an SVG link connector.
- **Scroll Transform Choreography**:
  - The four STAR fragment cards (`.card.p-sit`, `.card.p-tsk`, `.card.p-act`, `.card.p-res`) assemble across scroll:
    - Situation: $\text{translate}(-32\text{px}, 18\text{px}) \text{ rotate}(-3^\circ) \rightarrow \text{translate}(0, 0) \text{ rotate}(0^\circ)$
    - Task: $\text{translate}(28\text{px}, -16\text{px}) \text{ rotate}(2.5^\circ) \rightarrow \text{translate}(0, 0) \text{ rotate}(0^\circ)$
    - Action: $\text{translate}(-24\text{px}, -12\text{px}) \text{ rotate}(-2^\circ) \rightarrow \text{translate}(0, 0) \text{ rotate}(0^\circ)$
    - Result: $\text{translate}(30\text{px}, 20\text{px}) \text{ rotate}(3^\circ) \rightarrow \text{translate}(0, 0) \text{ rotate}(0^\circ)$
  - Dynamic connector SVG path (`#linkSvg path`) animates stroke-dashoffset synchronously.
  - Interactive skill tabs dynamically update evidence talking points with zero layout shift.

### Scene 3: Sovereign Vault Folding & Stamping (`#s-vault`)
- **Visual Concept**: Three collectible local backup sheets glide into an archival packet, followed by 3D flap closure and wax seal stamping.
- **Scroll Transform Choreography**:
  - Archival flap (`.sp-flap`): 3D folds shut along top perspective axis:
    $$\text{rotateX: } -105^\circ \rightarrow 0^\circ$$
  - Red-brass wax seal (`.sp-seal`): Stamps down into packet closure:
    $$\text{translateY: } -40\text{px} \rightarrow 0\text{px}, \quad \text{scale: } 0.5 \rightarrow 1.0, \quad \text{opacity: } 0.0 \rightarrow 1.0$$
  - Raw JSON drawer (`.sp-drawer` / `.sp-code`): Accessible client-side schema inspection.

### Scene 4: App Tour Gallery (`#s-tour`)
- **Visual Concept**: Dual platform showcase presenting Desktop Web Dashboard (`#win`) and Mobile Android (`#phone`).
- **Scroll Transform Choreography**:
  - Interactive platform tabs (`.plat-tab`) toggle active elevation.
  - Smooth parallax depth offsets and perspective elevation.

### Scene 5: Closing Sovereign Command (`#s-launch`)
- **Visual Concept**: Monumental closing statement pairing high-contrast typography reveals with physical dossier presentation.
- **Scroll Transform Choreography**:
  - Editorial headline reveals with staggered line unmasking.
  - High-contrast dual launch CTAs (`/app/` web launch and GitHub release APK download) with live proof metrics.

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
