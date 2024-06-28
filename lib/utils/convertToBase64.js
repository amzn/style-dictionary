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

import { fs } from 'style-dictionary/fs';
import { resolve } from '../resolve.js';

/**
 * @typedef {import('../../types/Volume.ts').Volume} Volume
 * Takes a file and converts it to a base64 string.
 * @private
 * @param {String} filePath - Path to the file you want base64'd
 * @param {Volume} [vol]
 * @returns {String}
 */
export default function convertToBase64(filePath, vol = fs) {
  if (typeof filePath !== 'string') throw new Error('Token filePath name must be a string');

  const body = /** @type {string} */ (
    vol.readFileSync(resolve(filePath, vol.__custom_fs__), 'utf-8')
  );
  return btoa(body);
}
