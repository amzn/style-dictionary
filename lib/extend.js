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

require('json5/lib/register');
require.extensions[".jsonc"] = require("./utils/jsonc").register;

var combineJSON = require('./utils/combineJSON'),
    deepExtend = require('./utils/deepExtend'),
    path = require('path'),
    _ = require('./utils/es6_'),
    GroupMessages = require('./utils/groupMessages');

var PROPERTY_VALUE_COLLISIONS = GroupMessages.GROUP.PropertyValueCollisions;

/**
 * Either a string to a JSON file that contains configuration for the style dictionary or a plain Javascript object
 * that contains the configuration.
 * @typedef {(object|string)} Config
 * @prop {String[]} source - Paths to token files
 * @prop {Platform} platforms.platform - A platform
 * @example
 * ```json
 * {
 *   "source": ["tokens/*.json"],
 *   "platforms": {
 *     "scss": {
 *       "transformGroup": "scss",
 *       "buildPath": "web/sass/",
 *       "files": [
 *         {
 *           "format": "scss/variables",
 *           "destination": "_variables.scss"
 *         }
 *       ],
 *       "actions": ["copy_assets"]
 *     }
 *   }
 * }
 * ```
 */

/**
 * An object representing a platform
 * @typedef {Object} Platform
 * @prop {String} transformGroup
 * @prop {String} transforms
 */

/**
 * Create a Style Dictionary
 * @static
 * @memberof module:style-dictionary
 * @param {Config} config - Configuration options to build your style dictionary. If you pass a string,
 * it will be used as a path to a JSON config file. You can also pass an object with the configuration.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * const StyleDictionary = require('style-dictionary').extend('config.json');
 *
 * const StyleDictionary = require('style-dictionary').extend({
 *   source: ['tokens/*.json'],
 *   platforms: {
 *     scss: {
 *       transformGroup: 'scss',
 *       buildPath: 'build/',
 *       files: [{
 *         destination: 'variables.scss',
 *         format: 'scss/variables'
 *       }]
 *     }
 *     // ...
 *   }
 * });
 * ```
 */
function extend(opts) {
  let options, to_ret;
  let inlineTokens = {};
  let includeTokens = {};
  let sourceTokens = {};

  // Overloaded method, can accept a string as a path that points to a JS or
  // JSON file or a plain object. Potentially refactor.
  if (_.isString(opts)) {
    options = require(path.resolve(process.cwd(), opts));
  } else {
    options = opts;
  }

  // Creating a new object and copying over the options
  // Also keeping an options object in case
  to_ret = deepExtend([{}, this, {options: options}, options]);

  // grab the inline tokens, ones either defined in the configuration object
  // or that already exist from extending another style dictionary instance
  // with `properties` or `tokens` keys
  inlineTokens = deepExtend([{}, (to_ret.tokens||{}), (to_ret.properties||{})]);

  // Update tokens with includes from dependencies
  if (options.include) {
    if (!_.isArray(options.include))
      throw new Error('include must be an array');

    includeTokens = combineJSON(options.include, true, null, false, to_ret.parsers);

    to_ret.include = null; // We don't want to carry over include references
  }

  // Update tokens with current package's source
  // These highest precedence
  if (options.source) {
    if (!_.isArray(options.source))
      throw new Error('source must be an array');

    sourceTokens = combineJSON(options.source, true, function Collision(prop) {
      GroupMessages.add(
        PROPERTY_VALUE_COLLISIONS,
        `Collision detected at: ${prop.path.join('.')}! Original value: ${prop.target[prop.key]}, New value: ${prop.copy[prop.key]}`
      );
    }, true, to_ret.parsers);

    if(GroupMessages.count(PROPERTY_VALUE_COLLISIONS) > 0) {
      var collisions = GroupMessages.flush(PROPERTY_VALUE_COLLISIONS).join('\n');
      console.log(`\n${PROPERTY_VALUE_COLLISIONS}:\n${collisions}\n\n`);
      if (options.log === 'error') {
        throw new Error('Collisions detected');
      }
    }

    to_ret.source = null; // We don't want to carry over the source references
  }

  // Merge inline, include, and source tokens
  const tokens = deepExtend([{}, inlineTokens, includeTokens, sourceTokens]);

  // Add tokens to both .tokens and .properties
  to_ret.tokens = tokens;
  to_ret.properties = tokens;

  return to_ret;
}

module.exports = extend;
