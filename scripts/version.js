const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const execSync = require('child_process').execSync;
const PACKAGE = require('../package.json');
const packageJSONs = glob.sync('./examples/*/*/package.json', {});

packageJSONs.forEach(function(filePath) {
  let pkg = fs.readJsonSync(filePath);
  pkg.devDependencies[PACKAGE.name] = PACKAGE.version;
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
  // Add the package.json file to staging and it'll get commited
  execSync(`git add ${filePath}`);
});
