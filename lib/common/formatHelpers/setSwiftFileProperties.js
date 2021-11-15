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
 * @param {Object} file - The file object declare at configuration
 * @param {String} objectType - Type of the swift object.
 * @param {String} transformGroup - The transformGroup of the file, so it can be applied proper import
 * @returns {Object}
 */
function setSwiftFileProperties(file, objectType, transformGroup) {
  if (typeof file.objectType === 'undefined') {
    if (typeof objectType === 'undefined') {
      file.objectType = 'class';
    } else {
      file.objectType = objectType;
    }
  }

  if (typeof file.import === 'undefined') {
    if (typeof transformGroup === 'undefined') {
      file.import = ['UIKit'];
    } else if (['ios-swift', 'ios-swift-separate'].includes(transformGroup)) {
      file.import = ['UIKit'];
    } else {
      // future swift-ui transformGroup to be added here
      file.import = ['SwiftUI'];
    }
  } else if (typeof file.import === 'string') {
    file.import = [file.import];
  }

  if (typeof file.accessControl === 'undefined') {
    file.accessControl = 'public ';
  } else {
    file.accessControl = `${file.accessControl} `;
  }

  return file
}

module.exports = setSwiftFileProperties;