const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const templates = require('../lib/common/templates');
const keys = require('lodash/keys');
const DOCS_PATH = './docs/default_templates.md';

module.exports = function() {
  let toRet = `## Default Templates
[lib/common/templates.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/templates.js)

<table>
  <thead>
   <tr>
     <th>Name</th>
     <th>Description</th>
     <th>Example</th>
    </tr>
  </thead>
  <tbody>
`;

  toRet += keys(templates).map(function(templateName) {
    let template = templates[templateName];
    return `    <tr>
      <td>${templateName}</td>
      <td></td>
      <td></td>
    </tr>`
  }).join('\n');

  toRet += `  </tbody>
  </table>`;

  fs.ensureFileSync( DOCS_PATH );
  fs.writeFileSync( DOCS_PATH, toRet );
  execSync(`git add ${DOCS_PATH}`);
  console.log(DOCS_PATH + ' generated.');
}
