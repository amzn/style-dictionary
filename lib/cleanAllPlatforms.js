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
 * Does the reverse of [buildAllPlatforms](#buildAllPlatforms) by
 * performing a clean on each platform. This removes all the files
 * defined in the platform and calls the undo method on any actions.
 *
 * @static
 * @memberof module:style-dictionary
 * @returns {module:style-dictionary}
 */
function cleanAllPlatforms() {
  var self = this;

  _.forIn(this.options.platforms, function (platform, key) {
    self.cleanPlatform(key);
  });

  // For chaining
  return this;
}


module.exports = cleanAllPlatforms;
