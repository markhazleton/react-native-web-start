# Tasks: Safe Package Updates

**Input**: Design documents from `/.documentation/specs/001-safe-package-updates/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `quickstart.md`, `contracts/README.md`

**Tests**: No new Jest coverage is planned by default because this feature changes dependency manifests rather than product behavior. Validation tasks are still required because the constitution and quickstart require `lint`, `type-check`, `test:ci`, `security:check`, and targeted web/mobile smoke checks for each executable cohort.

**Organization**: Tasks are grouped into three independently reviewable user stories that map to the upgrade cohorts defined in the plan and research artifacts.

## Rationale Summary

### Core Problem

The repository has drift across the root, web, mobile, and shared package manifests. A single jump to latest versions would mix low-risk updates with coordinated ecosystem upgrades, making rollback and diagnosis unnecessarily difficult.

### Decision Summary

Execute the upgrade work in three cohorts: safe-now stable updates first, coordinated React Native ecosystem changes second, and deferred hold-item investigation last. Each cohort must preserve monorepo package ownership and clear the repository quality gates before the next cohort begins.

### Key Drivers

- Reduce dependency drift without destabilizing web, mobile, or CI workflows.
- Keep React Native and `@react-native/*` tooling aligned across the root and mobile manifests.
- Treat `documentation/**` as the source-of-truth doc surface and avoid manual source edits under `public/documentation/**`.

### Reviewer Guidance

Reviewers should focus on cohort boundaries, rollback checkpoints, peer dependency alignment in `packages/shared/package.json`, stable-release-only adoption, and whether each validation step matches the scripts that actually exist in this repository.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because the task edits different files or gathers independent evidence.
- **[Story]**: User story label for the implementation cohort (`[US1]`, `[US2]`, `[US3]`).
- Every task includes an exact repository file path.

## Path Conventions

- Root workspace manifest and lockfile: `package.json`, `package-lock.json`
- Web workspace manifest: `packages/web/package.json`
- Mobile workspace manifest: `packages/mobile/package.json`
- Shared peer dependency surface: `packages/shared/package.json`
- Feature planning artifacts: `.documentation/specs/001-safe-package-updates/`
- Maintainer-facing source docs only: `documentation/`

## Phase 1: Setup (Stage Baseline)

**Purpose**: Reconfirm the execution baseline and document the exact scope before any manifest changes are made.

- [x] T001 Re-run the dependency candidate review against `package.json`, `packages/web/package.json`, `packages/mobile/package.json`, and `packages/shared/package.json`
- [x] T002 Capture the active cohort boundaries, stage entry criteria, and rollback checkpoints in `.documentation/specs/001-safe-package-updates/plan.md` and `.documentation/specs/001-safe-package-updates/quickstart.md`
- [x] T003 [P] Reconfirm source-versus-generated documentation boundaries in `.documentation/specs/001-safe-package-updates/contracts/README.md` and `documentation/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared rules and validation surfaces that block all executable upgrade work until complete.

**⚠️ CRITICAL**: No manifest updates should begin until this phase is complete.

- [x] T004 Define the executable cohort matrix, package statuses, and hold rules in `.documentation/specs/001-safe-package-updates/research.md` and `.documentation/specs/001-safe-package-updates/data-model.md`
- [x] T005 [P] Confirm the required repository gate commands and smoke-check command surfaces in `package.json`, `packages/web/package.json`, and `packages/mobile/package.json`
- [x] T006 [P] Confirm the shared peer dependency alignment target for React and React Native in `packages/shared/package.json` and `.documentation/specs/001-safe-package-updates/plan.md`

**Checkpoint**: Cohort rules, validation commands, and shared ownership boundaries are ready.

---

## Phase 3: User Story 1 - Cohort A Safe Stable Updates (Priority: P1) 🎯 MVP

**Goal**: Apply the stable updates that can move immediately with low compatibility risk.

**Independent Test**: The low-risk changes in `package.json`, `packages/web/package.json`, and `packages/mobile/package.json` install cleanly, regenerate `package-lock.json`, and pass `lint`, `type-check`, `test:ci`, `security:check`, `npm run build`, `npm --prefix packages/web run build`, `npm --prefix packages/mobile run lint`, and `npm --prefix packages/mobile test`.

### Implementation for User Story 1

- [x] T007 [P] [US1] Update the low-risk root packages in `package.json`, including `react`, `react-dom`, and compatible root type/tooling packages that remain in the current stable line
- [x] T008 [P] [US1] Update the low-risk web workspace packages in `packages/web/package.json`, including `react`, `react-dom`, and `vite`
- [x] T009 [P] [US1] Update the low-risk mobile workspace tooling packages in `packages/mobile/package.json`, including `eslint` and `prettier`
- [x] T010 [US1] Regenerate the resolved workspace dependency graph in `package-lock.json` after the Cohort A manifest edits in `package.json`, `packages/web/package.json`, and `packages/mobile/package.json`
- [x] T011 [US1] Run the Cohort A repository lint gate defined in `package.json`
- [x] T012 [US1] Run the Cohort A repository type-check gate defined in `package.json`
- [x] T013 [US1] Run the Cohort A repository `test:ci` gate defined in `package.json`
- [x] T014 [US1] Run the Cohort A repository security gate defined in `package.json`
- [x] T015 [US1] Run the Cohort A root and web build smoke checks defined in `package.json` and `packages/web/package.json`
- [x] T016 [US1] Run the Cohort A mobile smoke checks defined in `packages/mobile/package.json`

**Checkpoint**: Cohort A is validated and can be checkpointed before any coordinated React Native changes begin.

---

## Phase 4: User Story 2 - Cohort B Coordinated React Native Ecosystem Updates (Priority: P2)

**Goal**: Upgrade the React Native runtime and aligned tooling as one synchronized cohort across the root, mobile, and shared package surfaces.

**Independent Test**: The coordinated changes in `package.json`, `packages/mobile/package.json`, and `packages/shared/package.json` regenerate `package-lock.json`, preserve peer compatibility, and pass the same repository gates plus targeted web and mobile smoke checks.

### Implementation for User Story 2

- [x] T017 [P] [US2] Update `react-native` and the root `@react-native/*` toolchain packages together in `package.json`
- [x] T018 [P] [US2] Update `react-native` and aligned `@react-native/*` tooling together in `packages/mobile/package.json`
- [x] T019 [P] [US2] Reconcile React and React Native peer dependency expectations in `packages/shared/package.json`
- [x] T020 [US2] Regenerate the resolved workspace dependency graph in `package-lock.json` after the coordinated cohort edits in `package.json`, `packages/mobile/package.json`, and `packages/shared/package.json`
- [x] T021 [US2] Run the Cohort B repository lint gate defined in `package.json`
- [x] T022 [US2] Run the Cohort B repository type-check gate defined in `package.json`
- [x] T023 [US2] Run the Cohort B repository `test:ci` gate defined in `package.json`
- [x] T024 [US2] Run the Cohort B repository security gate defined in `package.json`
- [x] T025 [US2] Run the Cohort B root and web build smoke checks defined in `package.json` and `packages/web/package.json`
- [x] T026 [US2] Run the Cohort B mobile startup, lint, and test smoke checks defined in `packages/mobile/package.json`

**Checkpoint**: The React Native ecosystem upgrade is validated as one cohort and stays isolated from deferred hold items.

---

## Phase 5: User Story 3 - Cohort C Deferred Hold Decisions (Priority: P3)

**Goal**: Preserve safety by documenting which upgrades remain deferred and what evidence must exist before they can move.

**Independent Test**: The hold decisions for `marked`, `@types/marked`, and future TypeScript-line changes are documented in the feature artifacts, and those deferred moves remain excluded from `package.json`, `packages/web/package.json`, `packages/mobile/package.json`, and `packages/shared/package.json`.

### Implementation for User Story 3

- [x] T027 [P] [US3] Re-check `marked` and `@types/marked` compatibility evidence against `package.json` and `.documentation/specs/001-safe-package-updates/research.md`
- [x] T028 [P] [US3] Re-check stable TypeScript adoption criteria against `package.json`, `packages/web/package.json`, and `.documentation/specs/001-safe-package-updates/research.md`
- [x] T029 [US3] Record the deferred-package rationale, required evidence, and next review trigger in `.documentation/specs/001-safe-package-updates/research.md`, `.documentation/specs/001-safe-package-updates/data-model.md`, and `.documentation/specs/001-safe-package-updates/quickstart.md`
- [x] T030 [US3] Verify the deferred packages remain unchanged in `package.json`, `packages/web/package.json`, `packages/mobile/package.json`, and `packages/shared/package.json`

**Checkpoint**: Deferred items are explicit, justified, and separated from the executable upgrade cohorts.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Close out the staged plan with final traceability, maintainer guidance, and one last validation pass.

- [x] T031 [P] Update rollout traceability, rollback notes, and validation checkpoints in `.documentation/specs/001-safe-package-updates/plan.md` and `.documentation/specs/001-safe-package-updates/quickstart.md`
- [x] T032 [P] Update maintainer-facing source documentation impacted by the upgrade outcome in `documentation/COMPLETE_SETUP_GUIDE.md` and `documentation/PROJECT_SUMMARY.md`
- [x] T033 Run the final full validation sweep using the command surfaces in `package.json`, `packages/web/package.json`, and `packages/mobile/package.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately and establishes the bounded upgrade scope.
- **Foundational (Phase 2)**: Depends on Setup and blocks all manifest changes.
- **User Story 1 (Phase 3 / P1)**: Depends on Foundational and is the recommended MVP checkpoint.
- **User Story 2 (Phase 4 / P2)**: Depends on validated completion of User Story 1.
- **User Story 3 (Phase 5 / P3)**: Can gather evidence earlier, but its hold decisions should close after the executable cohorts are settled.
- **Polish (Phase 6)**: Depends on the desired cohorts being complete and validated.

### User Story Dependencies

- **US1**: First deliverable and rollback checkpoint.
- **US2**: Starts only after US1 is validated and checkpointed.
- **US3**: Documents what remains deferred after the executable path is confirmed.

### Within Each User Story

- Manifest edits come before `package-lock.json` regeneration.
- Lockfile regeneration comes before repository gates.
- Repository gates run before targeted smoke checks are considered complete.
- Each cohort must be checkpointed before work starts on the next cohort.

### Parallel Opportunities

- **Phase 1**: `T003` can run while `T001` and `T002` are in progress.
- **Phase 2**: `T005` and `T006` can run in parallel after `T004`.
- **US1**: `T007`, `T008`, and `T009` can run in parallel before `T010`.
- **US2**: `T017`, `T018`, and `T019` can run in parallel before `T020`.
- **US3**: `T027` and `T028` can run in parallel before `T029`.
- **Phase 6**: `T031` and `T032` can run in parallel before `T033`.

---

## Parallel Example: User Story 1

```text
T007 Update the low-risk root packages in package.json
T008 Update the low-risk web workspace packages in packages/web/package.json
T009 Update the low-risk mobile workspace tooling packages in packages/mobile/package.json
```

## Parallel Example: User Story 2

```text
T017 Update react-native and the root @react-native/* toolchain packages together in package.json
T018 Update react-native and aligned @react-native/* tooling together in packages/mobile/package.json
T019 Reconcile React and React Native peer dependency expectations in packages/shared/package.json
```

## Parallel Example: User Story 3

```text
T027 Re-check marked and @types/marked compatibility evidence against package.json and research.md
T028 Re-check stable TypeScript adoption criteria against package.json, packages/web/package.json, and research.md
```

---

## Gate Acknowledgements

No unresolved checklist, analyze, critic, or gate findings were present when this task list was generated.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1.
2. Complete Phase 2.
3. Complete Phase 3.
4. Stop and validate the low-risk cohort before opening coordinated React Native work.

### Incremental Delivery

1. Reconfirm the stage baseline and shared rules.
2. Land Cohort A and checkpoint it.
3. Land Cohort B and checkpoint it separately.
4. Close Cohort C with explicit hold decisions and future evidence requirements.
5. Finish with source-doc updates only and a final validation pass.

### Parallel Team Strategy

1. One contributor owns `package.json` and `package-lock.json`.
2. One contributor owns `packages/web/package.json` and `packages/mobile/package.json`.
3. One contributor owns `packages/shared/package.json` and `.documentation/specs/001-safe-package-updates/` follow-up artifacts.

---

## Notes

- `[P]` tasks target different files or independent evidence gathering.
- Any behavior changes discovered during dependency work must add Jest coverage in the same change per the constitution.
- `documentation/**` is the editable documentation source; do not treat `public/documentation/**` as a source surface.
- Capture validation evidence per cohort before moving to the next stage.