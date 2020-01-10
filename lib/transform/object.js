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
  usesValueReference = require('../utils/references/usesReference'),
  getName = require('../utils/references/getName'),
  transformProperty = require('./property'),
  propertySetup = require('./propertySetup');

/**
 * Applies transforms on all properties. This
 * does not happen inline, rather it is functional
 * and returns a new object. By doing this,
 * we can perform transforms for different platforms
 * on the same style dictionary.
 * @private
 * @param {Object} obj
 * @param {Object} options
 * @param {Object} [transformationContext={}]
 * @param {Array} [path=[]]
 * @param {Object} [transformedObj={}]
 * @returns {Object}
 */
function transformObject(obj, options, transformationContext = {}, path, transformedObj) {
  transformedObj = transformedObj || {};
  path = path || [];
  const {transformedPropRefs = [], deferredPropValueTransforms = []} = transformationContext;

  for (const name in obj) {
    if (!obj.hasOwnProperty(name)) {
      continue;
    }

    path.push(name);

    const pathName = getName(path);
    const objProp = obj[name];
    const alreadyTransformed = transformedPropRefs.indexOf(pathName) !== -1;
    const isPlainObject = _.isPlainObject(objProp);
    const transformationNeeded = !alreadyTransformed && isPlainObject;

    if (!transformationNeeded) {
      transformedObj[name] = objProp;
      path.pop();
      continue;
    }

    // is the objProp a style property?
    // {
    //   value: "#ababab"
    //   ...
    // }
    if ('value' in objProp) {
      const setupProperty = propertySetup(objProp, name, path);

      if (usesValueReference(setupProperty.value, options)) {
        deferredPropValueTransforms.push(pathName);
        transformedObj[name] = setupProperty;
        path.pop();
        continue;
      }

      const transformedObjectValue = transformProperty(setupProperty, options);
      _.pull(deferredPropValueTransforms, pathName);

      // transformed anything?
      if (setupProperty.value !== transformedObjectValue.value) {
        transformedPropRefs.push(pathName);
      }

      transformedObj[name] = transformedObjectValue;
      path.pop();
      continue;
    }

    // objectValue is not a property -> go deeper down the object tree
    transformedObj[name] = {};
    transformObject(objProp, options, transformationContext, path, transformedObj[name]);
    path.pop();
  }

  return transformedObj;
}


module.exports = transformObject;
