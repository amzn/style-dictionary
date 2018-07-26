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

var path = require('path'),
    fs   = require('fs-extra'),
    chalk = require('chalk'),
    filterProperties = require('./filterProperties');

/**
 * Takes the style property object and a format and returns a
 * string that can be written to a file.
 * @memberOf StyleDictionary
 * @param {String} destination
 * @param {Function} format
 * @param {Object} platform
 * @param {Object} dictionary
 * @param {Function} filter
 * @returns {null}
 */
function buildFile(destination, format, platform, dictionary, filter) {
  if (!format || typeof format !== 'function')
    throw new Error('Please enter a valid file format');
  if (!destination || typeof destination !== 'string')
    throw new Error('Please enter a valid destination');

  // if there is a build path, prepend the destination with it
  if (platform.buildPath) {
    destination = platform.buildPath + destination;
  }

  var dirname = path.dirname(destination);
  if (!fs.existsSync(dirname))
    fs.mkdirsSync(dirname);

  fs.writeFileSync(destination, format(filterProperties(dictionary, filter), platform));
  console.log(chalk.bold.green('✔︎') + ' ' + destination);
}


module.exports = buildFile;
