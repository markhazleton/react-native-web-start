# TypeScript 7 and Babel 8 migration plan

Reviewed October 20, 2026 against the root baseline at `2bef9db`.
This is a proposed plan; no dependency or application changes are included.

## Recommendation

Use separate pull requests. Adopt the TypeScript 7 compiler with the supported
TypeScript 6 API compatibility package first. Keep the React Native transform
chain on Babel 7 until an upstream-supported Babel 8 path is available.
An earlier web/test-only Babel 8 migration is possible as an experiment, but
would intentionally leave a second Babel 7 installation for native tooling.
It would not constitute a complete migration.

## Confirmed blockers and validation gaps

| Area | Evidence in this repository | Resolution / exit condition |
| --- | --- | --- |
| TypeScript 7 replacing the TypeScript API | `@typescript-eslint/parser` 8.72.0 declares TypeScript `>=4.8.4 <6.1.0`. The installed ESLint plugin explicitly throws when it loads TypeScript major 7. Our prior direct upgrade reproduced this failure. | Keep the TS 6 API under the `typescript` package name and install TS 7 under an alias. A TS-7-only installation must wait for compatible tooling. |
| React Native Babel preset | `@react-native/babel-preset` 0.88.0 depends on `@babel/core ^7.25.2` and numerous Babel 7 transforms, including transform-runtime. | Adopt a React Native preset with documented Babel 8 support, or explicitly isolate the native Babel 7 chain. Do not force all transitive Babel packages to 8. |
| Metro and codegen | `@react-native/metro-babel-transformer` 0.88.0 directly depends on Babel core 7 and the RN preset; RN's Babel codegen plugin uses `@babel/traverse ^7.29.0`. | Verify Metro, preset, parser, codegen, and runtime together with the chosen RN release. Updating root Babel core alone leaves Babel 7 installed. |
| Node versions | Root engines allow Node 22.13 and 24.3; Babel core 8.0.7 requires `^22.18.0 || >=24.11.0`. | Raise the declared minimum and align local development and CI. Recommend supported Node 24 releases >=24.11.0 for migration checks. |
| Transform behavior | Babel 8 ships as ESM and changes plugin requirements/defaults. The RN preset currently passes `helpers` and `regenerator` options to its Babel 7 runtime transform. | Verify configuration loading, transform APIs, runtime options, helper imports, JSX, class fields, Flow parsing, and codegen against Babel 8. |
| Native verification | Existing 55 tests map `react-native` to `react-native-web`; the deployed build is web-only. | Passing web tests cannot establish native compatibility. Require Metro bundles plus Android/iOS builds and smoke tests before claiming full migration. |

`babel-jest` 30.5.2 already declares `@babel/core ^7.11.0 || ^8.0.0-0`.
It is not a confirmed dependency blocker. Its actual transforms, Jest mocks,
coverage instrumentation, and ESM interoperability still need validation.
The `.cjs` config filename alone is not proof of incompatibility.

Likewise, Babel runtime 8 alone has not been demonstrated to fail here. The
reason for deferral is the unsupported mixed transform/helper chain, not a
reproduced runtime-8 application failure. Validate helper exports and generated
imports instead of assuming a version bump is sufficient.

## PR 1 — TypeScript 7 compiler with TS 6 API compatibility

1. Create a migration branch from the passing baseline. Preserve unrelated
   generated-file deletions. Keep Babel and React Native versions unchanged.
2. Use Microsoft's documented dependency layout:

   ```json
   {
     "devDependencies": {
       "@typescript/native": "npm:typescript@^7.0.2",
       "typescript": "npm:@typescript/typescript6@^6.0.2"
     }
   }
   ```

   TS 7 supplies `tsc`; the compatibility package supplies `tsc6` and the API
   imported as `typescript` by ESLint. Verify both executable versions and
   `require('typescript').version` after installation. Do not rely on a globally
   installed compiler or `legacy-peer-deps` to resolve the API mismatch.
3. Refresh the lockfile. Remove `ignoreDeprecations: "6.0"` from the root
   tsconfig and resolve any exposed obsolete settings rather than suppressing
   them. Compare diagnostics using `tsc` and `tsc6`.
4. Validate `tsconfig.json` and the referenced Vite config separately. The
   existing `tsc --noEmit` is not proof that every referenced project was checked.
   Add an explicit Vite-config check if needed; keep shared-library emit checks
   separate from application no-emit checks.
5. Add CI assertions showing the compiler and API versions. Run fresh `npm ci`,
   lint, type checks, all tests with coverage, and the production build on Windows
   and Linux. Check editor diagnostics and one watch-mode edit/rebuild cycle.
6. Review alias handling in Dependabot and npm-check-updates. Avoid allowing an
   automated update to replace the compatibility alias with plain TypeScript 7.

Acceptance: TS 7 runs the application type check; ESLint loads the TS 6 API;
both environments pass existing checks; compiler timings and any diagnostic
differences are recorded. This is compiler adoption, not removal of TS 6.

Rollback: revert this PR and its lockfile together. Remove the compatibility
package only after a released typescript-eslint version supports the new API
and the same checks pass without TS 6. Do not assume TS 7.1 alone clears this gate.

## PR 2 — Babel 8 readiness and native scope

1. Recheck released RN, Metro, preset, parser, and codegen metadata. Prefer a
   coordinated upstream release to custom overrides or a fork of the RN preset.
2. Decide which native target is maintained. Root RN is 0.88.0; the separate
   local Expo scaffold uses SDK 57 / RN 0.86.2 and is not tracked in HEAD on this
   checkout. A root upgrade does not migrate that app. Include its SDK-prescribed
   Babel configuration only in a separate Expo migration if it is brought into
   scope. Confirm any future workspace or tracking changes separately.
3. Raise Node requirements for Babel 8 and document the local setup. Keep CI on
   a supported Node 24 release meeting Babel's minimum.
4. Inventory the actual Babel dependency tree and helper imports with `npm ls`.
   Review Babel's migration guide for ESM loading, JSX runtime, TypeScript/Flow
   transforms, class-field semantics, targets, and runtime-transform options.
5. Treat upstream-supported native transforms as the gate for the full upgrade.
   If unavailable, leave this PR as a readiness change; do not force a global
   Babel 8 override simply to eliminate Babel 7 from the lockfile.

Optional earlier experiment: give Jest a separate explicit Babel 8 configuration
for web tests while preserving native Babel 7. Vite 8 with plugin-react 6 has
its own transform path; inspect whether it uses Babel before modifying it.
The experiment must prove Jest mock hoisting, dependency transformation,
source maps, and coverage. Prefer the single supported toolchain if maintaining
two transform configurations provides no practical benefit.

## PR 3 — Coordinated Babel 8 migration

After PR 2's upstream gate clears:

1. Upgrade the supported RN/Metro/preset/codegen chain and Babel core/runtime
   together. Follow that RN release's native template changes, not just npm
   version changes. Do not reintroduce unused preset-env merely to update it.
2. Adjust only the config options required by the supported chain; explicitly
   preserve intended JSX runtime and class-field behavior.
3. Test fresh installs and the full web suite/build on Windows and Linux. Compare
   coverage, emitted helper imports, and bundle behavior with the baseline.
4. Generate development and production Metro bundles for both native platforms;
   run codegen and build Android and iOS on appropriate hosts. Exercise startup,
   navigation, documentation rendering, and network/error states on web and
   native. Check release builds, not just development bundles.
5. Inspect remaining Babel 7 paths and document any intentional ones. Re-run
   audit; upgrading these compilers does not itself fix the unpatched braces
   and sprintf-js advisories.

Acceptance: CI/deployment passes; the supported native chain uses Babel 8;
native builds and smoke tests pass; no unexplained helper/transform mismatch
remains. Roll back the coordinated PR if any platform fails.

## References

- [Microsoft: TypeScript 7 side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0)
- [typescript-eslint: TypeScript 7.0.2 support](https://github.com/typescript-eslint/typescript-eslint/issues/12518)
- [typescript-eslint: new API support tracking](https://github.com/typescript-eslint/typescript-eslint/issues/10940)
- [Babel 8 migration guide](https://babeljs.io/docs/v8-migration)
- [Babel 8 integration API migration](https://babeljs.io/docs/v8-migration-api)

Dependency evidence was checked using npm registry metadata for the installed
versions and latest releases of `@typescript-eslint/parser`, `babel-jest`,
`@react-native/babel-preset`, `@react-native/metro-babel-transformer`,
`@react-native/babel-plugin-codegen`, `@babel/core`, and `@vitejs/plugin-react`.
Recheck these versions when implementation starts; no upstream release date is
assumed by this plan.
