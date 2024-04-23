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
 * @typedef {import('../../types/DesignToken.d.ts').DesignTokens} DesignTokens
 * @typedef {import('../../types/Preprocessor.d.ts').Preprocessor} Preprocessor
 */

/**
 * Run all registered preprocessors on the dictionary,
 * returning the preprocessed dictionary in each step.
 *
 * @param {DesignTokens} tokens
 * @param {Record<string, Omit<Preprocessor, 'name'>>} [preprocessorObj]
 * @param {string} [platform]
 * @returns {Promise<DesignTokens>}
 */
export async function preprocess(tokens, preprocessorObj = {}, platform) {
  let processedTokens = tokens;

  const preprocessors = Object.values(preprocessorObj);
  if (preprocessors.length > 0) {
    for (const pre of preprocessors) {
      if (pre.platform !== undefined) {
        if (pre.platform === platform) {
          processedTokens = await pre.preprocessor(processedTokens);
        }
      } else {
        processedTokens = await pre.preprocessor(processedTokens);
      }
    }
  }
  return processedTokens;
}
