# Final release verification: Pathfolio 1.0.2

Verified on 6 November 2026. Supported release targets are Android and web.

## Repairs included

- Real JSON file save/open on web and Android, with copy/paste retained as a fallback. Imports still preview counts and require explicit replacement confirmation.
- Invalid preferences, unsafe URLs, unknown stages, invalid dates, missing arrays, duplicate IDs and orphaned tasks/activity are rejected before any replacement. UTF-8 input is bounded by bytes, including streamed document-provider input.
- Clearing opportunity dates, task due dates and source links now persists. Reopening a task clears its completion timestamp.
- Rapid activity receives unique timeline IDs. Narrow Settings layouts and backup dialogs wrap without clipping.
- A reproducible combined website/web-app build, local preview, and signed Android build are available through npm scripts. The Windows JDK socket workaround is scoped to the build process, with no machine-wide JDK setting change.
- Offline precaching includes the app's own fonts. The approved homepage design is preserved.

## Executed checks

| Check | Result |
| --- | --- |
| Flutter unit/widget suite | 47 passed |
| Flutter analyzer | No errors or warnings; 29 informational style/deprecation notices |
| Production Flutter web + static site build | Passed, locally hosted engine resources |
| Signed Android release build | Passed, version 1.0.2 / versionCode 3 |
| APK signing verification | Passed; dedicated Pathfolio release identity |
| Local website motion/navigation gate | Passed all core assertions; private reference comparison explicitly skipped |
| Real web app journey, local and production | Passed: create opportunity, download backup file, cancel import, reject invalid file, confirm restore, reload persistence, offline reload |
| Headless Android emulator | Installed and cold-launched release APK; native document picker saved a nonempty JSON file, reopened it, previewed and confirmed restore successfully |
| Responsive layouts | Existing website gate covers 320, 390, 768, 1024 and 1440 px; new Settings/dialog widget cases at 320 px passed |

No personal accounts or job-search data were used in these tests. Browser runs used isolated contexts and synthetic records.

## Reproduce

From `app/`: `flutter test` and `flutter analyze --no-fatal-infos`.
From the root: `npm ci`, `npm run build`, `npm run test:app`, `npm run test:gate:public`.
For the deployed app, set `APP_BASE_URL=https://pathfolio.pages.dev` before `npm run test:app`.
For Android: restore the private signing files, then `npm run build:apk`.

## Limits

- The physical-phone and iOS/desktop-native platforms were not tested; only Android emulator and web are claimed.
- Storage remains device/browser-local; clearing it removes data. Export a backup before clearing or moving devices. There is deliberately no cloud synchronization.
- Web offline use requires a complete first online load. External job posting links still need internet.
- The informational analyzer notices are maintenance items, not suppressed errors.
