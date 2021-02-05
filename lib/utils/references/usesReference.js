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

const createRegex = require('./createReferenceRegex');

/**
 * Checks if the value uses a value reference.
 * @memberof Dictionary
 * @param {string} value
 * @param {Object|RegExp} regexOrOptions
 * @returns {boolean} - True, if the value uses a value reference
 */
function usesReference(value, regexOrOptions = {}) {
  const regex = regexOrOptions instanceof RegExp ? regexOrOptions : createRegex(regexOrOptions);

  if (typeof value === 'string') {
    return regex.test(value);
  }

  if (typeof value === 'object') {
    let hasReference = false;
    // iterate over each property in the object,
    // if any element passes the regex test,
    // the whole thing should be true
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const element = value[key];
        let reference = usesReference(element, regexOrOptions);
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

module.exports = usesReference;
