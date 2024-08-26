import { playwrightLauncher } from '@web/test-runner-playwright';

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  nodeResolve: true,
  files: ['__perf_tests__/**/*.test.js'],
  browsers: [
    playwrightLauncher({
      product: 'chromium',
    }),
  ],
};
