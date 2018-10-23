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

const fs = require('fs-extra');

module.exports = {
  clearOutput: () => fs.emptyDirSync('__tests__/__output'),

  fileToJSON: path => fs.readJsonSync(path),

  fileExists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  pathDoesNotExist(path) {
    try {
      return !fs.existsSync(path);
    } catch (err) {
      return false;
    }
  },

  dirDoesNotExist(dirPath) {
    return this.pathDoesNotExist(dirPath);
  },

  fileDoesNotExist(filePath) {
    return this.pathDoesNotExist(filePath);
  },
};
