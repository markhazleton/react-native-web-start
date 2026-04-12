# Quickstart: Safe Package Updates

## Goal

Execute dependency upgrades in bounded cohorts so the repository can move toward latest stable releases without losing build, test, or deployment confidence.

## Prerequisites

- Node.js 20.19.4 or newer
- npm 9 or newer
- Repository dependencies installed for the root and package-specific manifests
- Working branch: `001-safe-package-updates`

## Recommended Sequence

1. Re-run the dependency audit at the root and in package manifests to confirm candidate versions have not changed.
2. Apply Cohort A low-risk updates first.
3. Run repository quality gates and targeted smoke checks.
4. Commit or checkpoint the low-risk state before attempting Cohort B.
5. Apply Cohort B coordinated React Native ecosystem updates together.
6. Re-run quality gates plus mobile startup checks and web build verification.
7. Leave Cohort C packages untouched unless their compatibility evidence is updated and the plan is amended.

## Validation Commands

Run these from the repository root unless a workspace-specific check is noted.

```powershell
npm run lint
npm run type-check
npm run test:ci
npm run security:check
npm run build
npm --prefix packages/web run build
```

For mobile-oriented stages, also smoke-check the mobile toolchain entry points after dependency installation.

```powershell
npm --prefix packages/mobile test
npm --prefix packages/mobile run lint
```

## Current Cohort Baseline

- Cohort A candidates confirmed on 2026-04-11: `react`, `react-dom`, `react-test-renderer`, `vite`, `eslint`, and `prettier` where already present in the affected manifests
- Cohort B remains limited to `react-native` and aligned `@react-native/*` packages in the root and mobile manifests, plus any necessary peer-alignment update in `packages/shared/package.json`
- Cohort C remains limited to `marked`, `@types/marked`, and future TypeScript-line adoption beyond the currently selected stable line
- Do not edit `public/documentation/**` directly while executing these stages; only source docs under `documentation/**` and feature docs under `.documentation/specs/001-safe-package-updates/**`

## Rollback Guidance

- Do not mix Cohort A and Cohort B into the same uncheckpointed change set.
- Treat the post-Cohort-A validated `package-lock.json` as the first rollback checkpoint.
- If a gate fails, revert only the current cohort and keep the previous validated cohort intact.
- If a hold item becomes necessary to unblock a cohort, stop and update the plan rather than widening the stage ad hoc.

## Expected Outcome

After following this sequence, maintainers should have one validated low-risk update stage, one separately validated coordinated ecosystem stage, and a documented list of deferred packages that still need compatibility investigation.

## Execution Status: 2026-04-11

- Cohort A completed and validated with `npm run lint`, `npm run type-check`, `npm run test:ci`, `npm run security:check`, `npm run build`, `npm --prefix packages/web run build`, `npm --prefix packages/mobile run lint`, and `npm --prefix packages/mobile test`.
- Cohort B completed and validated with the same command set after migrating the mobile test surface to the React Native 0.85.0 Jest preset model.
- The current rollback checkpoint is the validated post-Cohort-B `package-lock.json` plus the manifest state in `package.json`, `packages/web/package.json`, `packages/mobile/package.json`, and `packages/shared/package.json`.
- Hold items remain unchanged in the manifests pending the compatibility evidence described in `research.md`.
