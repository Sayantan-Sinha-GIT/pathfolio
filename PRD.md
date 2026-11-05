# Pathfolio — Product Requirements

## Goal

Build a polished, genuinely usable job-application command center for students and early-career professionals. The product must work offline, keep the user's sensitive job-search data on their own device/browser, and make follow-ups and interview preparation easier to manage. This is an end-to-end trial of the installed Antigravity-Kit: the agent must build, test, visually review, deploy, and publish the finished product autonomously.

## Platforms and release

- Flutter application for Android and the web, sharing business rules and the core interface. Android release APK is a required artifact; the web app must be deployed and usable at a public URL.
- A responsive, search-readable marketing website on the same public domain with product explanation, real app screenshots, privacy explanation, usage guide, and a clear Launch App link. The marketing site must be made with web-native HTML/CSS/JS; the working app can live at `/app/`.
- Deploy static assets to a new Cloudflare Pages **Direct Upload** project using the owner's existing authenticated Wrangler account. This deployment mode is an explicit choice; no owner decision is needed. Build the Flutter web app with the correct `/app/` base path and working deep-link fallback.
- Create a new GitHub repository under `Sayantan-Sinha-GIT`, keep it private while building, then make it public after tests, secret scan, screenshots, APK, and live verification pass. Add a useful README, MIT license, CI, screenshots, and a GitHub Release containing the Android APK. Do not publish signing keys or local job-search data.
- Use only free tooling/accounts already available. No provider API keys, cloud database, login, paid AI, analytics, or tracking are required. Do not add an external service just to fill a feature gap.

## Environment notes

- Flutter SDK: `C:\Users\Sayantan Sinha\.codex\flutter-sdk\bin\flutter.bat` (Flutter 3.47.7); it is not on PATH. Android SDK: `C:\Users\Sayantan Sinha\AppData\Local\Android\sdk`. Chrome and Android emulator tooling are installed. The Android SDK path contains spaces and Flutter Doctor warns about NDK tools; investigate only if a build actually fails. Do not move or delete the SDK.
- Wrangler is authenticated as `srimantasutapa123@gmail.com`. GitHub CLI is authenticated for `Sayantan-Sinha-GIT`. Reuse these sessions; do not ask the owner for credentials unless a real account step blocks progress.
- Read the installed Antigravity-Kit `PLAYBOOK.txt` completely through `END OF PLAYBOOK.TXT`. The PRD wins if any kit instruction conflicts. The owner requirement mandates six website visual/motion review-and-fix rounds (and four app visual review rounds) and three test-case rounds; record real evidence, rerun the same CORE suite, and continue without phase-review prompts.

## Users and data

- Primary user: a student or early-career professional applying to multiple roles.
- All application records, tasks, notes, preferences, and evidence items are stored locally. Browser storage is per browser/profile; Android storage is per app installation. Explain this plainly during onboarding and in Settings. There is no cross-device sync. Export/import is the deliberate transfer mechanism.
- Initial state is empty. A clearly labeled optional demo workspace can be loaded on demand; demo records must never be mistaken for the user's real records. The user can erase demo data with confirmation.
- No credentials, resumes, or personal documents are uploaded to any server. The evidence bank stores titles/notes/links, not document bytes.

## Must-have product behavior

| ID | Behavior | Acceptance criteria |
| --- | --- | --- |
| M01 | Opportunity record | Create, edit, archive, restore, and delete an opportunity. Fields: company, role, stage, source URL, location/work mode, salary note, application date, next action date, and private notes. Company/role required, URL validated when present, delete confirmed. Empty and long content handled. |
| M02 | Pipeline | Stages: Saved, Applied, Screening, Interview, Offer, Rejected. Move a record between stages from list and detail; record dated stage changes in an activity timeline; archived records leave active counts. Stage changes persist after reload/restart. |
| M03 | Follow-ups | Add/edit/complete/reopen/delete tasks attached to an opportunity, with title and optional due date. Dashboard highlights overdue and upcoming tasks by local date; completion changes counts immediately. Gracefully handle opportunities with no tasks. |
| M04 | Find and prioritize | Search company/role/notes, filter by stage and archived status, sort by most recent/next action/company, and clear filters. Results and empty states must be correct and keyboard accessible on web. |
| M05 | Dashboard | Show actual counts by stage, due/overdue actions, and a recent activity summary computed from local records. No fabricated percentages or demo data in a real workspace. Cards/charts must lead to the relevant filtered list. |
| M06 | Evidence bank | Store reusable career evidence entries (title, skill tags, concise result, optional URL); search them and attach references to an opportunity without duplicating or uploading files. Removing a referenced entry must not corrupt opportunity history. |
| M07 | Backup and restore | Export a versioned JSON backup of all user records and preferences; import after previewing counts and confirming the replacement. Validate file size, schema version, field types, and malformed/unsafe data. Reject invalid backups without changing current data. Explain that imports replace current local data. Both Android and web must work. |
| M08 | Privacy controls | Settings show local-only storage, export date, theme and motion preferences, and a confirmed Erase All Data action. Erase removes real and demo records; no data leaves the device except when the user explicitly exports or opens an external source URL. |
| M09 | Onboarding and help | First-run onboarding explains local storage and backup, then opens an empty usable workspace. Provide a short in-app guide and meaningful error/recovery messages. No mandatory sign-in. |
| M10 | Cross-platform UX | All Must flows work on Android and web with responsive layouts, text scaling, focus/keyboard navigation, sufficient contrast, reduced-motion handling, and safe areas. No clipped controls or horizontal overflow at target sizes. |
| M11 | Public website | Landing page is visually distinctive and product-specific, has real screenshots, feature explanation, privacy and usage pages, working Launch App and APK download links, responsive layouts, keyboard focus, semantic headings, and no dead CTAs. |
| M12 | Release | Web app is live on Cloudflare Pages; Android release APK installs/launches; public GitHub source and CI pass; GitHub Release contains the APK; README documents setup, architecture, storage limits, deployment, test evidence, and honest limitations. |

## Design direction & foreground motion choreography

Pathfolio should feel like a considered personal workspace, not a generic SaaS dashboard. Use an editorial but energetic visual language: warm architectural porcelain surfaces (`#F8F7F4` light default, `#0A1210` deep-forest slate dark), deep ink, signature Alpine Verdigris (`#0F4D3F` light, `#2DD4BF` dark) & architectural brass (`#B87333`), self-hosted `Fraunces`, `Plus Jakarta Sans`, and `JetBrains Mono` typography, tactile interaction details, carefully structured data, and useful illustration or imagery only where it improves understanding. Avoid a wall of identical cards, oversized vanity metrics, emoji icons, gradients as decoration, and empty stock imagery. The app must be pleasant during daily use; the public site must look portfolio-worthy.

### Motion-Studio Foreground Craft Requirements (Owner Upgrade)
In accordance with the owner's explicit motion upgrade request referencing CodeSense (`https://pr-reviewer-omega-liard.vercel.app/`), Grepless (`https://grepless.vercel.app/`), and Haan (`https://haan-kolkata-pilot.pages.dev/`), the public website foreground motion density is elevated to motion-studio / advertisement craft level across all visible content groups:
1. **Hero Staged Entrance & Masked Line Reveal**: Staggered masked line typography reveals for the editorial headline (`.hero-line-mask` with `.hero-line-inner`), coordinated entrance for status badge, lead briefing, action buttons, and proof ledger, accompanied by a 3D perspective settling entrance of the Career Dossier object.
2. **Scroll-Led 3D Layered Dossier Spread**: Physical fanning out of underlay sheets (`#hero-underlay-1`, `#hero-underlay-2`) and folder tab (`#hero-dossier-tab`) with controlled 3D rotation, translation, and depth relative to scroll progression.
3. **Chapter Section Reveal & Kinematics**:
   - Section headers, eyebrows, and lead paragraphs independently reveal with blur clearing and masked unmasking.
   - Chapter 1: The Six-Stage Pipeline Runway carriage travels along precision calipers, progress bar scales, telemetry text updates, and runway cards stagger into view with active station highlights.
   - Chapter 2: STAR Evidence Deck fragments physically converge from detached float into aligned proof sheet, verification seal stamps into reserved nonintersecting space, and citation simulation button provides immediate tactile visual feedback.
   - Chapter 3: Sovereign Dossier Vault 3D dimensional envelope flap folds shut, hot wax seal stamps down, code drawer slides open, and comparison boxes stagger into view.
   - Chapter 4: App Tour Gallery dual-perspective parallax shifts with viewport elevation and platform tab interactions.
   - Closing CTA & Footer: Deep container elevation with breathing ambient glow, button reveals, and staggered footer navigation columns.
4. **Resilience & Accessibility**: Single-owner element transforms without wrapper fighting; full No-JS progressive enhancement (`opacity: 1 !important`, `transform: none !important`) ensuring complete readability without JavaScript; strict reduced-motion fallback; zero horizontal overflow on 390px and 320px viewports; minimum seal-to-text geometric clearance > 80px.

Inspect actual rendered desktop (1440×900), small laptop (1024×768), and mobile (390×844 and a narrow 320 px case) screens, plus a real Android emulator when available. The kit's visual loop requires **six website visual/motion review-and-fix rounds** (and four app visual review rounds) that repeat the same anchor journeys (onboarding → add opportunity → move stage → add task → export/import), add new states, fix observed defects, and record screenshots and results in `UI_REVIEW.md` and `MOTION_REVIEW.md`. The website and Flutter app both count as user-facing surfaces. Do not ask the owner to review each round.

## Architecture and safety

- Pick actively maintained Flutter packages compatible with the installed SDK and both Android/web. Document selections. Use a repository/service layer so storage can be tested. Persist writes atomically enough that a failed import cannot partially replace records.
- Use one schema version for local data and backups. Validate all imported fields before committing changes. Never execute imported strings as HTML or code. External links open with appropriate safeguards.
- Keep signing credentials in ignored local files, generate a new release keystore if needed, and document a local backup path without exposing its password. Never print secrets in logs or commit them.
- Static website must have no hidden tracking scripts. Include a privacy page that accurately states local storage and the limits of browser persistence.
- Use GitHub Actions for format/analyze/test/build (at least Flutter web), and a secret scan. Do not add a deploy action requiring absent credentials.

## Verification and completion

- Run `flutter analyze`, meaningful unit/widget tests for data/storage/import/pipeline/task rules, production Flutter web build, Android release APK build, and browser end-to-end tests for the primary web journeys. Run real Android emulator checks if the emulator can be started; record any device-specific behavior that remains unverified.
- Test valid and invalid backups, empty state, long text, persistence after restart/reload, URL validation, confirmation/cancel paths, and source-link behavior. Test the website's CTA, routes, responsiveness, and accessibility basics.
- Run the Antigravity-Kit's three test iterations with new executed cases in every round and the same CORE regressions rerun in all three, plus its quality gate. A fourth test round is allowed only for significant unresolved defects. Never claim results from code inspection alone.
- Inspect the live Cloudflare deployment, verify actual app data flow in the browser, verify APK installation/launch, confirm GitHub CI and release, and keep the repository private until secret and artifact checks pass. Publish when ready; the owner has authorized this project-level deployment and public showcase. Report links, screenshots, test counts, and any honest limitations.

## Owner interruptions

Work independently through implementation and release. Only ask the owner for a truly blocked account action or IDE-enforced approval, one action at a time. If the Antigravity model's quota is exhausted, stop at a precise handoff in `PROGRESS.md` and tell the owner to switch accounts; the next chat must use the kit's CONTINUE prompt and resume rather than restarting.
