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

import isPlainObject from 'is-plain-obj';

/**
 * @typedef {import('../../types/DesignToken.d.ts').DesignTokens} DesignTokens
 * @typedef {import('../../types/Preprocessor.d.ts').Preprocessor} Preprocessor
 * @typedef {import('../../types/Preprocessor.d.ts').preprocessor} preprocessor
 */

/**
 * @param {DesignTokens} tokens
 * @returns
 */
function typeW3CDelegate(tokens) {
  const clone = structuredClone(tokens);

  /**
   * @param {DesignTokens} slice
   * @param {string} [_type]
   */
  const recurse = (slice, _type) => {
    Object.values(slice).forEach((prop) => {
      let type = _type; // keep track of type through the stack
      if (isPlainObject(prop)) {
        if (typeof prop.$type === 'string') {
          type = prop.$type;
        }
        // prop is a design token, but no $type prop currently,
        // so we add it if we know what the type is from our ancestor tree
        if ((prop.$value || prop.value) && !prop.$type && type) {
          prop.$type = type;
        }
        recurse(prop, type);
      }
    });
  };

  recurse(clone);
  return clone;
}

/**
 * Run all registered preprocessors on the dictionary,
 * returning the preprocessed dictionary in each step.
 *
 * @param {DesignTokens} tokens
 * @param {Record<string, preprocessor>} [preprocessorObj]
 * @returns {Promise<DesignTokens>}
 */
export async function preprocess(tokens, preprocessorObj = {}) {
  let processedTokens = typeW3CDelegate(tokens);

  const preprocessors = Object.values(preprocessorObj);
  if (preprocessors.length > 0) {
    for (const preprocessor of preprocessors) {
      processedTokens = await preprocessor(processedTokens);
    }
  }
  return processedTokens;
}
