# AGENTS.md — IMA.js (`ima`)

## Project overview

IMA.js is an application development stack for building **isomorphic**
(server-side rendered + client-side hydrated) applications written in pure
JavaScript/TypeScript and React. It is developed and maintained by
[Seznam.cz](https://www.seznam.cz) and published to the public npm registry
under the `@ima/*` scope.

Application logic runs first on the server (Express-based) to generate the
page markup, then hydrates on the client and behaves like a single-page
application. See [imajs.io](https://imajs.io) for full documentation.

- Homepage / docs: https://imajs.io
- Issues: https://github.com/seznam/ima/issues
- Plugins live in a separate repo: https://github.com/seznam/IMA.js-plugins

## Repository layout

This is an **npm workspaces monorepo**. Each publishable package lives under
`packages/` and is published independently under the `@ima/*` scope.

```
packages/
├── core/                   # @ima/core — framework core (ObjectContainer, Router, HTTP, Page, Cache, …)
├── server/                 # @ima/server — Express integration / default dev+prod server
├── cli/                    # @ima/cli — build/dev CLI for IMA.js apps (webpack based)
├── plugin-cli/             # @ima/plugin-cli — build/link/dev CLI for IMA.js plugins (rollup based)
├── create-ima-app/         # create-ima-app — app scaffolding (npx create-ima-app)
├── react-page-renderer/    # @ima/react-page-renderer — React page rendering layer
├── helpers/                # @ima/helpers — shared framework helpers
├── dev-utils/              # @ima/dev-utils — dev utilities used by @ima/cli
├── error-overlay/          # @ima/error-overlay — dev-mode error overlay
├── hmr-client/             # @ima/hmr-client — HMR client wiring app to error overlay
├── devtools/               # @ima/devtools — Chrome DevTools debugging panel
├── devtools-scripts/       # @ima/devtools-scripts — scripts used by @ima/devtools
├── testing-library/        # @ima/testing-library — testing utilities for IMA.js apps
└── storybook-integration/  # @ima/storybook-integration — Storybook addon
website/                    # Docusaurus documentation site (imajs.io)
docs/                       # Generated API docs
utils/                      # Repo tooling: dev, tests, version, changesets scripts
types/                      # Shared TypeScript type declarations
```

Root config of note:
- `package.json` — workspaces list + all top-level scripts
- `jest.config.js` / `jest.config.base.js` — Jest multi-project config, maps
  `@ima/*` imports to package **source** entry points
- `eslint.config.js` — ESLint v9 flat config
- `.stylelintrc.js` — Stylelint config for `.css` / `.less`
- `tsconfig.json` — shared TypeScript config
- `createWebpackConfig.js` / `createRollupConfig.mjs` — shared bundler configs
- `.changeset/` — Changesets release management

## Requirements & install

Node.js version is pinned in `.nvmrc` (currently **Node 24**). Run `nvm use`
first if needed.

```bash
npm install
```

`postinstall` automatically runs `npm run build` across all workspaces.

## Common commands

Run from the repository root:

```bash
# Build all packages
npm run build

# Start the dev environment
npm run dev

# Lint JS/TS (ESLint, Prettier enforced via ESLint)
npm run lint

# Lint styles (CSS/LESS)
npm run stylelint

# Run tests for packages changed since master (or next)
npm test

# Run the FULL test suite (what CI runs)
npm run test:all

# Bundle size checks (size-limit)
npm run test:size

# create-ima-app end-to-end test
npm run test:create-ima-app
```

Per-package commands run from inside a package directory (e.g.
`packages/core`):

```bash
npm run build         # build via @ima/plugin-cli
npm run test:jest     # jest for that package only
npm run test:size     # size-limit for that package
```

## Testing

- Test runner is **Jest** (with `@swc/jest`).
- Root `jest.config.js` uses `projects: ['<rootDir>/packages/*/jest.config.js']`
  so each package supplies its own config.
- Tests live in `__tests__/` directories and match the pattern
  `**/__tests__/**/*Spec.{js,jsx}` (i.e. files end with `Spec`, not `.test`).
- `moduleNameMapper` in `jest.config.base.js` resolves `@ima/*` imports to
  package **source** files — so cross-package tests run against source, not
  built `dist/`.

Always run `npm run test:all` after non-trivial changes to catch cross-package
regressions.

## Code conventions

- **TypeScript first** for new framework code (`.ts` / `.tsx`); existing JS is
  gradually migrated.
- **ESM** module syntax. Packages ship both CJS and ESM builds via
  `@ima/plugin-cli` (see each package's `exports` field).
- Formatting is **Prettier**, enforced through ESLint (`prettier/prettier`
  rule) — there is no standalone `format` script. Run `npm run lint` to check.
- `no-console` is an error; only `console.warn` / `console.error` are allowed.
- Unused vars are errors unless prefixed with `_`.
- React is used with the automatic JSX runtime (no `import React` needed).

## Releasing

Releases are managed with **Changesets** and published from CI on pushes to
`master` / `next`.

- Add a changeset for user-facing changes: `npm run changeset`
- CI (`.github/workflows/ci.yml`) runs lint, stylelint, `test:all`, size and
  create-ima-app tests, then `release:publish` on `master`/`next`.

Do **not** hand-edit package versions or `CHANGELOG.md` files — those are
generated by the Changesets release flow.

## Notes for agents

- Prefer editing package **source** in `packages/*/src`; never edit generated
  `dist/`, `build/`, `docs/` or `.docusaurus/` output (they are gitignored /
  eslint-ignored).
- When adding a user-facing change, include a changeset.
- When touching multiple packages, remember imports resolve to source in tests —
  build (`npm run build`) is still needed for anything that consumes `dist/`.
- Keep changes scoped; this monorepo publishes many independent packages.
