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

var transformTypes = ['name', 'value', 'attribute'];

/**
 * Add a custom transform to the Style Dictionary
 * Transforms can manipulate a property's name, value, or attributes
 *
 * @static
 * @name registerTransform
 * @memberof module:style-dictionary
 * @function
 * @param {Object} transform - Transform object
 * @param {String} transform.type - Type of transform, can be: name, attribute, or value
 * @param {String} transform.name - Name of the transformer (used by transformGroup to call a list of transforms).
 * @param {Function} [transform.matcher] - Matcher function, return boolean if transform should be applied. If you omit the matcher function, it will match all properties.
 * @param {Function} transform.transformer Performs a transform on a property object, should return a string or object depending on the type. Will only update certain properties by which you can't mess up property objects on accident.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerTransform({
 *   name: 'time/seconds',
 *   type: 'value',
 *   matcher: function(prop) {
 *     return prop.attributes.category === 'time';
 *   },
 *   transformer: function(prop) {
 *     // Note the use of prop.original.value,
 *     // before any transforms are performed, the build system
 *     // clones the original property to the 'original' attribute.
 *     return (parseInt(prop.original.value) / 1000).toString() + 's';
 *   }
 * });
 * ```
 */
function registerTransform(options) {
  if (typeof options.type !== 'string')
    throw new Error('type must be a string');
  if (transformTypes.indexOf(options.type) < 0)
    throw new Error(options.type + ' type is not one of: ' + transformTypes.join(', '));
  if (typeof options.name !== 'string')
    throw new Error('name must be a string');
  if (options.matcher && typeof options.matcher !== 'function')
    throw new Error('matcher must be a function');
  if (typeof options.transformer !== 'function')
    throw new Error('transformer must be a function');

  this.transform[options.name] = {
    type: options.type,
    matcher: options.matcher,
    transformer: options.transformer
  };

  return this;
}


module.exports = registerTransform;
