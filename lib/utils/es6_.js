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

import * as ChangeCase from 'change-case';

export const reduce = function (obj, f, accumulator_init) {
  return Object.keys(obj || {}).reduce((accumulator, key) => {
    let value = obj[key];
    return f(accumulator, value, key, obj);
  }, accumulator_init);
};

export const forEach = function (obj, f) {
  Object.keys(obj || {}).forEach((key) => {
    let value = obj[key];
    f(value, key);
  });
};

// Note: This is a crappy version to a certain extent... don't use with Strings, for example...
export const clone = function (object) {
  return Object.assign(new object.constructor(), object);
};

export const cloneDeep = function (obj) {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = cloneDeep(item);
      return arr;
    }, []);
  }

  if (obj instanceof Object) {
    return Object.keys(obj || {}).reduce((cpObj, key) => {
      cpObj[key] = cloneDeep(obj[key]);
      return cpObj;
    }, {});
  }
};

export const isObject = function (value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
};

export const isString = function (obj) {
  return typeof obj === 'string' || obj instanceof String;
};

export const isArray = function (obj) {
  return Array.isArray(obj);
};

export const isEmpty = function (obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
};

export function isPlainObject(value) {
  if (
    typeof value !== 'object' ||
    value === null ||
    Object.prototype.toString.call(value) !== '[object Object]'
  ) {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

export const filter = function (arr, filter) {
  if (typeof filter !== 'function') {
    throw 'filter is not a function';
  }
  if (typeof arr === 'undefined') {
    return [];
  }
  return arr.filter(filter);
};

export const assign = function () {
  let args = Array.prototype.slice.call(arguments);
  args.unshift({});
  return Object.assign(...args);
};

/* global Set */
export const pull = function (arr, ...removeList) {
  var removeSet = new Set(removeList);
  for (let i = arr.length - 1; i >= 0; i--) {
    if (removeSet.has(arr[i])) {
      arr.splice(i, 1);
    }
  }
};

export const unique = function (arr) {
  return [...new Set(arr)];
};

export const upperFirst = function (str) {
  return str ? str[0].toUpperCase() + str.substr(1) : '';
};

const matchFn = function (inputObj, testObj) {
  if (isObject(testObj)) {
    return Object.keys(testObj).every((key) => matchFn(inputObj[key], testObj[key]));
  } else {
    return inputObj == testObj;
  }
};

export const matches = function (matchObj) {
  let cloneObj = cloneDeep(matchObj);
  let matchesFn = (inputObj) => matchFn(inputObj, cloneObj);
  return matchesFn;
};

const DEFAULT_OPTIONS = {
  transform: ChangeCase.camelCaseTransformMerge,
};
export const changeDefaultCaseTransform = function (caseFunction, default_options) {
  return (caseToChange, options) =>
    caseFunction(caseToChange, Object.assign({}, DEFAULT_OPTIONS, default_options, options));
};

// aliases
export const each = forEach;
export const forIn = forEach;
export const camelCase = changeDefaultCaseTransform(ChangeCase.camelCase);
export const snakeCase = ChangeCase.snakeCase;
export const kebabCase = ChangeCase.paramCase;
