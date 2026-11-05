# Pathfolio — Website Cinematic Motion & Visual Overhaul Review (Section 4A)

## Visual World Direction & Audit
- **Visual World**: **The Kinetic Career Dossier & Architectural Milestone System**.
- **Audit Against CodeSense (Motifs Explicitly Removed)**:
  1. *Removed Black Cosmic Void*: Replaced `#0B0D12` / `#0B0E14` space background with Warm Porcelain / Archival Linen (`#F8F7F4` light default, `#0A1210` deep-forest slate dark).
  2. *Removed Neon Orange/Amber Cosmic Filaments*: Replaced glowing orange `--accent-glow` and drifting aurora clouds with Alpine Verdigris (`#0F4D3F` light, `#2DD4BF` dark) and Architectural Brass (`#B87333`).
  3. *Removed Floating Star Particles & Distance Spider-Webs*: Replaced cosmic particle swarm with dual-line horizontal architectural guide rails, moving warm brass milestone transport packets with luminous tracer tails, and precision drafting grid rules.
  4. *Removed Terminal / Mock IDE Window*: Replaced red/amber/green window dots and `pathfolio@local:~$` logs with an authentic tactile 3D candidate portfolio dossier card (*"Maya Lin — Staff Distributed Systems Engineer"*) with architectural folder ear tab (`DOSSIER // 2026-ENG-SYSTEMS`).
  5. *Removed Telemetric / Military Jargon & Security Absolutes*: Audited and removed `LOCAL_SANDBOX :: SECURED`, replacing with technically accurate `STORAGE :: CLIENT SANDBOX (v1 SCHEMA)`.
- **Typography System (Self-Hosted)**:
  - Display / Headings: `Fraunces` (600, 700) self-hosted woff2 with commanding scale and italic display contrast (*"Track every loop. Own the evidence."*).
  - Body & UI: `Plus Jakarta Sans` (400, 500, 600, 700) self-hosted woff2.
  - Monospace / Data: `JetBrains Mono` (400, 500) self-hosted woff2.
- **Surfaces Evaluated**:
  - Marketing Landing Page (`/`)
  - User Strategy Guide (`/guide.html`)
  - Privacy Policy & Storage Architecture (`/privacy.html`)
  - Flutter Web Application (`/app/`)

---

## Automated Playwright Scroll Gate Verification Matrix

The automated browser gate (`test-scroll-gate.js`) was executed across both local (`http://127.0.0.1:8085`) and remote production (`https://pathfolio.pages.dev`). The runner operates portably from a clean clone without hardcoded machine paths, discovers installed browsers cross-platform, and asserts strict test failures on 320/1024 overflow or linked route status defects:

| Test Parameter | Local Measurement (`127.0.0.1:8085`) | Remote Measurement (`pathfolio.pages.dev`) | Target Requirement | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Staged Entrance ($t_0 \rightarrow t_{1.5}$)** | Rendered Fill: $247.8\text{px} \rightarrow 256.7\text{px}$, Decoded Pixel Diff: 36.0% (467,059 px) | Rendered Fill: $238.8\text{px} \rightarrow 256.7\text{px}$, Decoded Pixel Diff: 20.1% (260,838 px) | Measurable entrance choreography & packet transit | **PASSED** |
| **Hero Dossier Tilt (Initial $\rightarrow$ Scrolled)** | `matrix3d(0.992, 0, 0.121, ...)` $\rightarrow$ `matrix3d(0.971, 0, 0.051, ...)` | `matrix3d(0.992, 0, 0.121, ...)` $\rightarrow$ `matrix3d(0.971, 0, 0.051, ...)` | Non-zero parallax 3D transform delta | **PASSED** |
| **Chapter 1: Carriage Transform** | $x = 258\text{px} \rightarrow 858\text{px}$ ($\Delta = +600\text{px}$) | $x = 258\text{px} \rightarrow 858\text{px}$ ($\Delta = +600\text{px}$) | Physical horizontal track advance | **PASSED** |
| **Chapter 1: Runway Progress Bar** | $\text{scaleX}: 0.243 \rightarrow 0.808$ ($\Delta = +0.565$) | $\text{scaleX}: 0.243 \rightarrow 0.808$ ($\Delta = +0.565$) | Physical progress bar expansion | **PASSED** |
| **Chapter 1: Live Telemetry** | `02 // APPLIED TRACKING` $\rightarrow$ `05 // WRITTEN OFFER` | `02 // APPLIED TRACKING` $\rightarrow$ `05 // WRITTEN OFFER` | Active stage telemetry sync | **PASSED** |
| **Chapter 2: Fragment S Transform** | `matrix(0.996, -0.080, ...)` $\rightarrow$ `matrix(0.999, -0.007, ...)` | `matrix(0.996, -0.080, ...)` $\rightarrow$ `matrix(0.999, -0.007, ...)` | Physical fragment assembly convergence | **PASSED** |
| **Chapter 2: Fragment S Opacity** | $0.58 \rightarrow 0.96$ ($\Delta = +0.38$) | $0.58 \rightarrow 0.96$ ($\Delta = +0.38$) | Fade-in during assembly | **PASSED** |
| **Chapter 2: Verification Seal Scale** | $0.388 \rightarrow 0.949$ ($\Delta = +0.561$) | $0.388 \rightarrow 0.949$ ($\Delta = +0.561$) | Stamping physical seal delta | **PASSED** |
| **Chapter 2: Verification Seal Opacity** | $0.00 \rightarrow 0.89$ ($\Delta = +0.89$) | $0.00 \rightarrow 0.89$ ($\Delta = +0.89$) | Stamping opacity delta | **PASSED** |
| **Chapter 3: Envelope Flap 3D Angle** | $\text{rotateX}: -74.0^\circ \rightarrow -23.0^\circ$ ($\Delta = +51.0^\circ$) | $\text{rotateX}: -74.0^\circ \rightarrow -23.0^\circ$ ($\Delta = +51.0^\circ$) | 3D envelope fold shut | **PASSED** |
| **Chapter 3: Envelope Flap Opacity** | $0.71 \rightarrow 0.91$ ($\Delta = +0.20$) | $0.71 \rightarrow 0.91$ ($\Delta = +0.20$) | Flap opacity delta | **PASSED** |
| **Chapter 3: Wax Seal Transform** | $\text{scale}: 0.61, y: -44\text{px} \rightarrow \text{scale}: 0.88, y: -14\text{px}$ | $\text{scale}: 0.61, y: -44\text{px} \rightarrow \text{scale}: 0.88, y: -14\text{px}$ | Wax seal stamping down | **PASSED** |
| **Chapter 3: Wax Seal Opacity** | $0.02 \rightarrow 0.69$ ($\Delta = +0.67$) | $0.02 \rightarrow 0.69$ ($\Delta = +0.67$) | Wax seal appearance | **PASSED** |
| **Chapter 3: Code Drawer Transform** | $y = 44\text{px} \rightarrow 14\text{px}$ ($\Delta = -30\text{px}$) | $y = 44\text{px} \rightarrow 14\text{px}$ ($\Delta = -30\text{px}$) | Drawer sliding open | **PASSED** |
| **Sticky Heading Clearance** | Target rect tops cleared $> 72\text{px}$ header | Target rect tops cleared $> 72\text{px}$ header | No sticky header overlap | **PASSED** |
| **Reduced Motion Fallback** | `scaleX(1)`, fragments static, opacity 1 | `scaleX(1)`, fragments static, opacity 1 | High-contrast static state | **PASSED** |
| **Theme Toggle** | `data-theme="dark"` (Deep Spruce Slate) | `data-theme="dark"` (Deep Spruce Slate) | Distinctive deep-forest palette | **PASSED** |
| **Mobile 390px Containment** | `innerWidth: 390, scrollWidth: 390, ov: false` | `innerWidth: 390, scrollWidth: 390, ov: false` | Zero horizontal overflow | **PASSED** |
| **Mobile Drawer Navigation** | 9 targets visible, height 780px, open true | 9 targets visible, height 780px, open true | All links accessible | **PASSED** |
| **Tablet 1024px Containment** | `innerWidth: 1024, scrollWidth: 1024, ov: false` | `innerWidth: 1024, scrollWidth: 1024, ov: false` | Zero horizontal overflow | **PASSED** |
| **Narrow Mobile 320px Containment** | `innerWidth: 320, scrollWidth: 320, ov: false` | `innerWidth: 320, scrollWidth: 320, ov: false` | Zero horizontal overflow | **PASSED** |
| **Linked Routes (`/guide`, `/privacy`, `/app`)** | All 3 returned HTTP 200 with valid titles | All 3 returned HTTP 200 with valid titles | Strict failure assertion passed | **PASSED** |

---

## Six-Round Evidence-Based Visual & Motion Ledger

### Round 1 — Visual World Identity & Living Environment
- **Inspected**: Viewport 1440×900 desktop; initial load and living environment at $t_0$ and $t_{1.5}$.
- **Observed Evidence**:
  - Live inspection confirms complete departure from CodeSense's cosmic graph.
  - Ground surface renders warm architectural porcelain (`#F8F7F4` light default, `#0A1210` deep-forest slate in dark mode).
  - Living background features 5 dual-track architectural guide rails with active brass milestone velocity packets gliding across the screen, leaving glowing tracer tails (traveling $\sim 300\text{px}$ in 1.5s).
  - Soft breathing radial ambient illumination (`.architect-ambient-glow`) behind the hero provides authentic architectural depth without harsh sci-fi halos.
  - Hero headline features commanding editorial `Fraunces` scale with italicized display contrast (*"Track every loop. Own the evidence."*).
- **Screenshots Captured**: `screenshots/local-desktop-1440-t0.png`, `screenshots/local-desktop-1440-t1.5.png`.
- **Status**: PASSED.

### Round 2 — Self-Hosted Typography & Staged Entrance Choreography
- **Inspected**: Browser computed styles, font loading, and entrance progression over the first 1500ms.
- **Observed Evidence**:
  - `document.fonts` confirms 8 local woff2 files loaded (`Fraunces` 600/700, `Plus Jakarta Sans` 400/500/600/700, `JetBrains Mono` 400/500).
  - At $t_0$, the hero dossier card enters with soft elevation and rotation; the milestone rail fill begins at 0px and animates to active stage ($256.7\text{px}$) over 1.2s.
  - Comparing frame $t_0$ and $t_{1.5}$ yields a decoded visual difference of 36.0% of viewport pixels (467,059 differing pixels locally; 20.1% / 260,838 pixels remotely), confirming continuous background packet transit with luminous tracer tails, ambient breathing glow, and physical milestone fill expansion.
  - Monospace metadata accurately states `STORAGE :: CLIENT SANDBOX (v1 SCHEMA)`, eliminating all exaggerated military tropes.
- **Status**: PASSED.

### Round 3 — Chapter 1: The Milestone Pipeline Runway
- **Inspected**: Scroll behavior and physical carriage translation along `#chapter-pipeline` track.
- **Observed Evidence**:
  - As the user scrolls through the chapter, `#pipeline-scroll-bar` scales continuously from `scaleX: 0.243` to `scaleX: 0.808`.
  - The `#pipeline-rail-carriage` moves along the physical runway track from `translateX(258px)` to `translateX(858px)`.
  - Telemetry badge updates synchronously with active milestone: `02 // APPLIED TRACKING` $\rightarrow$ `05 // WRITTEN OFFER`.
  - Clicking station nodes `01` to `06` allows direct jumping across stages with smooth CSS transitions.
- **Screenshots Captured**: `screenshots/local-chapter1-before.png`, `screenshots/local-chapter1-after.png`.
- **Status**: PASSED.

### Round 4 — Chapter 2: STAR Evidence Assembly Deck
- **Inspected**: Physical convergence of detached STAR fragments into an aligned proof sheet.
- **Observed Evidence**:
  - At chapter entry, the four STAR fragment cards (`#star-frag-situation`, `#star-frag-task`, `#star-frag-action`, `#star-frag-result`) enter exploded and detached.
  - Scrolling through the chapter brings them into precise physical alignment (`matrix(0.996, ...)` $\rightarrow$ `matrix(0.999, ...)`, opacity $0.58 \rightarrow 0.96$).
  - The central brass verification seal (`#star-assembly-seal`) stamps down into place as the sheet completes ($\text{scale } 0.388 \rightarrow 0.949$, $\text{opacity } 0.00 \rightarrow 0.89$).
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

### Round 6 — Responsive Breakpoints, Strict Gate & Cross-Route Verification
- **Inspected**: Viewports 1440×900, 1024×768, 768×1024, 390×844, 320×600; routes `/`, `/guide.html`, `/privacy.html`, `/app/`.
- **Observed Evidence**:
  - 390px Mobile Viewport:
    - Zero horizontal overflow: `scrollWidth: 390px == innerWidth: 390px` (`hasHorizontalOverflow: false`).
    - Mobile menu drawer positioned at body root; opens smoothly (`aria-expanded="true"`), listing 9 navigation targets across full 780px viewport height with comfortable touch targets (>44px).
  - 1024px Tablet & 320px Narrow Mobile:
    - Strict test assertion verifies `overflow: false` across all tested breakpoints; failure triggers gate exit code 1.
  - Linked Routes Verification:
    - Automated check confirms HTTP 200 and expected page title for `/guide.html`, `/privacy.html`, and `/app/`.
  - Theme & Reduced Motion:
    - Theme switching persists seamlessly via `localStorage` (`pathfolio-theme`).
    - Reduced motion fallback sets `transform: none !important; opacity: 1 !important;` with static drafting grid and stationary calipers.
- **Screenshots Captured**: `screenshots/local-mobile-390-hero.png`, `screenshots/local-mobile-390-menu-open.png`, `screenshots/local-tablet-1024.png`, `screenshots/local-narrow-320.png`, `screenshots/local-desktop-reduced-motion.png`, `screenshots/local-desktop-theme-toggle.png`, `screenshots/local-page-guide.png`, `screenshots/local-page-privacy.png`, `screenshots/local-page-app.png`.
- **Status**: PASSED.

---

### Round 7: Phone 390 Chapters 1-3 Delta Gate, Reduced-Motion Assertion & Flutter View Integrity

- **Objective**: Expand the automated verification gate to assert before/after physical scroll transforms and opacities for Chapters 1-3 on mobile phone (390px), assert reduced-motion visibility and readability with zero hidden fragments on both phone and desktop, and verify mounted Flutter web view, canvas render, and 0 errors.
- **Observed Metrics & Evidence**:
  - **Phone 390 Chapter 1 (Runway)**:
    - Before: `carriageTransform = matrix(1, 0, 0, 1, 45, 0)`, `barTransform = matrix(0.153, 0, 0, 1, 0, 0)`
    - After: `carriageTransform = matrix(1, 0, 0, 1, 164, 0)`, `barTransform = matrix(0.556, 0, 0, 1, 0, 0)`
    - Active Stage text: `01 // SAVED DISCOVERY` $\rightarrow$ `04 // TECHNICAL INTERVIEW`
    - Delta: $119\text{px}$ physical carriage transit along mobile runway track.
  - **Phone 390 Chapter 2 (STAR Assembly)**:
    - Before: `fragSTransform = matrix(0.996, -0.085, 0.085, 0.996, -49, 24)`, `fragSOpacity = 0.56`, `sealOpacity = 0`
    - After: `fragSTransform = matrix(0.999, -0.026, 0.026, 0.999, -15, 8)`, `fragSOpacity = 0.86`, `sealOpacity = 0.59`
    - Delta: Fragment physical slide ($34\text{px}$ along $X$, $16\text{px}$ along $Y$), opacity increase $+0.30$, seal appearance.
  - **Phone 390 Chapter 3 (Sovereign Vault)**:
    - Before: `flapTransform = matrix3d(..., 0.258, -0.965, ...)`, `flapOpacity = 0.70`, `sealOpacity = 0`
    - After: `flapTransform = matrix3d(..., 0.848, -0.529, ...)`, `flapOpacity = 0.87`, `sealOpacity = 0.58`, `sealTransform = matrix(0.83, 0, 0, 0.83, 0, -19)`
    - Delta: Flap folds down into sealed posture; wax seal stamps into position.
  - **Reduced Motion Readability (Desktop & Phone)**:
    - All 12 critical selectors evaluated: `#pipeline-rail-carriage`, `#pipeline-scroll-bar`, `.pipeline-runway-card`, `#star-frag-situation`, `#star-frag-task`, `#star-frag-action`, `#star-frag-result`, `#star-assembly-seal`, `#vault-envelope-flap`, `#vault-wax-seal`, `#vault-code-drawer`, `#hero-dossier-card`.
    - 0 hidden fragments: `opacity === '1'`, `display !== 'none'`, `visibility === 'visible'`, dimensions $> 0$.
  - **Flutter Web App (`/app/`) Integrity**:
    - HTTP Status: `200`, Title: `Pathfolio — Job Search Command Center`
    - Mounted elements: `<flutter-view>`, `<flt-glass-pane>`, `<canvas>`
    - Canvas dimensions: `1440x900`, `dataUrlLength: 211546 bytes` (rich vector/widget rendering confirmed)
    - Unhandled Page Errors: `0`, Failed Network Requests: `0`.
- **Status**: PASSED.

---

### Round 8 — Comprehensive Foreground Motion Upgrade & Full Composition Choreography (Owner Motion Upgrade)

- **Objective**: Execute the owner's request for motion-studio / advertisement craft level foreground animation density (benchmarked against CodeSense, Grepless, and Haan) across the entire composition, verifying real computed transforms, opacities, and interactive states on both local and live remote Cloudflare Pages deployments.
- **Observed Metrics & Evidence**:
  - **Hero Headline Masked Reveals & Staged Entrance**:
    - Line 1 (`.hero-line-inner.line-1`): Unmasks from `translateY(115%) rotate(2.5deg)` with 6px blur to `translateY(0) rotate(0deg)` blur(0). Opacity advances $0.88 \rightarrow 1.00$.
    - Line 2 (`.hero-line-inner.line-2`): Unmasks with italic display contrast ($0.28\text{s}$ stagger). Opacity advances $0.59 \rightarrow 1.00$.
    - Coordinated Entrance: Status badge (`#hero-status-badge`), briefing lead (`#hero-lead`), action buttons (`#hero-actions`), and proof ledger (`#hero-proof-ledger`) stagger smoothly into resting plane with zero jitter.
    - Dossier Milestone Rail Fill: Expands $237.1\text{px} \rightarrow 256.7\text{px}$ over 1.1s.
  - **Scroll-Led 3D Layered Dossier Spread**:
    - As the user scrolls down 350px, underlay sheets fan out in physical depth:
      - Underlay 1 (`#hero-underlay-1`): Fans out leftward, transform shifts from $\text{rotate}(-1.5^\circ)$ to `matrix3d(0.9978, -0.0668, 0, 0, 0.0668, 0.9978, 0, 0, 0, 0, 1, 0, -15.5, 8.1, -25, 1)`.
      - Underlay 2 (`#hero-underlay-2`): Fans out rightward, transform shifts from $\text{rotate}(+3^\circ)$ to `matrix3d(0.9962, 0.0866, 0, 0, -0.0866, 0.9962, 0, 0, 0, 0, 1, 0, 12.2, 10.1, -50, 1)`.
      - Folder tab (`#hero-dossier-tab`) shifts vertically in 3D perspective.
  - **Section Headers & Eyebrows Unmasking**:
    - All section headers across all chapters (`.motion-header-group`) unmask eyebrows, display titles (`.motion-title-inner`), and lead paragraphs with blur-to-sharp transitions upon viewport intersection.
  - **Chapter 1: Pipeline Runway Cards Stagger & Active Station**:
    - Runway cards (`.pipeline-runway-card`) stagger into view with active station transitions (`.active` highlight and glowing border) synchronized with carriage advance ($257\text{px} \rightarrow 855\text{px}$).
  - **Chapter 2: STAR Assembly & Tactile Citation Feedback**:
    - STAR fragments assemble ($0.58 \rightarrow 0.96$ opacity, alignment matrix).
    - Verification seal stamps into reserved space ($0.00 \rightarrow 0.89$ opacity).
    - Clicking `#btn-cite-simulation` produces immediate tactile feedback: button scale dips to 0.96, and `#citation-feedback` displays confirmation with smooth rise.
    - Geometric seal clearance verified $> 90\text{px}$ across 8 scroll states on 390px and 320px viewports (zero intersection with text or controls).
  - **Chapter 3: Sovereign Vault Folding & Comparison Grid**:
    - Flap folds shut via 3D `rotateX` matrix; hot wax seal stamps down ($\text{opacity } 0.02 \rightarrow 0.69$).
    - Architectural vs Centralized comparison boxes (`.motion-compare-box`) stagger into view with `.is-revealed`.
  - **Chapter 4: App Tour Gallery 3D Perspective Parallax**:
    - Gallery cards (`.motion-gallery-card.desktop-card`, `.mobile-card`) elevate into view; scrolling 250px produces verified `matrix3d` parallax displacement.
  - **Closing CTA & Footer Columns Stagger**:
    - Closing CTA card (`.motion-cta-card`) reveals with deep elevation and breathing ambient illumination.
    - All four footer navigation columns (`.motion-footer-col`) stagger into view upon reaching document footer.
  - **Reverse Scroll & Midpage Reload Integrity**:
    - Scrolling from page bottom back to top ($y = 0$) verifies hero elements remain fully visible (`opacity: 1`) with zero stuck hidden states.
    - Direct reload / hash jump to `#privacy-vault` immediately reveals in-viewport content via IntersectionObserver without requiring manual scroll.
  - **No-JS Full Readability**:
    - Verified with `javaScriptEnabled: false`: all 21+ foreground groups render with `opacity >= 0.95`, `transform: none`, and positive dimensions. Zero content loss.
  - **Live Remote Production Gate**:
    - Remote gate on `https://pathfolio.pages.dev/` PASSED all assertions with 0 errors.
- **Status**: PASSED.

---

## Concrete Differentiation Analysis: Pathfolio Dark Dossier vs. CodeSense (1440×900 Equal-Width Comparison)

| Design Dimension | CodeSense (`https://pr-reviewer-omega-liard.vercel.app`) | Pathfolio Deep-Forest Dossier (`https://pathfolio.pages.dev`) | Concrete Distinction Proof |
| :--- | :--- | :--- | :--- |
| **Atmospheric Base & Surface** | Cold, pitch-black cosmic void (`#0B0D12` / `#08090C`) with a glowing orange interstellar gas nebula. | Rich, deep botanical evergreen slate (`#0A1210` / `rgb(10, 18, 16)`) with deep spruce card surface (`#121C18`). | Completely different color temperature; Pathfolio uses organic spruce slate rather than cybernetic black void. |
| **Background Structural Motif** | 3D orbital rings, curved elliptical filaments, and a perspective wireframe coordinate grid. | Dual-line horizontal architectural guide rails with active brass milestone velocity packets and coordinate calipers. | Pathfolio evokes an active drafting board; zero orbital rings or wireframes. |
| **Motion & Particles** | Free-floating 3D particle constellation with bokeh distance blur and floating code filenames (`src/pricing.js`, `createOrder()`). | 5 horizontal architectural guide rails with warm brass milestone transport packets gliding across the screen with luminous tails. Zero floating code labels. | Structured, linear milestone transport vs. random floating starfields. |
| **Layout & Hierarchy** | Asymmetric left-aligned headline with curved orange brushstroke underline; floating card anchored bottom-right. | Asymmetric 12-column editorial grid (`1.15fr 0.85fr`) pairing an executive briefing in `Fraunces` serif (*"Track every loop. Own the evidence."*) with a 3D layered Career Dossier object with folder ear tab and underlay sheets. | Physical archival desk metaphor vs. asymmetric cosmic terminal split. |
| **Scroll Narrative** | Continuous drifting particles and standard page scroll. | THREE distinct physical scroll chapters: physical pipeline runway carriage advance, physical STAR fragment assembly, and 3D envelope fold + wax seal stamping. | Measurable computed transform deltas linked directly to scroll progress ($p$). |
| **Interactive Focal Point** | Static screenshot PR comment tooltip (`codesense-pr # Bug`). | Dynamic milestone scrubber with stage progression (`Saved` → `Applied` → `Screening` → `Interview` → `Offer` → `Rejected`), candidate role cycling, and real timeline logs. | Real interactive state machine with tactile buttons and tab switching. |
| **Glow & Lighting Effects** | Intense radial orange neon glow (`--accent-glow: rgba(224, 109, 68, 0.35)`) and glowing cyan/amber nodes. | Zero neon glow; crisp 1px tactile borders (`#1F332C`), warm archival ivory typography (`#EDEBE6`), and soft bookbinder brass accents. | Matte, tactile, physical paper/bookbinding craft without sci-fi energy halos. |
| **Reduced Motion Fallback** | Orbiting nodes freeze or hide. | Canvas transitions immediately to static hairline ledger rules; all CSS transforms/transitions clamped to 0.01ms; narrative chapters locked in readable assembled state. | Complete static readability guaranteed. |
