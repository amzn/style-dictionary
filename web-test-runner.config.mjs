import { playwrightLauncher } from '@web/test-runner-playwright';
import { snapshotPlugin } from '@web/test-runner-commands/plugins';
import fs from 'node:fs';
import { glob } from '@bundled-es-modules/glob';
import { readZIP } from './lib/utils/convertToDTCG.js';

/** @type {string[]} */
const globResult = (
  await glob(
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
  )
) // sort because for some reason glob result is not sorted like filesystem is (alphabetically)
  .sort();

/** @type {[string, Record<string, string> | string][]} */
const fileEntriesToMirror = [];
for (const filePath of globResult) {
  /** @type {Record<string, string> | string} */
  let fileContents;
  // ZIP is binary content, so serialize it to string first..
  if (filePath.endsWith('.zip')) {
    const buf = await fs.promises.readFile(filePath);
    fileContents = await readZIP(new Blob([buf], { type: 'application/zip' }));
  } else {
    fileContents = await fs.promises.readFile(filePath, 'utf-8');
  }
  fileEntriesToMirror.push([filePath, fileContents]);
}

export default {
  nodeResolve: true,
  files: ['__(tests|integration)__/**/*.test.js'],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 98,
      branches: 99,
      functions: 95,
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
  <script blocking="render" type="module" >
    import { setup } from './__tests__/__setup.js';

    await setup(${JSON.stringify(fileEntriesToMirror)});
  </script>
  </head>
  <body>
    <script type="module" src="${testFramework}"></script>
  </body>
</html>`,
};
