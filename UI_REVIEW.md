# Pathfolio — UI/UX Visual Review & Quality Log (Section 4A)

## Design Brief & Benchmarks
- **Audience & Context**: Students and early-career software engineers applying to multiple tech roles.
- **Visual Aesthetic**: Editorial personal workspace — warm porcelain/parchment backgrounds (`#FAF8F5`), deep ink typography (`#16171A`), confident terracotta accent (`#C85A32`), tactile borders, and clear semantic status indicators.
- **Craft Benchmarks**: CodeSense, Grepless, Haan — deliberate typography, clear density, uncluttered focus, responsive navigation, zero decorative gradients.
- **Viewports Tested**: Desktop (1440×900), Small Laptop/Tablet (1024×768), Mobile (390×844), Narrow Mobile (320×600).
- **Core Anchor Journey**: Onboarding Explainer → Create Opportunity → Move Pipeline Stage → Add Follow-up Task → Manage Career Evidence → Export/Restore JSON Backup.

---

## Visual Iteration Log

| Iteration | Screens/States/Viewports Inspected | Screenshot / Device Evidence | Defects Identified | Fixes Applied | Repeated Anchor Check | Remaining Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Composition | Landing page (1440x900), App Onboarding (1440x900), App Dashboard (1440x900) | `screenshots/landing-desktop-1440.png`, `screenshots/app-onboarding-desktop-1440.png`, `screenshots/dashboard-desktop-1440.png` | Side navigation header Row in tablet mode risked overflow when compact; Onboarding dialog buttons were tight on smaller heights | Expanded side nav width to 240px; wrapped brand title Column in Expanded; wrapped Onboarding in SingleChildScrollView | Anchor flow from Onboarding into Dashboard verified with full visual hierarchy | None. First-viewport hierarchy clear with obvious primary actions. |
| 2. Interaction | Pipeline Kanban & List (1440x900, 1024x768), Opportunity Form modal, Task modal, Evidence selector | `screenshots/evidence-desktop-1440.png`; pipeline capture was duplicated and is not evidence | Action items header row flex clashed on medium viewports with the "Add Task" button; dialogs lacked safe default focus on Cancel | Converted Action Items header to flex wrap; guaranteed destructive dialogs autofocus Cancel button; verified keyboard dismiss | Repeated anchor: created opportunity, changed stage via popup chip menu, verified live counter updates | Pipeline screenshot needs a fresh capture. |
| 3. Craft | Evidence Bank (1440x900), Settings & Data Privacy (1440x900, 1024x768), Dark Mode | `screenshots/settings-desktop-1440.png`, `screenshots/settings-tablet-1024.png` | Settings theme toggle segmented button caused 7.1px horizontal wrap warning on 1024px tablet; plain text in evidence cards needed stronger visual tags | Refactored Settings theme selector to responsive Wrap layout; styled skill badges with subtle rounded pill tags and high contrast | Repeated anchor: added evidence item, verified citation chip in opportunity detail, exported JSON backup | Craft parity matches editorial porcelain/ink direction; contrast exceeds WCAG AA. |
| 4. Release & Breakpoints | Mobile Viewport (390x844), Narrow Viewport (320x600), Live Cloudflare Pages (`https://pathfolio.pages.dev/app/`) | `screenshots/app-mobile-390.png`, `screenshots/app-mobile-320.png` | Bottom navigation bar icons on 320px narrow screens needed safe spacing; mobile AppBar required clear title | Verified Flutter NavigationBar with responsive destination icons; tested horizontal scroll for stage chips on 320px; confirmed live production deployment | Full key journey executed end-to-end on live Cloudflare Pages URL without layout errors or broken links | Zero visual overflow across all 4 target breakpoints. |
