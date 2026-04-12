# Contracts

This feature does not introduce or modify external API contracts.

The only contracts that must remain stable during implementation are internal repository contracts:

- package manifest ownership by workspace (`root`, `packages/web`, `packages/mobile`, `packages/shared`)
- shared peer dependency compatibility with the runtime packages used by web and mobile
- CI and release command surfaces defined in the root and package `scripts` sections
- source documentation ownership in `documentation/**`, with `public/documentation/**` treated as generated output rather than an editable source

If implementation expands beyond internal manifest and validation changes, add a contract document in this folder before proceeding.