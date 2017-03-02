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
 * Add a custom action to the style property builder. Custom
 * actions can do whatever you need, such as: copying files,
 * base64'ing files, running other build scripts, etc.
 *
 * @memberOf StyleDictionary
 * @param {Object} options
 * @param {String} options.name - The name of the action
 * @param {Function} options.action - The action in the form of a function.
 * @returns {StyleDictionary}
 */
function registerAction(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (typeof options.action !== 'function')
    throw new Error('format formatter must be a function');

  this.action[options.name] = options.action;
  return this;
}

module.exports = registerAction;
