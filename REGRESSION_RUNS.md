# Pathfolio — Regression Suite Runs Ledger

| Iteration | Suite | CaseIDs | Method | Actual | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | CORE | TC-0101,TC-0201,TC-0301,TC-0401,TC-0501,TC-0601,TC-0701,TC-0801,TC-0901,TC-1001,TC-1101 | Automated test runner flutter test and Chrome DevTools | All 11 baseline Must checks executed and verified in target environments | passed | test-run-round-1-core-baseline-verified |
| 2 | CORE | TC-0101,TC-0201,TC-0301,TC-0401,TC-0501,TC-0601,TC-0701,TC-0801,TC-0901,TC-1001,TC-1101 | Automated test runner flutter test after adversarial additions | All 11 frozen CORE regression cases re-executed and confirmed passing | passed | test-run-round-2-core-adversarial-verified |
| 3 | CORE | TC-0101,TC-0201,TC-0301,TC-0401,TC-0501,TC-0601,TC-0701,TC-0801,TC-0901,TC-1001,TC-1101 | Full regression pass across models, widget tests, and live production endpoints | Complete 11 CORE cases re-executed alongside 44 distinct test suite with zero failures | passed | test-run-round-3-core-final-release-verified |
