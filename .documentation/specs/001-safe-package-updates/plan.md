# Implementation Plan: Safe Package Updates

**Branch**: `001-safe-package-updates` | **Date**: 2026-04-11 | **Spec**: `.documentation/specs/001-safe-package-updates/spec.md`
**Input**: Feature specification from `.documentation/specs/001-safe-package-updates/spec.md`

## Rationale Summary

### Core Problem

The repository has dependency drift across the root application and package-specific manifests, including coordinated React Native tooling, web build tooling, shared peer dependencies, and a few hold items with compatibility risk. Updating everything to latest in one pass would create unnecessary regression risk across web, mobile, testing, and deployment paths.

### Decision Summary

Use a staged dependency upgrade plan with three cohorts: low-risk stable updates that can move first, coordinated ecosystem upgrades that require synchronized manifest changes and validation, and hold items that stay deferred until compatibility is explicitly confirmed. Each cohort must pass repository quality gates before advancing.

### Key Drivers

- Reduce maintenance and security debt without destabilizing the cross-platform starter.
- Keep React Native, React Native tooling, and shared peer dependency alignment coherent across manifests.
- Preserve release readiness by treating lint, type-check, tests, and security checks as stage gates.

### Source Inputs

- Quick specification for safe package updates in `.documentation/specs/001-safe-package-updates/spec.md`.
- Constitution requirements in `.documentation/memory/constitution.md`.
- Current manifests in `package.json`, `packages/web/package.json`, `packages/mobile/package.json`, and `packages/shared/package.json`.
- Read-only dependency audit results gathered from `npm outdated` and `npm-check-updates`.

### Tradeoffs Considered

- Option A: Upgrade every package to latest in one pass. Not chosen because React Native and adjacent tooling upgrades can require coordinated changes and targeted validation.
- Option B: Limit changes to security-only or patch-only updates. Not chosen because it leaves known ecosystem drift in place and defers necessary package alignment.
- Selected: Stage updates by compatibility risk so low-risk value lands quickly while high-risk moves remain bounded and reviewable.

### Architectural Impact

- No product architecture change is intended; the main changes are expected in npm manifests, lockfile content, and upgrade-related documentation.
- Shared package peer dependency ranges may need adjustment to stay consistent with root, web, and mobile runtime versions.
- No new runtime subsystems or external services are introduced.

### Reviewer Guidance

Reviewers should focus on cohort boundaries, shared peer dependency alignment, React Native ecosystem synchronization, prerelease avoidance, and whether the proposed validation gates are sufficient before each merge point.

## Summary

Plan and execute dependency updates in bounded cohorts. Start with stable, low-risk updates across root and package manifests, then handle coordinated React Native and tooling changes as a separate stage, and keep major or ambiguous compatibility moves on hold until there is evidence that they are safe for this repository.

## Technical Context

**Language/Version**: TypeScript 6.0.x, JavaScript (ES modules in root/web), Node.js >=20.19.4, npm >=9.0.0
**Primary Dependencies**: React 19, React DOM 19, React Native 0.84.x, React Native Web 0.21.x, Vite 8, Jest 30, ESLint 10, Tailwind CSS 4, Marked 17
**Storage**: N/A
**Testing**: Jest, Testing Library, React Native Jest preset, coverage via `npm run test:ci`
**Target Platform**: Web via Vite and GitHub Pages, iOS and Android via React Native CLI, Node.js-based local and CI scripts
**Project Type**: Monorepo cross-platform application starter with shared package and package-specific manifests
**Performance Goals**: No material regression in build reliability, test execution, or application startup paths after each upgrade cohort
**Constraints**: Stable releases only, no prerelease adoption, preserve package boundary ownership, keep generated documentation as output-only, validate every cohort with repository quality gates
**Scale/Scope**: Four npm manifests directly in scope (root, web, mobile, shared), plus script-driven build, test, lint, deploy, and documentation workflows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Type Safety First**: PASS. Every implementation stage must keep strict TypeScript compatibility and run `npm run type-check` before merge.
- **II. Test-Backed Changes**: PASS WITH CONDITION. Dependency-only changes are expected to preserve behavior, but any observed behavior change or compatibility fix must include updated Jest coverage in the same change.
- **III. CI Quality Gates Before Release**: PASS. Each cohort must run `npm run lint`, `npm run type-check`, `npm run test:ci`, and `npm run security:check`, plus targeted build and startup smoke checks.
- **IV. Monorepo Boundaries and Shared-First Design**: PASS. Root, web, mobile, and shared manifests remain the only update surfaces; shared peer dependency alignment is handled in `packages/shared`.
- **V. Operational Clarity: Logging and Errors**: PASS. No production logging changes are planned.
- **VI. AI-Assisted Code Generation Consistency**: PASS. Plan contents align with the repository constitution and Copilot instructions.

**Post-Design Re-check**: PASS. Research, data model, quickstart, and contract notes preserve the same gates and do not introduce constitution violations.

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/001-safe-package-updates/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── README.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json
src/
packages/
├── shared/
│   ├── package.json
│   └── src/
├── web/
│   ├── package.json
│   ├── public/
│   └── src/
└── mobile/
    ├── package.json
    └── MobileApp/
scripts/
config/
documentation/
public/documentation/
android/
ios/
```

**Structure Decision**: This feature is planned as a monorepo manifest-and-tooling update. The implementation work is centered on the root manifest, package manifests under `packages/`, shared peer dependency declarations, and validation scripts already used by the repository.

## Execution Phases

### Phase 0: Research and Cohort Definition

1. Confirm which packages qualify for low-risk stable updates versus coordinated ecosystem upgrades.
2. Resolve hold items where `latest` is not automatically safe, including prerelease-looking targets and major-version parser changes.
3. Document validation and rollback expectations for each cohort.

### Phase 1: Design the Upgrade Model

1. Define the dependency cohort model, validation gates, hold rules, and workspace relationships.
2. Capture execution guidance for maintainers so implementation can proceed without broadening scope.
3. Record that no external API contract changes are expected for this feature.

### Phase 2: Implementation Planning Handoff

1. Break work into dependency-ordered tasks by cohort.
2. Keep low-risk updates, coordinated ecosystem moves, and hold-item investigations as separate task groups.
3. Require explicit validation evidence at the end of each task group.

## Active Execution Baseline

- **Audit date**: 2026-04-11
- **Cohort A entry criteria**: only stable patch/minor updates with no required cross-workspace ecosystem migration, limited to `package.json`, `packages/web/package.json`, and `packages/mobile/package.json`
- **Cohort A rollback checkpoint**: keep all Cohort A manifest edits and the resulting `package-lock.json` isolated from any React Native 0.85.0 work
- **Cohort B entry criteria**: begin only after Cohort A passes `lint`, `type-check`, `test:ci`, `security:check`, `npm run build`, `npm --prefix packages/web run build`, `npm --prefix packages/mobile run lint`, and `npm --prefix packages/mobile test`
- **Cohort B rollback checkpoint**: isolate `react-native` and `@react-native/*` changes to a separate manifest-and-lockfile revision before any hold-item investigation
- **Documentation boundary**: implementation may update feature artifacts under `.documentation/specs/001-safe-package-updates/` and maintainer docs under `documentation/`; generated content under `public/documentation/` remains output-only

## Execution Traceability

- **Phase 1 / Setup**: Completed on 2026-04-11 by re-running the dependency audit, confirming the source-documentation boundary, and recording the cohort baseline in the feature artifacts.
- **Phase 2 / Foundational**: Completed on 2026-04-11 by confirming the gate commands, peer-alignment target, and cohort status model.
- **Phase 3 / Cohort A**: Completed on 2026-04-11 with validated low-risk manifest updates across the root, web, and mobile package surfaces.
- **Phase 4 / Cohort B**: Completed on 2026-04-11 with validated React Native 0.85.0 upgrades, aligned `@react-native/*` tooling, updated shared peer expectations, and a mobile Jest preset migration.
- **Phase 5 / Cohort C**: Deferred items documented; no manifest changes applied.
- **Phase 6 / Polish**: Validation sweep complete. Maintainer-facing broad documentation updates remain optional because no setup or runtime workflow changed beyond dependency and test-surface maintenance.

## Complexity Tracking

No constitution exceptions are expected for this feature.

