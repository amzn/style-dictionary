import fs from 'node:fs';
import { globSync } from '@bundled-es-modules/glob';
import { execSync } from 'child_process';

const { version, name } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// examples
const packageJSONs = globSync('./examples/*/*/package.json', { fs });
packageJSONs.forEach(function (filePath) {
  let pkg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (pkg.devDependencies) {
    pkg.devDependencies[name] = version;
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
  }
  execSync(`git add ${filePath}`);
});

// version in lib file
const paths = ['src/StyleDictionary.ts', 'docs/src/components/sd-playground.ts'];
paths.forEach((p) => {
  const indexContent = fs.readFileSync(p, 'utf-8');
  const newIndexContent = indexContent.replace('<? version placeholder ?>', version);
  fs.writeFileSync(p, newIndexContent, 'utf-8');
  execSync(`git add ${p}`);
});
