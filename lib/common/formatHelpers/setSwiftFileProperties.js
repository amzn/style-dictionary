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
 * Outputs an object with swift format configurations. Sets import, object type and access control.
 * @memberof module:formatHelpers
 * @param {Object} options - The options object declared at configuration
 * @param {String} objectType - The type of the object in the final file. Could be a class, enum, struct, etc.
 * @param {String} transformGroup - The transformGroup of the file, so it can be applied proper import
 * @returns {Object}
 */
function setSwiftFileProperties(options, objectType, transformGroup) {
  if (typeof options.objectType === 'undefined') {
    if (typeof objectType === 'undefined') {
      options.objectType = 'class';
    } else {
      options.objectType = objectType;
    }
  }

  if (typeof options.import === 'undefined') {
    if (typeof transformGroup === 'undefined') {
      options.import = ['UIKit'];
    } else if (['ios-swift', 'ios-swift-separate'].includes(transformGroup)) {
      options.import = ['UIKit'];
    } else {
      // future swift-ui transformGroup to be added here
      options.import = ['SwiftUI'];
    }
  } else if (typeof options.import === 'string') {
    options.import = [options.import];
  }

  if (typeof options.accessControl === 'undefined') {
    options.accessControl = 'public ';
  } else {
    if (options.accessControl !== "") {
      options.accessControl = `${options.accessControl} `;
    }
  }

  return options
}

module.exports = setSwiftFileProperties;