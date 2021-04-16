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

const path = require('path');
const fs = require('fs-extra');
const filterProperties = require('./filterProperties');
const createFormatArgs = require('./utils/createFormatArgs');
const FileLogger = require('./utils/logger/file');
const Logger = require('./utils/logger');

/**
 * Takes the style property object and a format and returns a
 * string that can be written to a file.
 * @memberOf StyleDictionary
 * @param {Object} file
 * @param {Object} platform
 * @param {Object} dictionary
 * @returns {null}
 */
function buildFile(file = {}, platform = {}, dictionary = {}) {
  var { destination, filter, format } = file || {};

  if (typeof format !== 'function')
    throw new Error('Please enter a valid file format');
  if (typeof destination !== 'string')
    throw new Error('Please enter a valid destination');

  // get if the format is nested, this needs to be done before
  // the function is bound
  const {nested, deprecationMessage} = format;
  // to maintain backwards compatibility we bind the format to the file object
  format = format.bind(file);
  var fullDestination = destination;

  // if there is a build path, prepend the full destination with it
  if (platform.buildPath) {
    fullDestination = platform.buildPath + fullDestination;
  }

  var dirname = path.dirname(fullDestination);
  if (!fs.existsSync(dirname))
    fs.mkdirsSync(dirname);

  const filteredProperties = filterProperties(dictionary, filter);
  const filteredDictionary = Object.assign({}, dictionary, {
    properties: filteredProperties.properties,
    allProperties: filteredProperties.allProperties,
    // keep the unfiltered properties object for reference resolution
    _properties: dictionary.properties
  });

  // Create new file logger instance. This will hold the diagnostics, warnings,
  // messages, etc. about the file and the Logger will take care of
  // logging any messages.
  Logger.file = new FileLogger({
    destination: fullDestination,
    allProperties: filteredProperties.allProperties,
    nested,
    deprecationMessage,
  });

  if (!Logger.file.isEmpty) {
    fs.writeFileSync(fullDestination, format(createFormatArgs({
      dictionary: filteredDictionary,
      platform,
      file
    }), platform, file));
  }

  Logger.emitFile();
}


module.exports = buildFile;
