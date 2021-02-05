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

const flattenProperties = require('./flattenProperties');
const getReference = require('./references/getReference');
const usesReference = require('./references/usesReference');

/**
 *
 * @typedef Dictionary
 * @property {Object} properties
 * @property {Array} allProperties
 * @property {Dictionary.getReference} getReference
 * @property {Dictionary.usesReference} usesReference
 */

/**
 * Creates the dictionary object that is passed to formats and actions.
 * @param {Object} args
 * @param {Object} args.properties
 * @returns {Dictionary}
 */
function createDictionary({ properties }) {
  return {
    properties: properties,
    allProperties: flattenProperties( properties ),
    getReference: getReference,
    usesReference: usesReference
  }
}

module.exports = createDictionary;