# Data Model: Safe Package Updates

## Entity: Workspace Manifest

- **Purpose**: Represents each manifest that participates in dependency planning.
- **Fields**:
  - `name`: logical workspace name (`root`, `web`, `mobile`, `shared`)
  - `path`: manifest path
  - `role`: runtime app, shared package, or tooling root
  - `validationScope`: commands and smoke checks relevant to that workspace
- **Relationships**:
  - Owns many `Package Update Candidate` records
  - Participates in one or more `Dependency Cohort` records

### Current Workspace Validation Scope

- `root`: `npm run lint`, `npm run type-check`, `npm run test:ci`, `npm run security:check`, `npm run build`
- `web`: `npm --prefix packages/web run build`
- `mobile`: `npm --prefix packages/mobile run lint`, `npm --prefix packages/mobile test`
- `shared`: peer dependency compatibility review against the runtime versions declared in the root, web, and mobile manifests

## Entity: Package Update Candidate

- **Purpose**: Describes a single package version move under consideration.
- **Fields**:
  - `packageName`
  - `workspace`
  - `currentVersion`
  - `targetVersion`
  - `updateType`: patch, minor, major, or coordinated ecosystem update
  - `riskLevel`: low, medium, high
  - `reason`: why the update is proposed or deferred
  - `status`: ready, staged, hold, or rejected
- **Relationships**:
  - Belongs to one `Workspace Manifest`
  - Belongs to one `Dependency Cohort`
  - May require one or more `Validation Gate` records

## Entity: Dependency Cohort

- **Purpose**: Groups package updates that must be applied and validated together.
- **Fields**:
  - `cohortId`: `A`, `B`, or `C`
  - `name`
  - `riskLevel`
  - `entryCriteria`
  - `rollbackCheckpoint`
  - `packagesIncluded`
  - `packagesExcluded`
- **Relationships**:
  - Contains many `Package Update Candidate` records
  - References many `Validation Gate` records

## Entity: Validation Gate

- **Purpose**: Captures required evidence before a cohort can be considered complete.
- **Fields**:
  - `name`
  - `commandOrCheck`
  - `scope`: root, web, mobile, shared, or cross-repo
  - `requiredForCohorts`
  - `failureAction`: stop, rollback, or investigate
- **Relationships**:
  - Can be attached to many `Dependency Cohort` records

## Entity: Hold Decision

- **Purpose**: Records why a package does not move in the current implementation pass.
- **Fields**:
  - `packageName`
  - `blockingConcern`
  - `evidenceRequired`
  - `nextReviewTrigger`
- **Relationships**:
  - References one `Package Update Candidate`

## State Transitions

- `Package Update Candidate`: `ready` -> `staged` -> `validated` or `hold`
- `Dependency Cohort`: `planned` -> `in-progress` -> `validated` or `rolled-back`
- `Hold Decision`: `open` -> `researched` -> `ready-for-future-plan`

## Current Cohort Status

- `Cohort A`: `validated`, manifest and lockfile updates completed on 2026-04-11
- `Cohort B`: `validated`, coordinated React Native updates and peer-alignment changes completed on 2026-04-11
- `Cohort C`: `open`, awaiting compatibility evidence rather than immediate manifest edits
