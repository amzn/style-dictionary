const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const execSync = require('child_process').execSync;
const PACKAGE = require('../package.json');
const dirs = glob.sync('./example/*', {});

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

dirs.forEach(function(dir) {
  let filePath = path.join(dir, 'package.json');
  if (fileExists(filePath)) {
    let pkg = fs.readJsonSync( filePath );
    pkg.devDependencies[PACKAGE.name] = PACKAGE.version;
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
    // Add the package.json file to staging so it'll get commited
    execSync(`git add ${filePath}`);
  }
});
