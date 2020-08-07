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

var _ = require("lodash")

/**
 * Takes a nested object of properties and filters them using the provided
 * function.
 *
 * @param {Object} properties
 * @param {Function} filter - A function that receives a property object and
 *   returns `true` if the property should be included in the output or `false`
 *   if the property should be excluded from the output.
 * @returns {Object[]} properties - A new object containing only the properties
 *   that matched the filter.
 */
function filterPropertyObject(properties, filter) {
  // Use reduce to generate a new object with the unwanted properties filtered
  // out
  return _.reduce(properties, (result, value, key) => {
    // If the value is not an object, we don't know what it is. We return it as-is.
    if (!_.isObject(value)) {
      return result
    // If the value has a `value` member we know it's a property, pass it to
    // the filter function and either include it in the final `result` object or
    // exclude it (by returning the `result` object without it added).
    } else if (typeof value.value !== 'undefined') {
      return filter(value) ? _.assign(result, { [key]: value }) : result
    // If we got here we have an object that is not a property. We'll assume
    // it's an object containing multiple properties and recursively filter it
    // using the `filterPropertyObject` function.
    } else {
      const filtered = filterPropertyObject(value, filter)
      // If the filtered object is not empty then add it to the final `result`
      // object. If it is empty then every property inside of it was filtered
      // out, then exclude it entirely from the final `result` object.
      return _.isEmpty(filtered) ? result : _.assign(result, { [key]: filtered })
    }
  }, {})
}

/**
 * Takes an array of properties and filters them using the provided function.
 *
 * @param {Object[]} properties
 * @param {Function} filter - A function that receives a property object and
 *   returns `true` if the property should be included in the output or `false`
 *   if the property should be excluded from the output.
 * @returns {Object[]} properties - A new array containing only the properties
 *   that matched the filter.
 */
function filterPropertyArray(properties, filter) {
  // Go lodash!
  return _.filter(properties, filter)
}

/**
 * Takes a dictionary and filters the `allProperties` array and the `properties`
 * object using a function provided by the user.
 *
 * @param {Object} dictionary
 * @param {Function} filter - A function that receives a property object
 *   and returns `true` if the property should be included in the output
 *   or `false` if the property should be excluded from the output
 * @returns {Object} dictionary - A new dictionary containing only the
 *   properties that matched the filter (or the original dictionary if no filter
 *   function was provided).
 */
function filterProperties(dictionary, filter) {
  if (!filter) {
    return dictionary
  } else {
    return _.assign({}, dictionary, {
      allProperties: filterPropertyArray(dictionary.allProperties, filter),
      properties: filterPropertyObject(dictionary.properties, filter)
    })
  }
}

module.exports = filterProperties
