# Research: Safe Package Updates

## Decision 1: Use staged dependency cohorts instead of a single repository-wide jump to latest

- **Decision**: Split upgrades into low-risk stable updates, coordinated ecosystem upgrades, and deferred hold items.
- **Rationale**: The repository combines root, web, mobile, and shared manifests. React Native and its companion tooling move as an ecosystem, while some web and utility packages can move independently with much lower regression risk.
- **Alternatives considered**:
  - Upgrade all dependencies to latest in one pass. Rejected because it concentrates regression risk and makes rollback harder.
  - Limit changes to patch versions only. Rejected because it leaves important ecosystem alignment work unresolved.

## Decision 2: Treat React Native and aligned tooling as a coordinated cohort

- **Decision**: Keep `react-native`, `@react-native/babel-preset`, `@react-native/eslint-config`, `@react-native/metro-config`, and `@react-native/typescript-config` in the same implementation stage.
- **Rationale**: These packages share release cadence and compatibility expectations. Updating them separately risks build and runtime mismatches across mobile and shared packages.
- **Alternatives considered**:
  - Update only `react-native` first. Rejected because supporting presets and configs are version-coupled.
  - Delay all React Native work indefinitely. Rejected because the root and mobile manifests would continue to drift from the supported ecosystem.

## Decision 3: Prefer stable releases over apparent latest tags when latest points at prerelease or ambiguous compatibility

- **Decision**: Do not auto-target prerelease or ambiguous `latest` values such as TypeScript prerelease builds. Require confirmed stable compatibility before moving those packages.
- **Rationale**: The feature goal is a safe path to latest stable versions, not blind adoption of every tag exposed by package metadata.
- **Alternatives considered**:
  - Follow `latest` tags mechanically. Rejected because prerelease adoption would violate the spec constraint and increase compatibility risk.
  - Freeze all tooling versions. Rejected because some safe updates are available now and should not be blocked by a few uncertain packages.

## Decision 4: Keep `marked` and related typing alignment on hold until compatibility is reviewed

- **Decision**: Treat the `marked` major-version jump and the existing `@types/marked` mismatch as an investigation item rather than a default update.
- **Rationale**: Parser packages often carry behavior and typing changes across majors. The current type package version already suggests compatibility ambiguity that should be resolved deliberately.
- **Alternatives considered**:
  - Upgrade `marked` immediately with the low-risk cohort. Rejected because it is a major jump with likely typing and parsing surface changes.
  - Remove Markdown functionality from scope. Rejected because the feature is about safe dependency upgrades, not feature removal.

## Decision 5: Use repository quality gates plus targeted smoke checks as promotion criteria

- **Decision**: Require `npm run lint`, `npm run type-check`, `npm run test:ci`, and `npm run security:check` for every cohort, plus web build verification and mobile startup smoke checks for any stage that changes runtime or platform tooling.
- **Rationale**: The constitution makes these gates non-negotiable for release-bound work, and dependency upgrades need explicit evidence that cross-platform flows still hold.
- **Alternatives considered**:
  - Rely on package manager install success alone. Rejected because install success does not prove runtime or test compatibility.
  - Run the full mobile release build on every micro-update. Rejected for low-risk cohorts because it adds cost without improving the signal for trivial web or tool-only changes.

## Audit Snapshot: 2026-04-11

- Root manifest `package.json`: `react`, `react-dom`, and `react-test-renderer` have a stable patch move from 19.2.4 to 19.2.5; `prettier` has a stable patch move from 3.8.1 to 3.8.2.
- Web manifest `packages/web/package.json`: `react` and `react-dom` have a stable patch move from 19.2.4 to 19.2.5; `vite` has a stable patch move from 8.0.3 to 8.0.8.
- Mobile manifest `packages/mobile/package.json`: `react` has a stable patch move from 19.2.4 to 19.2.5; `eslint` has a stable patch move from 10.1.0 to 10.2.0; `prettier` has a stable patch move from 3.8.1 to 3.8.2.
- React Native and aligned `@react-native/*` packages remain a coordinated cohort because npm reports 0.85.0 as latest while 0.84.1 is still the currently satisfied wanted line.
- `marked` remains a hold item because 18.0.0 is latest while 17.0.6 remains the current stable line in this repository.
- `packages/shared/package.json` did not produce an independent outdated result and remains governed by peer compatibility rather than direct runtime upgrades.

## Recommended Cohorts

### Cohort A: Low-risk stable updates

- React 19.2.4 -> 19.2.5 in root, web, and mobile manifests where applicable
- React DOM 19.2.4 -> 19.2.5 in root and web
- React Test Renderer 19.2.4 -> 19.2.5 in root and mobile where present
- Vite 8.0.3 -> 8.0.8 in `packages/web`
- Prettier 3.8.1 -> 3.8.2 in root and `packages/mobile`
- ESLint 10.1.0 -> 10.2.0 in `packages/mobile`
- Any matching patch-level type package updates that preserve compatibility with the active runtime versions

### Cohort B: Coordinated ecosystem upgrades

- React Native 0.84.1 -> 0.85.0 in root and mobile
- `@react-native/*` preset/config packages aligned to the same release family
- Shared peer dependency ranges reviewed and updated if runtime expectations change

### Cohort C: Hold items

- `marked` 17.x -> 18.x pending compatibility review
- `@types/marked` pending resolution of package ownership and compatibility
- TypeScript moves beyond the current stable line when package metadata points at prerelease outputs

## Execution Outcome: 2026-04-11

### Completed Cohorts

- **Cohort A**: Completed. Updated the root, web, and mobile manifests for the confirmed low-risk React, React DOM, React Test Renderer, Vite, ESLint, and Prettier moves, then refreshed `package-lock.json` and cleared all repository gates.
- **Cohort B**: Completed. Updated `react-native` and aligned `@react-native/*` packages in the root and mobile manifests, aligned `packages/shared/package.json` peer expectations, added `@react-native/jest-preset` to the root toolchain surface, and cleared the full validation sequence.

### Explicit Hold Decisions

- **`marked`**: Hold. Evidence required: confirm that the Markdown rendering paths and any parser option usage remain compatible with 18.x before editing `package.json`.
- **`@types/marked`**: Hold. Evidence required: confirm whether the runtime package now ships the required types so the separate type package can be removed or updated without breaking the TypeScript surface.
- **TypeScript beyond 6.0.2**: Hold. Evidence required: wait for a clearly stable next line and verify compatibility with the current Vite, ESLint, and React Native toolchain before adoption.
