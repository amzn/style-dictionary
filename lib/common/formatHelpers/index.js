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
 *
 * @module formatHelpers
 */
 module.exports = {
  createPropertyFormatter: require('./createPropertyFormatter'),
  fileHeader: require('./fileHeader'),
  formattedVariables: require('./formattedVariables'),
  getTypeScriptType: require('./getTypeScriptType'),
  iconsWithPrefix: require('./iconsWithPrefix'),
  sortByReference: require('./sortByReference'),
  sortByName: require('./sortByName'),
  minifyDictionary: require('./minifyDictionary'),
  setSwiftFileProperties: require('./setSwiftFileProperties')
}