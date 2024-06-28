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

import chalk from 'chalk';
import { fs } from 'style-dictionary/fs';

/**
 * Takes the style property object and a format and returns a
 * string that can be written to a file.
 * @memberOf StyleDictionary
 * @param {String} destination
 * @param {Function} format (unused)
 * @param {Object} platform
 * @param {Object} dictionary (unused)
 * @param {Function} filter (unused)
 * @returns {null}
 */
export default function cleanFile(file = {}, platform = {}) {
  var { destination } = file;

  if (typeof destination !== 'string') throw new Error('Please enter a valid destination');

  // if there is a clean path, prepend the destination with it
  if (platform.buildPath) {
    destination = platform.buildPath + destination;
  }

  if (!fs.existsSync(destination)) {
    console.log(chalk.bold.red('!') + ' ' + destination + ', does not exist');
    return;
  }

  fs.unlinkSync(destination);
  console.log(chalk.bold.red('-') + ' ' + destination);
}
