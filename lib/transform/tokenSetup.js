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

import { isPlainObject } from 'is-plain-object';
import deepExtend from '../utils/deepExtend.js';

/**
 * Takes a token object, a leaf node in a tokens object, and
 * returns a new object that has some tokens set. It clones the
 * original object for safekeeping, adds a name, adds an attributes object,
 * and a path array.
 * @private
 * @param {Object} token - the token object to setup
 * @param {String} name - The name of the token, which will should be its key in the object.
 * @param {Array} path - The path of keys to get to the token from the top level of the tokens object.
 * @returns {Object} - A new object that is setup and ready to go.
 */
export default function tokenSetup(token, name, path) {
  if (!token && !isPlainObject(token)) throw new Error('Property object must be an object');
  if (!name || !(typeof name === 'string')) throw new Error('Name must be a string');
  if (!path || !Array.isArray(path)) throw new Error('Path must be an array');

  let to_ret = token;

  // Only do this once
  if (!token.original) {
    // Initial token setup
    // Keep the original object tokens like it was in file (whitout additional data)
    // so we can key off them in the transforms
    to_ret = deepExtend([{}, token]);
    let to_ret_original = deepExtend([{}, token]);
    delete to_ret_original.filePath;
    delete to_ret_original.isSource;

    to_ret.original = to_ret_original;
    // Copy the name - it will be our base name to transform
    to_ret.name = to_ret.name || name || '';
    // Create an empty attributes object that we can transform on it later
    to_ret.attributes = to_ret.attributes || {};
    // An array of the path down the object tree; we will use it to build readable names
    // like color_font_base
    to_ret.path = structuredClone(path);
  }

  return to_ret;
}
