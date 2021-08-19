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

/**
 * Given some value, returns a basic valid TypeScript type for that value.
 * Supports numbers, strings, booleans, and arrays of any of those types.
 * 
 * @memberof module:formatHelpers
 * @example
 * ```javascript
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, options }) {
 *    return dictionary.allProperties.map(function(prop) {
 *      var to_ret_prop = 'export const ' + prop.name + ' : ' + getTypeScriptType(prop.value) + ';';
 *      if (prop.comment)
 *        to_ret_prop = to_ret_prop.concat(' // ' + prop.comment);
 *      return to_ret_prop;
 *    }).join('\n');
 *   }
 * });
 * 
 * @param {*} value A value to check the type of.
 * @return {String} A valid name for a TypeScript type.
 * ```
 */
 function getTypeScriptType(value) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const firstValueType = getTypeScriptType(value[0]);
        if (value.every((v) => getTypeScriptType(v) === firstValueType)) {
          return firstValueType + '[]';
        }
      }
      return 'any[]';
    }
  
    const type = typeof value;
    if (['string', 'number', 'boolean'].includes(type)) return type;
    return 'any';
  }
  
  module.exports = getTypeScriptType;