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

const getPath = require('./getPathFromName');
const createReferenceRegex = require('./createReferenceRegex');
const resolveReference = require('./resolveReference');
const GroupMessages = require('../groupMessages');

/**
 * This is a helper function that is added to the dictionary object that
 * is passed to formats and actions. It will resolve a reference giving
 * you access to the token (not just the value) that a value references.
 * This allows formats to have variable references in the output. For example:
 *
 * ```css
 * --color-background-base: var(--color-core-white);
 * ```
 *
 * @memberof Dictionary
 * @param {string} value the value that contains a reference
 * @param {object[]} references array of token's references because a token's value can contain multiple references due to string interpolation
 * @returns {any}
 */
function getReferences(value, references=[]) {
  // `this` is the dictionary object passed to formats and actions
  const self = this;
  const regex = createReferenceRegex({});

  // this will update the references array with the referenced tokens it finds.
  function findReference(match, variable) {
    // remove 'value' to access the whole token object
    variable = variable.trim().replace('.value','');

    // Find what the value is referencing
    const pathName = getPath(variable);

    let ref = resolveReference(pathName, self.properties);
    if (!ref) {
      // fall back on _properties as it is unfiltered
      ref = resolveReference(pathName, self._properties);
      // and warn the user about this
      GroupMessages.add(GroupMessages.GROUP.FilteredOutputReferences, variable);
    }
    references.push(ref);
  }

  if (typeof value === 'string') {
    // function inside .replace runs multiple times if there are multiple matches
    value.replace(regex, findReference);
  }

  // If the token's value is an object, run the replace reference
  // on each value within that object. This mirrors the `usesReference`
  // function which iterates over the object to see if there is a reference
  if (typeof value === 'object') {
    for (const key in value) {
      if (value.hasOwnProperty(key) && typeof value[key] === 'string') {
        value[key].replace(regex, findReference);
      }
      // if it is an object, we go further down the rabbit hole
      if (value.hasOwnProperty(key) && typeof value[key] === 'object') {
        self.getReferences(value[key], references);
      }
    }
  }

  return references;
}

module.exports = getReferences;
