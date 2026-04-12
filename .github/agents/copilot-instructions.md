# Copilot Instructions for React Native Web Start

This file defines repository-specific guidance for AI-assisted code generation.
For governance authority, see [../../.documentation/memory/constitution.md](../../.documentation/memory/constitution.md).

## Authority and Alignment

1. The constitution at `/.documentation/memory/constitution.md` is the normative source for engineering policy.
2. If this file and the constitution conflict, follow the constitution.
3. Code generation SHOULD explicitly align with constitution principles, especially:
   - Type Safety First
   - Test-Backed Changes
   - CI Quality Gates Before Release
   - Monorepo Boundaries and Shared-First Design

## Code Generation Defaults

1. Prefer changes in shared package paths for cross-platform behavior (`packages/shared/src/**`) unless a platform-specific requirement is documented.
2. Keep platform-specific logic within package boundaries (`packages/web/**`, `packages/mobile/**`).
3. For behavior changes, add or update Jest tests in the same change (`__tests__` or `*.test.*`).
4. Maintain strict TypeScript compatibility; avoid broad `any`, blanket suppressions, and unchecked casts.
5. Keep logs intentional and actionable; avoid noisy production console output.

## Documentation and Build Artifacts

1. Treat `documentation/**` as the source of truth for project documentation.
2. Treat `public/documentation/**` and `dist/**` as generated artifacts.
3. Do not introduce manual source edits in generated output directories.
4. When documentation behavior changes, update relevant docs and scripts together.

## Validation Expectations

For implementation-oriented changes, prefer to validate with repository scripts when feasible:

1. `npm run lint`
2. `npm run type-check`
3. `npm run test:ci`
4. `npm run security:check`

When full validation is not run, call out what was not executed.

## Maintenance

1. Keep this file and the constitution mutually consistent.
2. If workflow or governance expectations change, update both:
   - `/.github/agents/copilot-instructions.md`
   - `/.github/copilot-instructions.md`
   - `/.documentation/memory/constitution.md`
