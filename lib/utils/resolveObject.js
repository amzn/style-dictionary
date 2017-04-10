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

var _ = require('lodash');

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

  updated_object = _.clone(object);  // This object will be edited

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
    // We want to check for ignoredKeys, this is so
    // we can skip over attributes that should not be
    // mutated, like a copy of the original property.
    if (obj.hasOwnProperty(key) && (options.ignoreKeys||[]).indexOf(key) < 0) {
      current_context.push(key);
      if (typeof obj[key] === 'object') {
        traverseObj( obj[key] );
      } else {
        if (typeof obj[key] === 'string' && obj[key].indexOf('{') > -1) {
          obj[key] = compile_value( obj[key] );
        }
      }
      current_context.pop();
    }
  }

  return obj;
}



function compile_value(value) {
  var to_ret, ref;

  // Replace the reference inline, but don't replace the whole string because
  // references can be part of the value such as "1px solid {color.border.light}"
  value.replace(regex, function(match, variable) {
    // Find what the value is referencing
    ref = selfRef(variable, updated_object);

    if (ref) {
      if (typeof ref === 'string') {
        to_ret = value.replace(match, ref);

        // Recursive so we can compute multi-layer variables like a = b, b = c, so a = c
        if ( to_ret.indexOf('{') > -1 ) {
          to_ret = compile_value( to_ret );
        }
      } else {
        // if evaluated value is not a string, we want to keep the type
        to_ret = ref;
      }
    } else {
      // Leave the circular reference unchanged
      to_ret = value;
    }

    return to_ret;
  });

  return to_ret;
}


function selfRef(string, obj) {
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
    throw new Error('Reference doesn\'t exist: ' + string);
  }

  var test = options.opening_character + context + options.closing_character;

  if (typeof ref === 'string' && ref.indexOf(test) > -1) {
    throw new Error('Circular definition: ' + context + ' | ' + string);
  } else {
    return ref;
  }
}


module.exports = resolveObject;
