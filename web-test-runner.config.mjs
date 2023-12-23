import { playwrightLauncher } from '@web/test-runner-playwright';
import { snapshotPlugin } from '@web/test-runner-commands/plugins';
import fs from 'node:fs';
import { globSync } from '@bundled-es-modules/glob';

const filesToMirror = globSync(
  [
    '__tests__/__assets/**/*',
    '__tests__/__configs/**/*',
    '__tests__/__json_files/**/*',
    '__tests__/__tokens/**/*',
    '__integration__/tokens/**/*',
  ],
  {
    fs,
    nodir: true,
    posix: true,
  },
) // sort because for some reason glob result is not sorted like filesystem is (alphabetically)
  .sort()
  .map((filePath) => [filePath, fs.readFileSync(filePath, 'utf-8')]);

export default {
  nodeResolve: true,
  files: ['__(tests|integration)__/**/*.test.js'],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 98,
      branches: 99,
      functions: 96,
      lines: 98,
    },
  },
  browsers: [
    playwrightLauncher({
      product: 'chromium',
    }),
  ],
  plugins: [snapshotPlugin()],
  testRunnerHtml: (testFramework) => `<html>
  <head>
  <script type="module">
    import { setup } from './__tests__/__setup.js';

    setup(${JSON.stringify(filesToMirror)});
  </script>
  </head>
  <body>
    <script type="module" src="${testFramework}"></script>
  </body>
</html>`,
};
