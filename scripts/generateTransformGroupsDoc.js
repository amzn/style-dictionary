const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const transformGroups = require('../lib/common/transformGroups');
const keys = require('lodash/keys');
const DOCS_PATH = './docs/default_transform_groups.md';

module.exports = function() {
  let toRet = `## Default Transform Groups
[lib/common/transforms.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/transformGroups.js)

<table>
  <thead>
   <tr>
     <th>Name</th>
     <th>Transforms</th>
    </tr>
  </thead>
  <tbody>
`;

  toRet += keys(transformGroups).map(function(transformGroupName) {
    let transformGroup = transformGroups[transformGroupName];
    return `    <tr>
      <td>${transformGroupName}</td>
      <td>${transformGroup.join(', ')}</td>
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
