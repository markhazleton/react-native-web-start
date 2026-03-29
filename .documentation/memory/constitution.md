<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. Type Safety First (NON-NEGOTIABLE)
  - Template Principle 2 -> II. Test-Backed Changes (NON-NEGOTIABLE)
  - Template Principle 3 -> III. CI Quality Gates Before Release (NON-NEGOTIABLE)
  - Template Principle 4 -> IV. Monorepo Boundaries and Shared-First Design
  - Template Principle 5 -> V. Operational Clarity: Logging and Errors
- Added sections: Additional Constraints, Development Workflow
- Removed sections: None
- Templates requiring updates:
  - ✅ updated: .documentation/templates/plan-template.md
  - ✅ updated: .documentation/templates/spec-template.md
  - ✅ updated: .documentation/templates/tasks-template.md
  - ✅ updated: documentation/README.md
- Follow-up TODOs: None
-->

# React Native Web Start Constitution

## Core Principles

### I. Type Safety First (NON-NEGOTIABLE)
All TypeScript code MUST compile under strict settings and preserve type integrity
across shared and platform-specific packages. New code MUST NOT weaken strictness
via broad suppressions, untyped fallbacks, or unchecked boundary casts.

Rationale: strict typing is already a stable project baseline and is one of the
lowest-cost safeguards against regressions in cross-platform shared code.

### II. Test-Backed Changes (NON-NEGOTIABLE)
Every behavior-changing change MUST include updated or new Jest tests using the
existing discovery conventions: `__tests__` or `*.test.*`. Test updates MUST be
completed in the same change where behavior is introduced or modified.

Rationale: this repository already runs Jest in CI and the convention is
consistent; codifying it keeps delivery speed while limiting behavior drift.

### III. CI Quality Gates Before Release (NON-NEGOTIABLE)
Release workflows targeting mainline deployment MUST run, and pass, lint,
type-check, tests, and security checks. Any failure in these gates MUST block
deployment until resolved.

Rationale: these gates are already wired into deployment automation and are the
project's enforceable baseline for release quality.

### IV. Monorepo Boundaries and Shared-First Design
Cross-platform behavior MUST be implemented in shared package paths unless there
is a documented platform-specific requirement. Platform-specific logic MUST
remain inside the corresponding package boundary.

Rationale: shared-first structure reduces duplicate logic and keeps platform
variance explicit and maintainable.

### V. Operational Clarity: Logging and Errors
Runtime paths SHOULD use intentional log levels and actionable error messages.
Console logging in production-facing paths SHOULD be minimized and reviewed;
script and tooling logs MAY be verbose when they improve diagnosis.

Rationale: current logging is useful but inconsistent. Explicit guidance enables
gradual standardization without disrupting existing workflows.

## Additional Constraints

- Node.js and npm engine baselines defined in `package.json` MUST be honored.
- Formatting and linting MUST use repository-configured tools and config files.
- Security checks MUST stay integrated in CI for deployment-bound workflows.
- Coverage thresholds MAY evolve incrementally, but any reduction in thresholds
	MUST be explicitly justified in a pull request.

## Development Workflow

1. Changes MUST map to a user-facing or maintainability outcome.
2. Behavior-changing work MUST include tests in the same change.
3. Pull requests SHOULD include evidence of local lint, type-check, and tests.
4. Mainline merges intended for release MUST remain compatible with CI gates.
5. Documentation updates SHOULD accompany structural or workflow changes.

## Governance
This constitution supersedes ad-hoc development preferences for this repository.
In conflicts, this document takes precedence over generated templates unless a
template is explicitly amended to align.

Amendment Procedure:
1. Propose amendments through a pull request that includes a rationale,
	 migration impact, and any required template updates.
2. At least one maintainer approval is required before merge.
3. Ratified amendments MUST update impacted templates in the same change.

Versioning Policy:
- MAJOR: backward-incompatible governance or principle removals/redefinitions.
- MINOR: new principle/section or materially expanded obligations.
- PATCH: clarifications, wording, typo fixes, and non-semantic refinements.

Compliance Review Expectations:
- Planning artifacts MUST include a constitution check before implementation.
- Task artifacts MUST reflect test and quality-gate obligations.
- Reviewers SHOULD reject changes that violate NON-NEGOTIABLE principles.

**Version**: 1.0.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
