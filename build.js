import * as transform from './lib/common/transforms';

var StyleDictionary = {
  VERSION: '3.0.0',
  properties: {},
  allProperties: [],
  options: {},

  transform,
  transformGroup: require('./lib/common/transformGroups'),
  format: require('./lib/common/formats'),
  // action: require('./lib/common/actions'),
  formatHelpers: require('./lib/common/formatHelpers'),
  filter: {}, // we need to initialise the object, since we don't have built-in filters
  parsers: [], // ditto ^
  fileHeader: {},

  registerTransform: require('./lib/register/transform'),
  registerTransformGroup: require('./lib/register/transformGroup'),
  registerFormat: require('./lib/register/format'),
  // registerTemplate: require('./lib/register/template'),
  registerAction: require('./lib/register/action'),
  registerFilter: require('./lib/register/filter'),
  registerParser: require('./lib/register/parser'),
  registerFileHeader: require('./lib/register/fileHeader'),

  exportPlatform: require('./lib/exportPlatform'),
  buildPlatform: require('./lib/buildPlatform'),
  buildAllPlatforms: require('./lib/buildAllPlatforms'),

  // cleanPlatform: require('./lib/cleanPlatform'),
  // cleanAllPlatforms: require('./lib/cleanAllPlatforms'),

  extend: require('./lib/extend')
};

export default StyleDictionary;