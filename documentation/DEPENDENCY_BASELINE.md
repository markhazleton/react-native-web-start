# Dependency baseline — October 20, 2026

The root npm project is the tracked installation and web validation target. It
does not declare npm workspaces. The manifests under `packages/` are separate
scaffolds; do not assume a root install installs or validates them.

## Changes and validation

- Removed nine unused root development dependencies: `@babel/preset-env`,
  `@react-native/eslint-config`, `@react-native/typescript-config`,
  `@testing-library/jest-native`, `@testing-library/react-native`,
  `@testing-library/user-event`, `@types/react-test-renderer`,
  `metro-react-native-babel-preset`, and `react-test-renderer`.
- Updated `@babel/runtime` to 7.29.10 and refreshed the root lockfile, preserving
  the existing `babel-plugin-istanbul` 8.0.2 update.
- Kept Babel 7 because `@react-native/babel-preset` 0.88.0 depends on Babel 7.
  Kept TypeScript 6.0.3: a trial of 7.0.2 passed type checking but failed lint
  because typescript-eslint explicitly rejects the TypeScript 7.0 API.
- Added build metadata generation before type checking and all test scripts so
  validation works after `npm run clean`.
- Simplified the browser entry to React DOM; native registration stays in the
  native entry, whose broken App import now points to the shared App.
- Aligned the Node engine with React Native 0.88.0 and switched deployment CI
  from Node 20 to Node 24 and from `npm install` to `npm ci`.

Root checks: `npm ci`, `npm run lint`, `npm run type-check`,
`npm run test:ci -- --runInBand`, and `npm run build`.
All 13 test suites / 55 tests pass. Native Android/iOS builds were not run.
The web build has an existing large vendor chunk warning and Vite warns about
the config's use of `__dirname` with its future native config loader.

## Audit: unresolved upstream advisories

`npm audit` reports **46 affected packages** (29 high, 17 moderate), propagated
from two underlying advisories. There are no critical findings in the root
installation. `npm audit --omit=dev` still reports 8 affected packages because
React Native includes Metro in its dependency tree; do not call this a zero
vulnerability production install.

| Package | Advisory | Published fix | Dependency path examples |
| --- | --- | --- | --- |
| braces | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | None | React Native / Metro and CLI → micromatch → braces 3.0.3 |
| sprintf-js | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) | None | Jest / babel-jest → babel-plugin-istanbul → load-nyc-config → js-yaml 3 → argparse → sprintf-js 1.0.3 |

These advisories involve attacker-controlled glob patterns or format strings.
No such input path was established in the shipped browser application during
this dependency review. This is a scope observation, not a dismissal of the
advisories. Keep alerts visible and revisit when upstream fixes are published.
Do not use `npm audit fix --force`: its suggested major downgrades do not provide
a compatible current React Native / Jest baseline. CI continues reporting the
audit without blocking deployment, as before; the stale image-size comment was
replaced with the current outstanding advisories.

## Outdated and unused package review

After cleanup, `npm outdated` reports only `@babel/core`, `@babel/runtime`
(Babel 8), and `typescript` (7.0.2). These are deliberate compatibility holds.
All installed root direct dependencies satisfy their declared ranges.

Knip was run with `npx --yes knip --no-progress --reporter compact`. Its remaining
root dependency candidates are intentional: Babel runtime supplies helpers
injected by the React Native preset; `@react-native/jest-preset` is referenced
by the separate mobile scaffold's Jest configuration. Mobile entry files,
service workers, platform variants, and scripts invoked from other scripts
need manual review rather than automatic deletion. No unused application source
files were removed. The optional standalone `css:build*` scripts still use the
old Tailwind CLI convention; the validated web build uses Vite/PostCSS instead.

## GitHub pull request and alert triage

Reviewed 11 open Dependabot PRs. No remote PRs were merged or closed and no
alerts were dismissed. Once this baseline reaches the default branch, recheck
the alerts and close superseded PRs if Dependabot has not done so automatically.

| PRs | Disposition |
| --- | --- |
| [#96](https://github.com/markhazleton/react-native-web-start/pull/96), [#95](https://github.com/markhazleton/react-native-web-start/pull/95), [#94](https://github.com/markhazleton/react-native-web-start/pull/94), [#93](https://github.com/markhazleton/react-native-web-start/pull/93), [#92](https://github.com/markhazleton/react-native-web-start/pull/92), [#89](https://github.com/markhazleton/react-native-web-start/pull/89), [#86](https://github.com/markhazleton/react-native-web-start/pull/86) | Covered locally: source-map-js 1.2.2, Vite 8.3.4, compression 1.8.2, shell-quote 1.12.0, brace-expansion 1.1.21, js-yaml 3.15.2, joi 17.13.8. |
| [#91](https://github.com/markhazleton/react-native-web-start/pull/91) | Grouped updates are covered by equal/newer retained direct dependencies; unused dependencies were removed. |
| [#79](https://github.com/markhazleton/react-native-web-start/pull/79) | Superseded by removing unused @babel/preset-env. |
| [#80](https://github.com/markhazleton/react-native-web-start/pull/80), [#78](https://github.com/markhazleton/react-native-web-start/pull/78) | Defer Babel runtime 8 and TypeScript 7 pending toolchain compatibility. |

GitHub currently lists 11 open Dependabot alerts on its default-branch lockfile.
Local audit retains only the braces and sprintf-js advisory families. The
remaining alerts concern versions fixed or removed locally and need GitHub's
dependency graph to refresh after merge. Code scanning returned "no analysis
found"; secret scanning could not be verified with the current token scopes.

## Separate local Expo scaffold

On this Windows checkout, `.gitignore`'s `**/Packages/*` rule also ignores the
untracked `packages/mobile/` directory. Its Expo app and lockfile exist locally
but are not in HEAD. They are not part of the tracked baseline changes.
An in-range `npm update --prefix packages/mobile/MobileApp` was run locally:
audit findings fell from 30 (including one critical) to 22 (15 high, 7 moderate).
Remaining advisory families are braces, node-forge, and uuid. Expo stays on SDK
57 with React 19.2.8 / React Native 0.86.2; SDK 58 is a separate coordinated
migration. No cross-major uuid override was applied to xcode's dependency.

## Repeatable review

```sh
npm ci
npm run lint
npm run type-check
npm run test:ci -- --runInBand
npm run build
npm audit
npm audit --omit=dev
npm outdated
npx --yes knip --no-progress --reporter compact
```

The existing `.npmrc` retains `legacy-peer-deps=true`; dependency peer ranges
still require review during future major upgrades. npm 12 blocks unapproved
install scripts for @parcel/watcher and unrs-resolver on this machine; the
validated root checks succeed without approving them. npm 11 was used once to
refresh lockfile metadata after npm 12's optional WASM package fetch produced
EALLOWREMOTE. A subsequent ordinary npm 12 `npm ci` succeeded.
