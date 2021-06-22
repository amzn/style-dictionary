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

const deepExtend = require('./deepExtend');

function createFormatArgs({ dictionary, platform, file = {} }) {
  const {allProperties, properties, allTokens, tokens, usesReference, getReferences} = dictionary;
  // This will merge platform and file-level configuration
  // where the file configuration takes precedence
  const {options} = platform;
  file = deepExtend([{}, {options}, file]);

  return {
    dictionary,
    usesReference,
    getReferences,
    allProperties,
    properties,
    // adding tokens and allTokens as the new way starting in v3,
    // keeping properties and allProperties around for backwards-compatibility
    allTokens,
    tokens,
    platform,
    file,
    options: file.options || {}
  }
}

module.exports = createFormatArgs;