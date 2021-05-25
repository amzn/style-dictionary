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

const cleanFile = require('./cleanFile');

/**
 * Takes a platform config object and a dictionary
 * object and cleans all the files. Dictionary object
 * should have been transformed and resolved before this
 * point.
 * @memberOf StyleDictionary
 * @param {Object} dictionary
 * @param {Object} platform
 * @returns {null}
 */
function cleanFiles(dictionary, platform) {
  if (platform.buildPath && platform.buildPath.slice(-1) !== '/') {
    throw new Error('Build path must end in a trailing slash or you will get weird file names.')
  }

  // while neither the format or dictionary are used by clean file I'm passing them in for symmetry to buildFile
  platform.files.forEach(function (file) {
    if (file.format) {
      cleanFile(file, platform, dictionary);
    } else {
      throw new Error('Please supply a template or formatter')
    }
  });
}


module.exports = cleanFiles;
