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

import { regexDefault } from './createReferenceRegex.js';

/**
 * Checks if the value uses a value reference.
 * @memberof Dictionary
 * @param {string|any} value
 * @returns {boolean} - True, if the value uses a value reference
 */
export default function usesReferences(value) {
  const regex = regexDefault;

  if (typeof value === 'string') {
    return !!value.match(regex);
  }

  if (typeof value === 'object') {
    let hasReference = false;
    // iterate over each property in the object,
    // if any element passes the regex test,
    // the whole thing should be true
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        const element = value[key];
        let reference = usesReferences(element);
        if (reference) {
          hasReference = true;
          break;
        }
      }
    }
    return hasReference;
  }

  return false;
}
