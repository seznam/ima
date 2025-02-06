/**
 * Exposed as @ima/testing-library/client
 *
 * The separation from @ima/testing-library is necessary to avoid importing `app/main` when
 * users just want to adjust the configuration in a jest setup file. The `app/main` file can
 * import a lot of unnecessary dependencies and slow down the test suite. Also, it can break some
 * `jest.mock` calls as any dependency imported from jest setup file is evaluated before `jest.mock` calls
 * in the test file.
 */

export * from './configuration';
