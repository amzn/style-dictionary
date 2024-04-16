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
 * Outputs an object with C# format configurations. Sets access modifier.
 * @memberof module:formatHelpers
 * @name setCSharpFileProperties
 * @param {{accessModifier?: string;}} options - The options object declared at configuration
 * @returns {Object}
 */
export default function setCSharpFileProperties(options) {
  if (typeof options.accessModifier === 'undefined') {
    options.accessModifier = 'public ';
  } else {
    if (options.accessModifier !== '') {
      options.accessModifier = `${options.accessModifier} `;
    }
  }

  return options;
}
