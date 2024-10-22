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
 * @typedef {import('../../types/DesignToken.d.ts').PreprocessedTokens} PreprocessedTokens
 * @typedef {import('../../types/Config.d.ts').Config} Config
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Preprocessor.d.ts').Preprocessor} Preprocessor
 */

/**
 * Run all registered preprocessors on the dictionary,
 * returning the preprocessed dictionary in each step.
 *
 * @param {PreprocessedTokens} tokens
 * @param {string[]} [appliedPreprocessors]
 * @param {Record<string, Preprocessor['preprocessor']>} [preprocessorObj]
 * @param {Config|PlatformConfig} [options]
 * @returns {Promise<PreprocessedTokens>}
 */
export async function preprocess(
  tokens,
  appliedPreprocessors = [],
  preprocessorObj = {},
  options = {},
) {
  let processedTokens = tokens;

  const preprocessors = Object.entries(preprocessorObj);
  if (preprocessors.length > 0) {
    for (const [key, preprocessor] of preprocessors) {
      if (appliedPreprocessors.includes(key)) {
        processedTokens = await preprocessor(processedTokens, options);
      }
    }
  }

  return /** @type {PreprocessedTokens} */ (processedTokens);
}
