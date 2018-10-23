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

const _ = require('lodash');

let currentContext = []; // To maintain the context so we can test for circular definitions
const defaults = {
  opening_character: '{',
  closing_character: '}',
  separator: '.',
  ignoreKeys: ['original'],
};
let updatedObject;
let regex;
let options;

function resolveObject(object, opts) {
  options = _.extend({}, defaults, opts);

  updatedObject = _.cloneDeep(object); // This object will be edited

  regex = new RegExp(
    `\\${options.opening_character}([^${options.closing_character}]+)\\${options.closing_character}`,
    'g'
  );

  if (typeof object === 'object') {
    currentContext = [];
    return traverseObj(updatedObject);
  }
  throw new Error('Please pass an object in');
}

function traverseObj(obj) {
  const errors = [];

  Object.keys(obj)
    .filter(keyToFilter => !(options.ignoreKeys || []).includes(keyToFilter))
    .forEach(key => {
      currentContext.push(key);
      if (typeof obj[key] === 'object') {
        traverseObj(obj[key]);
      } else if (typeof obj[key] === 'string' && obj[key].includes('{')) {
        try {
          /* eslint-disable no-param-reassign */
          obj[key] = compileValue(obj[key], [key]);
        } catch (e) {
          errors.push(e);
        }
      }
      currentContext.pop();
    });

  if (errors.length) {
    throw new Error(
      errors.length === 1
        ? errors[0]
        : `Failed due to ${errors.length} errors:\n${errors.join('\n').replace(/Error: /g, '\t')}`
    );
  }

  return obj;
}

function compileValue(value, stack) {
  let toRet;
  let ref;
  stack.push(value.slice(1, -1));

  // Replace the reference inline, but don't replace the whole string because
  // references can be part of the value such as "1px solid {color.border.light}"
  value.replace(regex, (match, variable) => {
    // Find what the value is referencing
    ref = selfRef(variable.trim(), updatedObject);

    if (ref) {
      if (typeof ref === 'string') {
        toRet = value.replace(match, ref);

        // Recursive so we can compute multi-layer variables like a = b, b = c, so a = c
        if (toRet.includes('{')) {
          const reference = toRet.slice(1, -1);
          if (stack.includes(reference)) {
            stack.push(reference);
            throw new Error(
              `Variable reference for '${
                stack[0]
              }' resolves to circular definition cycle of '${reference}':  ${stack.join(', ')}`
            );
          } else {
            toRet = compileValue(toRet, stack);
          }
        }
      } else {
        // if evaluated value is not a string, we want to keep the type
        toRet = ref;
      }
    } else {
      // Leave the circular reference unchanged
      toRet = value;
    }

    return toRet;
  });

  return toRet;
}

function selfRef(string, obj) {
  let i;
  let ref = obj;
  const array = string.split(options.separator);
  const context = currentContext.join(options.separator);

  for (i = 0; i < array.length; i += 1) {
    if (ref[array[i]]) {
      ref = ref[array[i]];
    } else {
      ref = obj;
      break;
    }
  }

  // If the reference doesn't change then it means
  // we didn't find it in the object
  if (ref === obj) {
    throw new Error(`Reference doesn't exist: ${context} tries to reference ${string}, which is not defined`);
  }

  const test = options.opening_character + context + options.closing_character;

  if (typeof ref === 'string' && ref.includes(test)) {
    throw new Error(`Circular definition: ${context} | ${string}`);
  } else {
    return ref;
  }
}

module.exports = resolveObject;
