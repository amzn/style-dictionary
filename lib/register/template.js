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

var fs = require('fs'),
    _  = require('lodash'),
    chalk = require('chalk'),
    GroupMessages = require('../utils/groupMessages');

var REGISTER_TEMPLATE_DEPRECATION_WARNINGS = GroupMessages.GROUP.RegisterTemplateDeprecationWarnings;

/**
 * Add a custom template to the Style Dictionary
 * @static
 * @deprecated registerTemplate will be removed in the future, please use registerFormat
 * @memberof module:style-dictionary
 * @param {Object} template
 * @param {String} template.name - The name of your template. You will refer to this in your config.json file.
 * @param {String} template.template - Path to your lodash template
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerTemplate({
 *   name: 'Swift/colors',
 *   template: __dirname + '/templates/swift/colors.template'
 * });
 * ```
 */
function registerTemplate(options) {
  if (typeof options.name !== 'string')
    throw new Error('Template name must be a string: ' + chalk.red(JSON.stringify(options.name)));
  if (typeof options.template !== 'string')
    throw new Error('Template path must be a string: ' + chalk.red(JSON.stringify(options.template)));
  if (!fs.existsSync(options.template))
    throw new Error('Can\'t find template: ' + chalk.red(JSON.stringify(options.template)));

  GroupMessages.add(
    REGISTER_TEMPLATE_DEPRECATION_WARNINGS,
    `${options.name}`
  );

  var template_string = fs.readFileSync( options.template );

  this.format[options.name] = _.template( template_string );
  return this;
}

module.exports = registerTemplate;
