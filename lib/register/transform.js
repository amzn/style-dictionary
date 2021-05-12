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
 * Transforms can manipulate a token's name, value, or attributes
 *
 * @static
 * @name registerTransform
 * @memberof module:style-dictionary
 * @function
 * @param {Object} transform - Transform object
 * @param {String} transform.type - Type of transform, can be: name, attribute, or value
 * @param {String} transform.name - Name of the transformer (used by transformGroup to call a list of transforms).
 * @param {Boolean} transform.transitive - If the value transform should be applied transitively, i.e. should be applied to referenced values as well as absolute values.
 * @param {Function} [transform.matcher] - Matcher function, return boolean if transform should be applied. If you omit the matcher function, it will match all tokens.
 * @param {Function} transform.transformer Modifies a design token object. The transformer function will receive the token and the platform configuration as its arguments. The transformer function should return a string for name transforms, an object for attribute transforms, and same type of value for a value transform.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerTransform({
 *   name: 'time/seconds',
 *   type: 'value',
 *   matcher: function(token) {
 *     return token.attributes.category === 'time';
 *   },
 *   transformer: function(token) {
 *     // Note the use of prop.original.value,
 *     // before any transforms are performed, the build system
 *     // clones the original token to the 'original' attribute.
 *     return (parseInt(token.original.value) / 1000).toString() + 's';
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
    transitive: !!options.transitive,
    transformer: options.transformer
  };

  return this;
}


module.exports = registerTransform;
