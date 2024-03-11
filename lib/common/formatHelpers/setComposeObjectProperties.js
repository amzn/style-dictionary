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
 * @typedef {import('../../../types/Config.d.ts').LocalOptions} Options
 */

/**
 * Outputs an object for compose format configurations. Sets import.
 * @memberof module:formatHelpers
 * @name setComposeObjectProperties
 * @param {{import?:string[]}} [options] - The options object declared at configuration
 * @returns {Object}
 */
export default function setComposeObjectProperties(options = {}) {
  if (typeof options.import === 'undefined') {
    options.import = ['androidx.compose.ui.graphics.Color', 'androidx.compose.ui.unit.*'];
  } else if (typeof options.import === 'string') {
    options.import = [options.import];
  }

  return options;
}
