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

import GroupMessages from '../groupMessages.js';
import getPathFromName from './getPathFromName.js';
import getName from './getName.js';
import getValueByPath from './getValueByPath.js';
import usesReference from './usesReference.js';
import createReferenceRegex from './createReferenceRegex.js';
import defaults from './defaults.js';

const PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;

/**
 * Utility to resolve references inside a string value
 * @param {string} value
 * @param {Object} dictionary
 * @param {Object} opts
 * @returns {string}
 */
export function resolveReferences(
  value,
  dictionary,
  {
    regex,
    ignorePaths = [],
    current_context = [],
    separator = defaults.separator,
    opening_character = defaults.opening_character,
    closing_character = defaults.closing_character,
    // for internal usage
    stack = [],
    foundCirc = {},
    firstIteration = true,
  } = {},
) {
  const reg = regex ?? createReferenceRegex({ opening_character, closing_character, separator });
  let to_ret = value;
  let ref;

  // When we know the current context:
  // the key associated with the value that we are resolving the reference for
  // Then we can push this to the stack to improve our circular reference warnings
  // by starting them with the key
  if (firstIteration && current_context.length > 0) {
    stack.push(getName(current_context));
  }

  // Replace the reference inline, but don't replace the whole string because
  // references can be part of the value such as "1px solid {color.border.light}"
  value.replace(reg, function (match, variable) {
    variable = variable.trim();

    // Find what the value is referencing
    const pathName = getPathFromName(variable, { separator });

    const refHasValue = pathName[pathName.length - 1] === 'value';

    if (refHasValue && ignorePaths.indexOf(variable) !== -1) {
      return value;
    } else if (!refHasValue && ignorePaths.indexOf(`${variable}.value`) !== -1) {
      return value;
    }

    stack.push(variable);

    ref = getValueByPath(pathName, dictionary);

    // If the reference doesn't end in 'value'
    // and
    // the reference points to someplace that has a `value` attribute
    // we should take the '.value' of the reference
    // per the W3C draft spec where references do not have .value
    // https://design-tokens.github.io/community-group/format/#aliases-references
    if (!refHasValue && ref && ref.hasOwnProperty('value')) {
      ref = ref.value;
    }

    if (typeof ref !== 'undefined') {
      if (typeof ref === 'string' || typeof ref === 'number') {
        to_ret = value.replace(match, ref);

        // Recursive, therefore we can compute multi-layer variables like a = b, b = c, eventually a = c
        if (usesReference(to_ret, reg)) {
          const reference = to_ret.slice(1, -1);

          // Compare to found circular references
          if (foundCirc.hasOwnProperty(reference)) {
            // If the current reference is a member of a circular reference, do nothing
          } else if (stack.indexOf(reference) !== -1) {
            // If the current stack already contains the current reference, we found a new circular reference
            // chop down only the circular part, save it to our circular reference info, and spit out an error

            // Get the position of the existing reference in the stack
            const stackIndexReference = stack.indexOf(reference);

            // Get the portion of the stack that starts at the circular reference and brings you through until the end
            const circStack = stack.slice(stackIndexReference);

            // For all the references in this list, add them to the list of references that end up in a circular reference
            circStack.forEach(function (key) {
              foundCirc[key] = true;
            });

            // Add our found circular reference to the end of the cycle
            circStack.push(reference);

            // Add circ reference info to our list of warning messages
            GroupMessages.add(
              PROPERTY_REFERENCE_WARNINGS,
              'Circular definition cycle:  ' + circStack.join(', '),
            );
          } else {
            to_ret = resolveReferences(to_ret, dictionary, {
              regex: reg,
              ignorePaths,
              current_context,
              separator,
              stack,
              foundCirc,
              firstIteration: false,
            });
          }
        }
        // if evaluated value is a number and equal to the reference, we want to keep the type
        if (typeof ref === 'number' && ref.toString() === to_ret) {
          to_ret = ref;
        }
      } else {
        // if evaluated value is not a string or number, we want to keep the type
        to_ret = ref;
      }
    } else {
      // User might have passed current_context option which is path (arr) pointing to key
      // that this value is associated with, helpful for debugging
      const context = getName(current_context, { separator });
      GroupMessages.add(
        PROPERTY_REFERENCE_WARNINGS,
        `Reference doesn't exist:${
          context ? ` ${context}` : ''
        } tries to reference ${variable}, which is not defined`,
      );
      to_ret = ref;
    }
    stack.pop(variable);

    return to_ret;
  });

  return to_ret;
}
