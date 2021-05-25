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
 * Performs the undo of any actions defined in a platform. Pretty
 * simple really. Actions should be an array of functions,
 * the calling function should map the functions accordingly.
 * @static
 * @private
 * @memberof module:style-dictionary
 * @param {Object} dictionary
 * @param {Object} platform
 * @returns {null}
 */
function cleanActions(dictionary, platform) {
  if (platform.actions) {
    platform.actions.forEach(function(action) {
      if (typeof action.undo === 'function') {
        action.undo(dictionary, platform);
      }
    });
  }
}


module.exports = cleanActions;
