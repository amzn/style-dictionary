const fs = require('fs-extra');
const { globSync } = require('glob');
const execSync = require('child_process').execSync;
const PACKAGE = require('../package.json');
const packageJSONs = globSync('./examples/*/*/package.json', {});

packageJSONs.forEach(function(filePath) {
  let pkg = fs.readJsonSync(filePath);
  if (pkg.devDependencies) {
    pkg.devDependencies[PACKAGE.name] = PACKAGE.version;
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
  }
  // Add the package.json file to staging and it'll get commited
  execSync(`git add ${filePath}`);
});
