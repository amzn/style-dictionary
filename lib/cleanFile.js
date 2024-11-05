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
 * @typedef {import('../types/Volume.d.ts').Volume} Volume
 * @typedef {import('../types/File.d.ts').File} File
 * @typedef {import('../types/Config.d.ts').PlatformConfig} PlatformConfig
 */

/**
 * Takes the style property object and a format and returns a
 * string that can be written to a file.
 * @memberOf StyleDictionary
 * @param {File} file
 * @param {PlatformConfig} [platform]
 * @param {Volume} [vol]
 */
export default async function cleanFile(file, platform = {}, vol = fs) {
  /** @type {Record<'warning'|'success', string[]>} */
  const cleanLogs = {
    warning: [],
    success: [],
  };
  let { destination } = file;

  if (typeof destination !== 'string') throw new Error('Please enter a valid destination');

  // if there is a clean path, prepend the destination with it
  if (platform.buildPath) {
    destination = platform.buildPath + destination;
  }

  if (!vol.existsSync(destination) && platform?.log?.verbosity !== 'silent') {
    cleanLogs.success.push(chalk.bold.red('!') + ' ' + destination + ', does not exist');
    return cleanLogs;
  }

  vol.unlinkSync(destination);
  if (platform?.log?.verbosity !== 'silent') {
    cleanLogs.success.push(chalk.bold.red('-') + ' ' + destination);
  }
  return cleanLogs;
}
