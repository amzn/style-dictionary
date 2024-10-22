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

import cleanFile from './cleanFile.js';

/**
 * @typedef {import('../types/Volume.d.ts').Volume} Volume
 * @typedef {import('../types/Config.d.ts').PlatformConfig} PlatformConfig
 */

/**
 * Takes a platform config object and a dictionary
 * object and cleans all the files. Dictionary object
 * should have been transformed and resolved before this
 * point.
 * @memberOf StyleDictionary
 * @param {PlatformConfig} platform
 * @param {Volume} [vol]
 */
export default async function cleanFiles(platform, vol) {
  if (platform.buildPath && platform.buildPath.slice(-1) !== '/') {
    throw new Error('Build path must end in a trailing slash or you will get weird file names.');
  }

  if (platform.files) {
    return Promise.all(
      platform.files.map((file) => {
        if (file.format) {
          return cleanFile(file, platform, vol);
        } else {
          throw new Error('Please supply a format');
        }
      }),
    );
  }
}
