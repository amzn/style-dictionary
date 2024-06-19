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
import type { DesignTokens } from '../types';

/**
 *
 * @param {Tokens} tokens
 * @returns
 */
export function detectDtcgSyntax(tokens: DesignTokens) {
  let usesDtcg = false;
  // depth-first because more likely to be faster than breadth-first
  // due to amount of tokens usually being much larger than depth of token groups
  const recurse = (slice: DesignTokens) => {
    Object.keys(slice).forEach((key) => {
      if (['$value', '$type'].includes(key)) {
        usesDtcg = true;
        return;
      }
      if (isPlainObject(slice[key])) {
        recurse(slice[key]);
      }
    });
  };
  recurse(tokens);
  return usesDtcg;
}