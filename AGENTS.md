# AGENTS.md — IMA.js (`ima`)

## Project overview

IMA.js is an application development stack for building **isomorphic**
(server-side rendered + client-side hydrated) applications written in pure
JavaScript/TypeScript and React. It is developed and maintained by
[Seznam.cz](https://www.seznam.cz) and published to the public npm registry
under the `@ima/*` scope.

Application logic runs first on the server (Express-based) to generate the
page markup, then hydrates on the client and behaves like a single-page
application.

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

## Setup

Assume fixed toolchain versions everywhere; don't check for or support others.

- Node.js **24** (pinned in `.nvmrc`) — run `nvm use` first.

```bash
npm ci
```

## Common commands

```bash
npm run build # build all packages (turbo)
npm run build -w <package-name> # build one package
npm run test # test changed packages
npm run lint # lint all packages
npm run stylelint # lint all less files
```

## Conventions

- **Changesets are mandatory** for every MR.
- **TypeScript first** for new framework code (`.ts` / `.tsx`); existing JS is
  gradually migrated.
- **ESM** module syntax. Packages ship both CJS and ESM builds via
  `@ima/plugin-cli` (see each package's `exports` field).
- React is used with the automatic JSX runtime (no `import React` needed).
- Keep changes scoped; this monorepo publishes many independent packages.

## Don't

- Don't run `npm install` / `usac reinstall` inside packages.
- Don't bump versions or edit CHANGELOG.md manually — use changesets.
