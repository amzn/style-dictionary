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

var flattenProperties = require('./utils/flattenProperties'),
    transformConfig = require('./transform/config'),
    cleanFiles = require('./cleanFiles'),
    cleanActions = require('./cleanActions');

/**
 * Takes a platform and performs all transforms to
 * the properties object (non-mutative) then
 * cleans all the files and cleans any actions.
 *
 * @memberOf StyleDictionary
 * @param {String} platform
 * @returns {StyleDictionary}
 */
var _ = require('lodash');

function cleanPlatform(platform) {
  console.log('\n' + platform);

  if (!this.options || !_.has(this.options.platforms, platform)) {
    throw new Error('Platform ' + platform + ' doesn\'t exist');
  }

  var properties;
  // We don't want to mutate the original object
  var platformConfig = transformConfig(this.options.platforms[platform], this);

  // We need to transform the object before we resolve the
  // variable names because if a value contains concatenated
  // values like "1px solid {color.border.base}" we want to
  // transform the original value (color.border.base) before
  // replacing that value in the string.
  properties = this.exportPlatform(platform);

  // This is the dictionary object we pass to the file
  // cleaning and action methods.
  var dictionary = {
    properties: properties,
    allProperties: flattenProperties( properties )
  };

  // We remove actions first, then files (and then directories as part of the files clean)
  cleanActions(dictionary, platformConfig);
  cleanFiles(dictionary, platformConfig);

  // For chaining
  return this;
}


module.exports = cleanPlatform;
