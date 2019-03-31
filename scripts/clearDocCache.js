const jsdoc2md = require('jsdoc-to-markdown');

async function clear() {
  await jsdoc2md.clear()
};

clear();