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

var _ = require('lodash'),
    GroupMessages = require('./groupMessages');

var PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;

var current_context = []; // To maintain the context to be able to test for circular definitions
var defaults = {
  opening_character: '{',
  closing_character: '}',
  separator: '.',
  ignoreKeys: ['original']
};
var updated_object, regex, options;


function resolveObject(object, opts) {
  options = _.extend({}, defaults, opts);

  updated_object = _.cloneDeep(object);  // This object will be edited

  regex = new RegExp(
    '\\' +
    options.opening_character +
    '([^' +
    options.closing_character +
    ']+)' +
    '\\' +
    options.closing_character, 'g'
  );

  if (typeof object === 'object') {
    current_context = [];
    return traverseObj( updated_object );
  } else {
    throw new Error('Please pass an object in');
  }
}



function traverseObj(obj) {
  var key;

  for (key in obj) {
    // We want to check for ignoredKeys, this is to
    // skip over attributes that should not be
    // mutated, like a copy of the original property.
    if (obj.hasOwnProperty(key) && (options.ignoreKeys||[]).indexOf(key) < 0) {
      current_context.push(key);
      if (typeof obj[key] === 'object') {
        traverseObj( obj[key] );
      } else {
        if (typeof obj[key] === 'string' && obj[key].indexOf('{') > -1) {
          obj[key] = compile_value( obj[key], [current_context.join('.')] );
        }
      }
      current_context.pop();
    }
  }

  return obj;
}


var foundCirc = {};
function compile_value(value, stack) {

  var to_ret, ref;

  // Replace the reference inline, but don't replace the whole string because
  // references can be part of the value such as "1px solid {color.border.light}"
  value.replace(regex, function(match, variable) {
    stack.push(variable);

    // Find what the value is referencing
    ref = selfRef(variable.trim(), updated_object);

    if (typeof ref !== 'undefined') {
      if (typeof ref === 'string') {
        to_ret = value.replace(match, ref);

        // Recursive, therefore we can compute multi-layer variables like a = b, b = c, eventually a = c
        if ( to_ret.indexOf('{') > -1 ) {
          var reference = to_ret.slice(1, -1);

          // Compare to found circular references
          if (foundCirc.hasOwnProperty(reference)) {
            // If the current reference is a member of a circular reference, do nothing
          }
          else if(stack.indexOf(reference)!==-1) {
            // If the current stack already contains the current reference, we found a new circular reference
            // chop down only the circular part, save it to our circular reference info, and spit out an error

            // Get the position of the existing reference in the stack
            var stackIndexReference = stack.indexOf(reference);

            // Get the portion of the stack that starts at the circular reference and brings you through until the end
            var circStack = stack.slice(stackIndexReference);

            // For all the references in this list, add them to the list of references that end up in a circular reference
            circStack.forEach(function(key) { foundCirc[key] = true; });

            // Add our found circular reference to the end of the cycle
            circStack.push(reference);

            // Add circ reference info to our list of warning messages
            GroupMessages.add(
              PROPERTY_REFERENCE_WARNINGS,
              "Circular definition cycle:  " + circStack.join(', ')
            );
          }
          else {
            to_ret = compile_value( to_ret, stack );
          }
        }
      } else {
        // if evaluated value is not a string, we want to keep the type
        to_ret = ref;
      }
    } else {
      // Leave the circular reference unchanged
      to_ret = value;
    }
    stack.pop(variable);

    return to_ret;
  });

  return to_ret;
}


function selfRef(str, obj) {
  var i,
      ref=obj,
      array = str.split(options.separator),
      context = current_context.join(options.separator);

  for (i = 0; i < array.length; i++) {
    // Check for undefined as 0 is a valid, truthy value
    if (typeof ref[array[i]] !== 'undefined') {
      ref = ref[array[i]];
    } else {
      // set the reference as undefined if we don't find anything
      ref = undefined;
      break;
    }
  }

  if (typeof ref === 'undefined') {
    GroupMessages.add(
      PROPERTY_REFERENCE_WARNINGS,
      "Reference doesn't exist: " + context + " tries to reference " + str + ", which is not defined"
    );
  } else {
    return ref;
  }
}


module.exports = resolveObject;
