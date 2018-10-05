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
    handleErrors = require('./handleErrors');

var ERROR_TYPE = 'Property Reference Errors';

var current_context = []; // To maintain the context so we can test for circular definitions
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
  var errors = [];

  for (key in obj) {
    // We want to check for ignoredKeys, this is so
    // we can skip over attributes that should not be
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
    ref = selfRef(variable.trim(), updated_object, stack);

    if (ref) {
      if (typeof ref === 'string') {
        to_ret = value.replace(match, ref);

        // Recursive so we can compute multi-layer variables like a = b, b = c, so a = c
        if ( to_ret.indexOf('{') > -1 ) {
          var reference = to_ret.slice(1, -1);

          // Compare to found circular references
          var foundCircArr = Object.keys(foundCirc);
          if (foundCircArr.indexOf(reference)!==-1) {
            // If the current reference is a member of a circular reference, do nothing
            // originally this was an error message, but that seems misleading because the circular reference itself is what needs to be fixed
            // if(stack.filter(function(ref) {return foundCircArr.indexOf(ref)==-1}).length > 0) {
            //   handleErrors.add(ERROR_TYPE, stack[0] + ' cannot be resolved as it points to ' + reference + ', which is a member of a circular definition cycle.');
            // }
          }
          else if(stack.indexOf(reference)!==-1) {
            // If the current stack already contains the current reference, we found a new circular reference
            // chop down to just the circular part, save it to our circular reference info, and spit out an error
            var stackIndexReference = stack.indexOf(reference);
            var circStack = stack.slice(stackIndexReference);
            circStack.forEach(function(key) { foundCirc[key] = true; });
            circStack.push(reference);
            handleErrors.add(ERROR_TYPE, 'Circular definition cycle:  ' + circStack.join(', ') );
            // originally this was an error message about not being able to resolve the original reference, but that seems misleading because the circular reference itself is what needs to be fixed
            // if(stackIndexReference > 0) {
            //   handleErrors.add(ERROR_TYPE, stack[0] + ' reference resolves to ' + reference + ', which is a member of a circular definition cycle.');
            // }
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


function selfRef(string, obj, stack) {
  var i,
      ref=obj,
      array = string.split(options.separator),
      context = current_context.join(options.separator);

  for (i = 0; i < array.length; i++) {
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
    handleErrors.add(ERROR_TYPE, 'Reference doesn\'t exist: ' + context + ' tries to reference ' + string + ', which is not defined');
  }

  return ref;
}


module.exports = resolveObject;
