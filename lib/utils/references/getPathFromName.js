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
 * Returns the path from a path name be splitting the name by separator '.'.
 * @private
 * @param {string} pathName
 * @returns {string[]} - The path
 */
export default function getPathFromName(pathName) {
  if (typeof pathName !== 'string') {
    throw new Error('Getting path from name failed. Token name must be a string');
  }
  return pathName.split('.');
}
