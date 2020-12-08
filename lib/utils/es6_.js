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

let forEach = function(obj, f) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    f(value, key)
  });
}

let cloneDeep = function(obj) {
  if(obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if(obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = cloneDeep(item);
      return arr;
    }, []);
  }

  if(obj instanceof Object) {
    return Object.keys(obj).reduce((cpObj, key) => {
      cpObj[key] = cloneDeep(obj[key]);
      return cpObj;
    }, {})
  }
}

let isString = function(obj) {
  return typeof obj === 'string' || obj instanceof String
}

let isArray = function(obj) {
  return Array.isArray(obj)
}

module.exports = {
  each: forEach,
  forEach: forEach,
  forIn: forEach,
  keys: Object.keys,
  cloneDeep: cloneDeep,
  isString: isString,
  isArray: isArray,
}
