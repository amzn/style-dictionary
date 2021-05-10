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

var _ = require('../utils/es6_'),
  usesValueReference = require('../utils/references/usesReference'),
  getName = require('../utils/references/getName'),
  transformProperty = require('./property'),
  propertySetup = require('./propertySetup');

/**
 * Applies transforms on all tokens. This
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
    const objProp = obj[name];
    const isPlainObject = _.isPlainObject(objProp);

    // is the objProp a style property?
    // {
    //   value: "#ababab"
    //   ...
    // }
    if (isPlainObject && 'value' in objProp) {
      const pathName = getName(path);
      const alreadyTransformed = transformedPropRefs.indexOf(pathName) !== -1;

      // If the property is already transformed, just pass assign it to the
      // transformed object and move on.
      if (alreadyTransformed) {
        transformedObj[name] = objProp;
        path.pop();
        continue;
      }

      // Note: propertySetup won't re-run if property has already been setup
      // it is safe to run this multiple times on the same property.
      const setupProperty = propertySetup(objProp, name, path);

      // If property has a reference, defer its transformations until later
      if (usesValueReference(setupProperty.value, options)) {
        // If property path isn't in the deferred array, add it now.
        if (deferredPropValueTransforms.indexOf(pathName) === -1) {
          deferredPropValueTransforms.push(pathName);
        }

        transformedObj[name] = setupProperty;
        path.pop();
        continue;
      }

      // If we got here, the property hasn't been transformed yet and
      // does not use a value reference. Transform the property now and assign it.
      transformedObj[name] = transformProperty(setupProperty, options);
      // Remove the property path from the deferred transform list
      _.pull(deferredPropValueTransforms, pathName);
      // Add the property path to the transformed list so we don't transform it again.
      transformedPropRefs.push(pathName);
    } else if (isPlainObject) {
      // objProp is not a token -> go deeper down the object tree
      transformedObj[name] = transformObject(objProp, options, transformationContext, path, transformedObj[name]);
    } else {
      // objProp is not a token or an object then it is some other data in the
      // object we should just copy over. There might be metadata
      // like documentation in the object that is not part of a token/property.
      transformedObj[name] = objProp;
    }

    path.pop();
  }

  return transformedObj;
}


module.exports = transformObject;
