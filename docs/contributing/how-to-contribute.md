---
title: 'How to Contribute'
description: 'Contributing > How to Contribute'
---

Contribute to this project via [Pull Requests](https://github.com/seznam/ima/pulls).

## Changesets

We are using [changesets](https://github.com/changesets/changesets) for the release management. Adding a changeset file to a Pull Request is required in most cases as it triggers the release of the affected packages. If your changes don't affect any package (documentation/tests update, or change in the repository workflow), then you can skip adding a changeset file.

Read on how to add a changeset in the [official changesets documentation](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md). In our repositories, you can use `npm run changeset` alias to open the changeset prompt.

## Semantic Versioning

IMA.js follows [semantic versioning](https://semver.org). We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes.

Every significant change is documented in the changelog file of the related package.

## Open Development

All work on IMA.js happens directly on [GitHub](https://github.com/seznam/ima). Both core team members and external contributors send pull requests which go through the same review process.

## Branch Organization

There are 2 main branches, `master` and `next`.

Branch `master` contains the current stable version. You should target your Pull Request here, if your changes are adding a new feature, fixing a bug, or any other change that does not require a major bump. New version from this branch will be published to the official npm registry under the `latest` tag.

Branch `next` contains the next major release candidate version. You should target your Pull Request here, if you are introducing a breaking change, or extending a functionality existing only in this branch. New version from this branch will be published to the official npm registry under the `rc` tag.

## Development Workflow

After cloning [IMA.js repository](https://github.com/seznam/ima), run `npm ci` (check `.nvmrc` file for supported Node.js version) to fetch its dependencies. Then, you can run several commands:
- `npm run lint` checks the code style.
- `npm run lint -- --fix` fixes the code style issues.
- `npm run stylelint` checks the css/less code style.
- `npm run stylelint -- --fix` fixes the css/less code style issues.
- `npm run test` runs only tests affected by your changes.
- `npm run test -- --watch` runs an interactive test watcher.
- `npm run test <pattern>` runs tests with matching filenames.
- `npm run test:all` runs the complete test suite.
- `npm run test:size` runs size check to avoid introduction of large bundles.
- `npm run build` creates a build folder within all the packages.
- `npm run changeset` opens the changesets prompt.

We recommend running `npm run test` (or its variations above) to make sure you don’t introduce any regressions as you work on your change.

## License

By contributing to IMA.js, you agree that your contributions will be licensed under its MIT license.
