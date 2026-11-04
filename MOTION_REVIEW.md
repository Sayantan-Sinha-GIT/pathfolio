# Pathfolio — Website Cinematic Motion & Visual Overhaul Review (Section 4A)

## Visual World Direction & Audit
- **Visual World**: **The Kinetic Career Dossier & Architectural Milestone System**.
- **Audit Against CodeSense (Motifs Explicitly Removed)**:
  1. *Removed Black Cosmic Void*: Replaced `#0B0D12` / `#0B0E14` space background with Warm Porcelain / Archival Linen (`#F8F7F4` light default, `#0A1210` deep-forest slate dark).
  2. *Removed Neon Orange/Amber Cosmic Filaments*: Replaced glowing orange `--accent-glow` and drifting aurora clouds with Alpine Verdigris (`#0F4D3F` light, `#2DD4BF` dark) and Architectural Brass (`#B87333`).
  3. *Removed Floating Star Particles & Distance Spider-Webs*: Replaced cosmic particle swarm with horizontal Milestone Rails, precision ledger ticks, and registration marks.
  4. *Removed Terminal / Mock IDE Window*: Replaced red/amber/green window dots and `pathfolio@local:~$` logs with an authentic tactile 3D candidate portfolio dossier card (*"Maya Lin — Staff Distributed Systems Engineer"*).
  5. *Removed Telemetric / Military Jargon*: Replaced telemetry slash dividers and radar badges with high-agency career workspace terminology.
- **Typography System (Self-Hosted)**:
  - Display / Headings: `Fraunces` (600, 700) self-hosted woff2.
  - Body & UI: `Plus Jakarta Sans` (400, 500, 600, 700) self-hosted woff2.
  - Monospace / Data: `JetBrains Mono` (400, 500) self-hosted woff2.
- **Surfaces Evaluated**:
  - Marketing Landing Page (`/`)
  - User Strategy Guide (`/guide.html`)
  - Privacy Policy & Storage Architecture (`/privacy.html`)
  - Flutter Web Application (`/app/`)

---

## Automated Playwright Scroll Gate Verification Matrix

The automated browser gate (`test-scroll-gate.js`) was executed across both local (`http://127.0.0.1:8085`) and remote production (`https://pathfolio.pages.dev`). The results below document the verified computed deltas:

| Test Parameter | Local Measurement (`127.0.0.1:8085`) | Remote Measurement (`pathfolio.pages.dev`) | Target Requirement | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Dossier Tilt (Initial $\rightarrow$ Scrolled)** | `matrix3d(0.992, 0, 0.121, ...)` $\rightarrow$ `matrix3d(0.971, 0, 0.050, ...)` | `matrix3d(0.992, 0, 0.121, ...)` $\rightarrow$ `matrix3d(0.971, 0, 0.050, ...)` | Non-zero parallax 3D transform delta | PASSED |
| **Chapter 1: Carriage Transform** | $x = 258\text{px} \rightarrow 787\text{px}$ ($\Delta = +529\text{px}$) | $x = 258\text{px} \rightarrow 787\text{px}$ ($\Delta = +529\text{px}$) | Physical horizontal track advance | PASSED |
| **Chapter 1: Runway Progress Bar** | $\text{scaleX}: 0.243 \rightarrow 0.741$ ($\Delta = +0.498$) | $\text{scaleX}: 0.243 \rightarrow 0.741$ ($\Delta = +0.498$) | Physical progress bar expansion | PASSED |
| **Chapter 1: Live Telemetry** | `02 // APPLIED TRACKING` $\rightarrow$ `05 // WRITTEN OFFER` | `02 // APPLIED TRACKING` $\rightarrow$ `05 // WRITTEN OFFER` | Active stage telemetry sync | PASSED |
| **Chapter 2: Fragment S Transform** | `matrix(0.996, -0.080, ...)` $\rightarrow$ `matrix(0.999, -0.012, ...)` | `matrix(0.996, -0.080, ...)` $\rightarrow$ `matrix(0.999, -0.012, ...)` | Physical fragment assembly convergence | PASSED |
| **Chapter 2: Fragment S Opacity** | $0.58 \rightarrow 0.93$ ($\Delta = +0.35$) | $0.58 \rightarrow 0.93$ ($\Delta = +0.35$) | Fade-in during assembly | PASSED |
| **Chapter 2: Verification Seal Scale** | $0.388 \rightarrow 0.908$ ($\Delta = +0.520$) | $0.388 \rightarrow 0.908$ ($\Delta = +0.520$) | Stamping physical seal delta | PASSED |
| **Chapter 2: Verification Seal Opacity** | $0.00 \rightarrow 0.80$ ($\Delta = +0.80$) | $0.00 \rightarrow 0.80$ ($\Delta = +0.80$) | Stamping opacity delta | PASSED |
| **Chapter 3: Envelope Flap 3D Angle** | $\text{rotateX}: -74.0^\circ \rightarrow -23.0^\circ$ ($\Delta = +51.0^\circ$) | $\text{rotateX}: -74.0^\circ \rightarrow -23.0^\circ$ ($\Delta = +51.0^\circ$) | 3D envelope fold shut | PASSED |
| **Chapter 3: Envelope Flap Opacity** | $0.71 \rightarrow 0.91$ ($\Delta = +0.20$) | $0.71 \rightarrow 0.91$ ($\Delta = +0.20$) | Flap opacity delta | PASSED |
| **Chapter 3: Wax Seal Transform** | $\text{scale}: 0.61, y: -44\text{px} \rightarrow \text{scale}: 0.88, y: -14\text{px}$ | $\text{scale}: 0.61, y: -44\text{px} \rightarrow \text{scale}: 0.88, y: -14\text{px}$ | Wax seal stamping down | PASSED |
| **Chapter 3: Wax Seal Opacity** | $0.02 \rightarrow 0.69$ ($\Delta = +0.67$) | $0.02 \rightarrow 0.69$ ($\Delta = +0.67$) | Wax seal appearance | PASSED |
| **Chapter 3: Code Drawer Transform** | $y = 44\text{px} \rightarrow 14\text{px}$ ($\Delta = -30\text{px}$) | $y = 44\text{px} \rightarrow 14\text{px}$ ($\Delta = -30\text{px}$) | Drawer sliding open | PASSED |
| **Sticky Heading Clearance** | Target rect tops cleared $> 72\text{px}$ header | Target rect tops cleared $> 72\text{px}$ header | No sticky header overlap | PASSED |
| **Reduced Motion Fallback** | `scaleX(1)`, fragments static, opacity 1 | `scaleX(1)`, fragments static, opacity 1 | High-contrast static state | PASSED |
| **Theme Toggle** | `data-theme="dark"` (Deep Spruce Slate) | `data-theme="dark"` (Deep Spruce Slate) | Distinctive deep-forest palette | PASSED |
| **Mobile 390px Containment** | `innerWidth: 390, scrollWidth: 390, ov: false` | `innerWidth: 390, scrollWidth: 390, ov: false` | Zero horizontal overflow | PASSED |
| **Mobile Drawer Navigation** | 9 targets visible, height 780px, open true | 9 targets visible, height 780px, open true | All links accessible | PASSED |
| **Tablet 1024px Containment** | `innerWidth: 1024, scrollWidth: 1024, ov: false` | `innerWidth: 1024, scrollWidth: 1024, ov: false` | Zero horizontal overflow | PASSED |
| **Narrow Mobile 320px Containment** | `innerWidth: 320, scrollWidth: 320, ov: false` | `innerWidth: 320, scrollWidth: 320, ov: false` | Zero horizontal overflow | PASSED |
| **Linked Routes (`/guide`, `/privacy`, `/app`)** | All 3 loaded with valid titles and 200 OK | All 3 loaded with valid titles and 200 OK | Unbroken route navigation | PASSED |

---

## Six-Round Evidence-Based Visual & Motion Ledger

### Round 1 — Visual World Identity & Removal of Cosmic Copying
- **Inspected**: Viewport 1440×900 desktop; initial load and environment rendering at t0 and t1.5s.
- **Observed Evidence**:
  - Live inspection confirms complete departure from CodeSense's cosmic graph.
  - Ground surface renders warm architectural porcelain (`#F8F7F4` light default, `#0A1210` deep-forest slate in dark mode).
  - Asymmetric 12-column hero composition (`1.15fr 0.85fr`) balances an executive briefing on the left with a 3D layered dossier on the right.
  - Zero orange filaments, zero floating cosmic particle swarms, zero terminal window dots.
  - Computed font inspection confirms `Fraunces` loaded for headings and `Plus Jakarta Sans` for body text.
- **Screenshots Captured**: `screenshots/local-desktop-1440-t0.png`, `screenshots/local-desktop-1440-t1.5.png`.
- **Status**: PASSED.

### Round 2 — Self-Hosted Typography & Computed Hierarchy
- **Inspected**: Browser computed styles and `document.fonts` across all heading and body elements.
- **Observed Evidence**:
  - `document.fonts` inspection in Chrome DevTools returned 8 loaded fonts:
    - `Fraunces` (weights 600, 700): `status: "loaded"`
    - `Plus Jakarta Sans` (weights 400, 500, 600, 700): `status: "loaded"`
    - `JetBrains Mono` (weights 400, 500): `status: "loaded"`
  - `h1` computed font: `Fraunces, Newsreader, Charter, Georgia, serif` (57.6px desktop, 34.4px mobile).
  - Body computed font: `"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
  - Badges and code computed font: `"JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace`.
  - Zero external Google Fonts network calls; 100% served locally from `/fonts/`.
- **Status**: PASSED.

### Round 3 — Chapter 1: The Milestone Pipeline Runway
- **Inspected**: Scroll behavior and physical carriage translation along `#chapter-pipeline` track.
- **Observed Evidence**:
  - As the user scrolls through the chapter, `#pipeline-scroll-bar` scales continuously from `scaleX: 0.243` to `scaleX: 0.741`.
  - The `#pipeline-rail-carriage` moves along the physical runway track from `translateX(258px)` to `translateX(787px)`.
  - Telemetry badge updates synchronously with active milestone: `02 // APPLIED TRACKING` $\rightarrow$ `05 // WRITTEN OFFER`.
  - Clicking station nodes `01` to `06` allows direct jumping across stages with smooth CSS transitions.
- **Screenshots Captured**: `screenshots/local-chapter1-before.png`, `screenshots/local-chapter1-after.png`.
- **Status**: PASSED.

### Round 4 — Chapter 2: STAR Evidence Assembly Deck
- **Inspected**: Physical convergence of detached STAR fragments into an aligned proof sheet.
- **Observed Evidence**:
  - At chapter entry, the four STAR fragment cards (`#star-frag-situation`, `#star-frag-task`, `#star-frag-action`, `#star-frag-result`) enter exploded and detached.
  - Scrolling through the chapter brings them into precise physical alignment (`matrix(0.996, -0.080, ...)` $\rightarrow$ `matrix(0.999, -0.012, ...)`, opacity $0.58 \rightarrow 0.93$).
  - The central brass verification seal (`#star-assembly-seal`) stamps down into place as the sheet completes ($\text{scale } 0.388 \rightarrow 0.908$, $\text{opacity } 0.00 \rightarrow 0.80$).
  - Interactive skill domain filter tabs (*Systems & Scale, Performance & Reliability, Security & Vault, Frontend Architecture*) dynamically update content and talking points.
- **Screenshots Captured**: `screenshots/local-chapter2-before.png`, `screenshots/local-chapter2-after.png`.
- **Status**: PASSED.

### Round 5 — Chapter 3: Sovereign Dossier Folding & Sealing
- **Inspected**: 3D envelope folding, hot wax seal pressing, and schema JSON drawer sliding.
- **Observed Evidence**:
  - The 3D envelope flap (`#vault-envelope-flap`) folds shut along its top hinge from $\text{rotateX } -74.0^\circ$ to $-23.0^\circ$ ($\text{opacity } 0.71 \rightarrow 0.91$).
  - The hot brass wax seal (`#vault-wax-seal`) presses down from above ($\text{translateY } -44\text{px} \rightarrow -14\text{px}$, $\text{scale } 0.61 \rightarrow 0.88$, $\text{opacity } 0.02 \rightarrow 0.69$).
  - The schema code drawer (`#vault-code-drawer`) slides into view ($\text{translateY } 44\text{px} \rightarrow 14\text{px}$).
  - Schema v1 JSON Inspector renders live validated JSON; clicking `Download Sample Backup (JSON)` downloads a production-compatible `pathfolio-backup-v1-sample.json`.
- **Screenshots Captured**: `screenshots/local-chapter3-before.png`, `screenshots/local-chapter3-after.png`.
- **Status**: PASSED.

### Round 6 — Responsive Breakpoints, Ergonomics & Cross-Route Matrix
- **Inspected**: Viewports 1440×900, 1024×768, 768×1024, 390×844, 320×600; routes `/`, `/guide.html`, `/privacy.html`, `/app/`.
- **Observed Evidence**:
  - 390px Mobile Viewport:
    - Zero horizontal overflow: `scrollWidth: 390px == innerWidth: 390px` (`hasHorizontalOverflow: false`).
    - Mobile menu drawer positioned at body root; opens smoothly (`aria-expanded="true"`), listing 9 navigation targets across full 780px viewport height with comfortable touch targets (>44px).
  - 1024px Tablet & 320px Narrow Mobile:
    - Zero horizontal overflow: `overflow: false` across all tested breakpoints.
    - Buttons wrap text safely without clipping; responsive container paddings.
  - Cross-Route Cohesion:
    - Unified header, brand monogram, theme toggle, and footer layout across `/`, `/guide.html`, and `/privacy.html`.
    - Theme switching persists seamlessly via `localStorage` (`pathfolio-theme`).
    - Reduced motion fallback sets `transform: none !important; opacity: 1 !important;` with static drafting grid.
    - Flutter web app (`/app/`) booted and rendered with matching Alpine Verdigris and Warm Porcelain tokens.
- **Screenshots Captured**: `screenshots/local-mobile-390-hero.png`, `screenshots/local-mobile-390-menu-open.png`, `screenshots/local-tablet-1024.png`, `screenshots/local-narrow-320.png`, `screenshots/local-desktop-reduced-motion.png`, `screenshots/local-desktop-theme-toggle.png`, `screenshots/local-page-guide.png`, `screenshots/local-page-privacy.png`, `screenshots/local-page-app.png`.
- **Status**: PASSED.

---

## Concrete Differentiation Analysis: Pathfolio Dark Dossier vs. CodeSense (1440×900 Equal-Width Comparison)

| Design Dimension | CodeSense (`https://pr-reviewer-omega-liard.vercel.app`) | Pathfolio Deep-Forest Dossier (`https://pathfolio.pages.dev`) | Concrete Distinction Proof |
| :--- | :--- | :--- | :--- |
| **Atmospheric Base & Surface** | Cold, pitch-black cosmic void (`#0B0D12` / `#08090C`) with a glowing orange interstellar gas nebula. | Rich, deep botanical evergreen slate (`#0A1210` / `rgb(10, 18, 16)`) with deep spruce card surface (`#121C18`). | Completely different color temperature; Pathfolio uses organic spruce slate rather than cybernetic black void. |
| **Background Structural Motif** | 3D orbital rings, curved elliptical filaments, and a perspective wireframe coordinate grid. | Lined ledger folio rules (140px × 36px horizontal ledger lines) with subtle warm brass alignment corner crosses. | Pathfolio evokes an architect's desk or heritage ledger pad; zero orbital rings or wireframes. |
| **Motion & Particles** | Free-floating 3D particle constellation with bokeh distance blur and floating code filenames (`src/pricing.js`, `createOrder()`). | 4 horizontal architectural guide rails with solid warm brass index beads (`#D4AF37`) and hairline ruler ticks. Zero floating code labels. | Pathfolio replaces random starfields with structured, horizontal milestone ledger tracks. Zero floating text snippets. |
| **Layout & Hierarchy** | Asymmetric left-aligned headline with curved orange brushstroke underline; floating card anchored bottom-right. | Asymmetric 12-column editorial grid (`1.15fr 0.85fr`) pairing an executive briefing in `Fraunces` serif with a 3D layered Career Dossier object with underlay sheets. | Physical archival desk metaphor vs. asymmetric cosmic terminal split. |
| **Scroll Narrative** | Continuous drifting particles and standard page scroll. | THREE distinct physical scroll chapters: physical pipeline runway carriage advance, physical STAR fragment assembly, and 3D envelope fold + wax seal stamping. | Measurable computed transform deltas linked directly to scroll progress ($p$). |
| **Interactive Focal Point** | Static screenshot PR comment tooltip (`codesense-pr # Bug`). | Dynamic milestone scrubber with stage progression (`Saved` → `Applied` → `Screening` → `Interview` → `Offer` → `Rejected`), candidate role cycling, and real timeline logs. | Real interactive state machine with tactile buttons and tab switching. |
| **Glow & Lighting Effects** | Intense radial orange neon glow (`--accent-glow: rgba(224, 109, 68, 0.35)`) and glowing cyan/amber nodes. | Zero neon glow; crisp 1px tactile borders (`#1F332C`), warm archival ivory typography (`#EDEBE6`), and soft bookbinder brass accents. | Matte, tactile, physical paper/bookbinding craft without sci-fi energy halos. |
| **Reduced Motion Fallback** | Orbiting nodes freeze or hide. | Canvas transitions immediately to static hairline ledger rules; all CSS transforms/transitions clamped to 0.01ms; narrative chapters locked in readable assembled state. | Complete static readability guaranteed. |
