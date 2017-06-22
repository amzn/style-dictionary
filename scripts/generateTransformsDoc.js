const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const transforms = require('../lib/common/transforms');
const keys = require('lodash/keys');
const DOCS_PATH = './docs/default_transforms.md';

module.exports = function() {
  let toRet = `## Default Transforms
[lib/common/transforms.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/transforms.js)

<table>
  <thead>
   <tr>
     <th>Name</th>
     <th>Type</th>
     <th>Matcher</th>
     <th>Description</th>
    </tr>
  </thead>
  <tbody>
`;

  toRet += keys(transforms).map(function(transformName) {
    let transform = transforms[transformName];
    return `    <tr>
      <td>${transformName}</td>
      <td>${transform.type}</td>
      <td>${transform.matcher||'all'}</td>
      <td>${transform.description||''}</td>
    </tr>`
  }).join('\n');

  toRet += `
  </tbody>
</table>`;

  fs.ensureFileSync( DOCS_PATH );
  fs.writeFileSync( DOCS_PATH, toRet );
  execSync(`git add ${DOCS_PATH}`);
  console.log(DOCS_PATH + ' generated.');
}
