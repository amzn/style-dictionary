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

/**
 * Takes a property object, a leaf node in a properties object, and
 * returns a new object that has some properties set. It clones the
 * original object for safekeeping, adds a name, adds an attributes object,
 * and a path array.
 * @private
 * @param {Object} property - the property object to setup
 * @param {String} name - The name of the property, which will should be its key in the object.
 * @param {Array} path - The path of keys to get to the property from the top level of the properties object.
 * @returns {Object} - A new object that is setup and ready to go.
 */
function propertySetup(property, name, path) {
  if (!property && !_.isPlainObject(property))
    throw new Error('Property object must be an object');
  if (!name || !_.isString(name))
    throw new Error('Name must be a string');
  if (!path || !_.isArray(path))
    throw new Error('Path must be an array');

  var to_ret = _.clone(property);

  // Only do this once
  if (!property.original) {
    // Initial property setup
    // Keep the original object properties; we will key off of them in the transforms
    to_ret.original = _.clone(property);
    // Copy the name - it will be our base name to transform
    to_ret.name = to_ret.name || name || '';
    // Create an empty attributes object that we can transform on it later
    to_ret.attributes = to_ret.attributes || {};
    // An array of the path down the object tree; we will use it to build readable names
    // like color_font_base
    to_ret.path = _.clone(path);
  }

  return to_ret;
}


module.exports = propertySetup;
