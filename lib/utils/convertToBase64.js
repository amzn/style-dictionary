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
import { isNode } from './isNode.js';

/**
 * @param {Buffer} buffer
 * @returns {string|Promise<string>}
 */
function toBase64(buffer) {
  if (isNode) {
    // Node.js environment
    return buffer.toString('base64');
  } else {
    // Browser environment
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = /** @type {string } */ (reader.result).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

/**
 * @typedef {import('../../types/Volume.d.ts').Volume} Volume
 * Takes a file and converts it to a base64 string.
 * @private
 * @param {string} filePath - Path to the file you want base64'd
 * @param {Volume} [vol]
 * @returns {Promise<string>}
 */
export default async function convertToBase64(filePath, vol = fs) {
  if (typeof filePath !== 'string') throw new Error('Token filePath name must be a string');
  // typecast to Buffer because we know that without specifying encoding, this returns a Buffer
  // @ts-expect-error requires encoding options, this is a mistake in memfs types definition
  const body = /** @type {Buffer} */ (vol.readFileSync(resolve(filePath, vol.__custom_fs__)));
  return toBase64(body);
}
