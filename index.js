/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
var chalk = require('chalk');
var GroupMessages = require('./lib/utils/groupMessages');
var TEMPLATE_DEPRECATION_WARNINGS = GroupMessages.GROUP.TemplateDeprecationWarnings;
var REGISTER_TEMPLATE_DEPRECATION_WARNINGS = GroupMessages.GROUP.RegisterTemplateDeprecationWarnings;
var SASS_MAP_FORMAT_DEPRECATION_WARNINGS = GroupMessages.GROUP.SassMapFormatDeprecationWarnings;

/**
 * Style Dictionary module
 *
 * @module style-dictionary
 * @typicalname StyleDictionary
 * @example
 * ```js
 * const StyleDictionary = require('style-dictionary').extend('config.json');
 *
 * StyleDictionary.buildAllPlatforms();
 * ```
 */
var StyleDictionary = {
  VERSION: require('./package.json').version,
  properties: {},
  allProperties: [],
  // Starting in v3 we are moving towards "tokens" rather than "properties"
  // keeping both for backwards compatibility
  tokens: {},
  allTokens: [],
  options: {},

  transform: require('./lib/common/transforms'),
  transformGroup: require('./lib/common/transformGroups'),
  format: require('./lib/common/formats'),
  action: require('./lib/common/actions'),
  formatHelpers: require('./lib/common/formatHelpers'),
  filter: require('./lib/common/filters'),
  parsers: [], // we need to initialise the array, since we don't have built-in parsers
  fileHeader: {},

  registerTransform: require('./lib/register/transform'),
  registerTransformGroup: require('./lib/register/transformGroup'),
  registerFormat: require('./lib/register/format'),
  registerTemplate: require('./lib/register/template'),
  registerAction: require('./lib/register/action'),
  registerFilter: require('./lib/register/filter'),
  registerParser: require('./lib/register/parser'),
  registerFileHeader: require('./lib/register/fileHeader'),

  exportPlatform: require('./lib/exportPlatform'),
  buildPlatform: require('./lib/buildPlatform'),
  buildAllPlatforms: require('./lib/buildAllPlatforms'),

  cleanPlatform: require('./lib/cleanPlatform'),
  cleanAllPlatforms: require('./lib/cleanAllPlatforms'),

  extend: require('./lib/extend')
};

module.exports = StyleDictionary;

process.on('exit', function () {
  if(GroupMessages.count(TEMPLATE_DEPRECATION_WARNINGS) > 0) {
    var template_warnings = GroupMessages.flush(TEMPLATE_DEPRECATION_WARNINGS).join('\n  ');
    console.log(chalk.bold.yellow(`
⚠️ DEPRECATION WARNING ️️️️️⚠️
Templates are deprecated and will be removed, please update your config to use formats.
This is an example of how to update your config.json:

Before:
  "files": [{
    "destination": "colors.xml",
    "template": "android/colors"
  }]

After:
  "files": [{
    "destination": "colors.xml",
    "format": "android/colors"
  }]

Your current config uses the following templates:
  ${template_warnings}
`));
  }

  if(GroupMessages.count(REGISTER_TEMPLATE_DEPRECATION_WARNINGS) > 0) {
    var register_template_warnings = GroupMessages.flush(REGISTER_TEMPLATE_DEPRECATION_WARNINGS).join('\n  ');
    console.log(chalk.bold.yellow(`
⚠️ DEPRECATION WARNING ️️️️️⚠️
The registerTemplate method is deprecated and will be removed, please
migrate to registerFormat. You can use any templating engine you would
like, you only need to require/import it. This is an example of how to
update your code using a lodash template (the template engine previously
used by registerTemplate):

Before:
  registerTemplate({
    name: 'template/name',
    template: templateFile,
  });

After:
  registerFormat({
    name: 'template/name',
    formatter: _.template( fs.readFileSync( templateFile ) ),
  });

Note that formatter is a function that takes in a style dictionary
and returns a string with the formatted output. There is a second
argument available that contains the configuration being used to
process the style dictionary.

Calls to registerTemplate included the registration of the following
custom templates:
  ${register_template_warnings}`));
  }

  if(GroupMessages.count(SASS_MAP_FORMAT_DEPRECATION_WARNINGS) > 0) {
    var sass_map_format_warnings = GroupMessages.flush(SASS_MAP_FORMAT_DEPRECATION_WARNINGS).join('\n  ');
    console.log(chalk.bold.cyan(`
🔔 NOTICE 🔔
The formats 'sass/map-***' have been renamed to 'scss/map-***', please update your config.
In the future 'sass/map-***' formats may output actual Sass instead of SCSS, which may break your current configuration.
This is an example of how to update your config.json:

Before:
  "files": [{
    "destination": "tokens_map-flat.scss",
    "format": "sass/map-flat"
  }]

After:
  "files": [{
    "destination": "tokens_map-flat.scss",
    "format": "scss/map-flat"
  }]

Your current config uses the following formats:
  ${sass_map_format_warnings}
`));
  }

});
