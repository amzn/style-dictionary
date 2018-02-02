const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs-extra');
const execSync = require('child_process').execSync;

const DOCS_PATH = './docs/api.md';
const docs = jsdoc2md.renderSync({
  files: ['index.js','lib/**/*.js'],
  template: fs.readFileSync('scripts/handlebars/templates/api.hbs').toString(),
  // 'no-gfm': true,
  separators: true,
  partial: ['scripts/handlebars/header.hbs','scripts/handlebars/sig-name.hbs', 'scripts/handlebars/body.hbs']
});

fs.ensureFileSync( DOCS_PATH );
fs.writeFileSync( DOCS_PATH, docs );
execSync(`git add ${DOCS_PATH}`);
console.log(DOCS_PATH + ' generated.');


const TRANSFORMS_PATH = './docs/transforms.md'
const transforms = jsdoc2md.renderSync({
  files: ['lib/common/transforms.js'],
  template: fs.readFileSync('scripts/handlebars/templates/transforms.hbs').toString(),
  'no-gfm': true,
  separators: true,
  partial: ['scripts/handlebars/header.hbs','scripts/handlebars/body.hbs']
});

fs.ensureFileSync( TRANSFORMS_PATH );
fs.writeFileSync( TRANSFORMS_PATH, transforms );
execSync(`git add ${TRANSFORMS_PATH}`);
console.log(TRANSFORMS_PATH + ' generated.');

const TRANSFORM_GROUPS_PATH = './docs/transform_groups.md'
const transform_groups = jsdoc2md.renderSync({
  files: ['lib/common/transformGroups.js'],
  template: fs.readFileSync('scripts/handlebars/templates/transform_groups.hbs').toString(),
  'no-gfm': true,
  separators: true,
  partial: ['scripts/handlebars/header.hbs','scripts/handlebars/body.hbs']
});

fs.ensureFileSync( TRANSFORM_GROUPS_PATH );
fs.writeFileSync( TRANSFORM_GROUPS_PATH, transform_groups );
execSync(`git add ${TRANSFORM_GROUPS_PATH}`);
console.log(TRANSFORM_GROUPS_PATH + ' generated.');

const ACTIONS_PATH = './docs/actions.md'
const actions = jsdoc2md.renderSync({
  files: ['lib/common/actions.js'],
  template: fs.readFileSync('scripts/handlebars/templates/actions.hbs').toString(),
  'no-gfm': true,
  separators: true,
  partial: ['scripts/handlebars/header.hbs','scripts/handlebars/body.hbs']
});

fs.ensureFileSync( ACTIONS_PATH );
fs.writeFileSync( ACTIONS_PATH, actions );
execSync(`git add ${ACTIONS_PATH}`);
console.log(ACTIONS_PATH + ' generated.');

const FORMATS_PATH = './docs/formats.md'
const formats = jsdoc2md.renderSync({
  files: ['lib/common/formats.js'],
  template: fs.readFileSync('scripts/handlebars/templates/formats.hbs').toString(),
  'no-gfm': true,
  separators: true,
  partial: ['scripts/handlebars/header.hbs','scripts/handlebars/body.hbs']
});

fs.ensureFileSync( FORMATS_PATH );
fs.writeFileSync( FORMATS_PATH, formats );
execSync(`git add ${FORMATS_PATH}`);
console.log(FORMATS_PATH + ' generated.');

const TEMPLATES_PATH = './docs/templates.md'
const templates = jsdoc2md.renderSync({
  files: ['lib/common/templates.js'],
  template: fs.readFileSync('scripts/handlebars/templates/templates.hbs').toString(),
  'no-gfm': true,
  separators: true,
  partial: ['scripts/handlebars/header.hbs','scripts/handlebars/body.hbs']
});

fs.ensureFileSync( TEMPLATES_PATH );
fs.writeFileSync( TEMPLATES_PATH, templates );
execSync(`git add ${TEMPLATES_PATH}`);
console.log(TEMPLATES_PATH + ' generated.');
