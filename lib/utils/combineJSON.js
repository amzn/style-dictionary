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

const glob = require('glob');
const extend = require('lodash/extend');
const path = require('path');
const resolveCwd = require('resolve-cwd');
const deepExtend = require('./deepExtend');

/**
 * Takes an array of json files and merges
 * them together. Optionally does a deep extend.
 * @private
 * @param {String[]} arr - Array of paths to json (or node modules that export objects) files
 * @param {Boolean} [deep=false] - If it should perform a deep merge
 * @param {Function} collision - A function to be called when a name collision happens that isn't a normal deep merge of objects
 * @returns {Object}
 */
function combineJSON(arr, deep, collision) {
  let i;
  let files = [];
  const toRet = {};
  let fileContent;

  for (i = 0; i < arr.length; i += 1) {
    const newFiles = glob.sync(arr[i], {});
    files = files.concat(newFiles);
  }

  for (i = 0; i < files.length; i += 1) {
    const resolvedPath = resolveCwd(path.isAbsolute(files[i]) ? files[i] : `./${files[i]}`);

    try {
      /* eslint-disable global-require, import/no-dynamic-require */
      fileContent = require(resolvedPath);
    } catch (e) {
      e.message = `Failed to load or parse JSON or JS Object: ${e.message}`;
      throw e;
    }

    if (deep) {
      deepExtend([toRet, fileContent], collision);
    } else {
      extend(toRet, fileContent);
    }
  }

  return toRet;
}

module.exports = combineJSON;
