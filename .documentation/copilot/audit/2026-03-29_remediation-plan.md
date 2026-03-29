# Audit Remediation Plan and Execution

## Source

- Audit report: `.documentation/copilot/audit/2026-03-29_results.md`
- Execution date: 2026-03-29

## Plan

1. Stabilize test runtime
- Fix any blocking test setup issues so remediation can be verified.
- Success criteria: targeted Jest suite runs cleanly.

2. Address operational logging issues
- Remove debug-only state and noisy runtime console logging from user-facing screen paths.
- Success criteria: no debug counters/status in UI and no routine console noise in normal runtime flow.

3. Reduce duplicated joke screen behavior
- Eliminate duplicate logic path by reusing shared implementation for web alias component.
- Success criteria: single implementation source for joke-fetch/render flow.

4. Close testing gaps for documentation screens
- Add direct tests for Documentation browser/reader/switching flow.
- Success criteria: tests exist and pass for `DocumentationScreen`, `DocumentationBrowserScreen`, `DocumentationReaderScreen`.

5. Verify and record
- Run targeted tests and record outcomes.
- Success criteria: all targeted suites pass.

## Execution Summary

### Completed

- Step 1 completed:
  - Fixed Jest setup mock path in `config/jest.setup.js`.

- Step 2 completed:
  - Removed debug counters/status UI and runtime debug logs in `packages/shared/src/components/screens/JokesScreen.tsx`.
  - Removed fallback runtime warning in `packages/shared/src/components/screens/DocumentationReaderScreen.tsx`.

- Step 3 completed:
  - Replaced duplicate `JokesScreenWeb` implementation with shared screen export in `packages/shared/src/components/screens/JokesScreenWeb.tsx`.

- Step 4 completed:
  - Added `packages/shared/src/__tests__/DocumentationScreen.test.tsx`.
  - Added `packages/shared/src/__tests__/DocumentationBrowserScreen.test.tsx`.
  - Added `packages/shared/src/__tests__/DocumentationReaderScreen.test.tsx`.

- Step 5 completed:
  - Ran targeted Jest suites successfully.

## Verification

Command:

```bash
npx jest packages/shared/src/__tests__/JokesScreen.test.tsx packages/shared/src/__tests__/DocumentationScreen.test.tsx packages/shared/src/__tests__/DocumentationBrowserScreen.test.tsx packages/shared/src/__tests__/DocumentationReaderScreen.test.tsx --runInBand
```

Result:

- Test Suites: 4 passed, 4 total
- Tests: 7 passed, 7 total
- Status: PASS

## Remaining Items

- None.

## VER3 Resolution Note

- Executed `specify upgrade --backup --force` using the Spec Kit CLI.
- Verified `.documentation/SPECKIT_VERSION` remains present at version `1.5.1`.
- Corrected Speckit governance wording that incorrectly treated canonical `.documentation/` paths as stale:
  - `.github/agents/speckit.site-audit.agent.md`
  - `.github/agents/speckit.upgrade.agent.md`
- Updated VER3 criteria to flag only legacy root-level `memory/`, `scripts/`, `templates/`, or `specs/` path usage.
