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

const buildFile = require('./buildFile');

/**
 * Takes a platform config object and a dictionary
 * object and builds all the files. Dictionary object
 * should have been transformed and resolved before this
 * point.
 * @memberOf StyleDictionary
 * @param {Object} dictionary
 * @param {Object} platform
 * @returns {null}
 */
function buildFiles(dictionary, platform) {
  if (platform.buildPath && (platform.buildPath.slice(-1) !== '/' && platform.buildPath.slice(-1) !== '\\')) {
    throw new Error('Build path must end in a trailing slash or you will get weird file names.')
  }

  platform.files.forEach(function (file) {
    if (file.format) {
      buildFile(file, platform, dictionary);
    } else {
      throw new Error('Please supply a format');
    }
  });
}


module.exports = buildFiles;
