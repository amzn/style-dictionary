const fs = require('fs-extra');
const formats = require('../lib/common/formats');
const execSync = require('child_process').execSync;
const keys = require('lodash/keys');
const DOCS_PATH = './docs/default_formats.md';

module.exports = function() {
  let toRet = `## Default Formats
[lib/common/formats.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/formats.js)

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

  toRet += keys(formats).map(function(formatName) {
    let format = formats[formatName];
    return `    <tr>
      <td>${formatName}</td>
      <td>${format.description||''}</td>
      <td>${format.example||''}</td>
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
