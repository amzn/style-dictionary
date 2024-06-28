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

import { isPlainObject } from 'is-plain-object';

/**
 * Takes an plain javascript object and will make a flat array of all the leaf nodes.
 * A leaf node in this context has a 'value' property. Potentially refactor this to
 * be more generic.
 * @private
 * @param  {Object} tokens - The plain object you want flattened into an array.
 * @param  {Array} [to_ret=[]] - Tokens array. This function is recursive therefore this is what gets passed along.
 * @return {Array}
 */
export default function flattenTokens(tokens, to_ret) {
  to_ret = to_ret || [];

  for (var name in tokens) {
    if (tokens.hasOwnProperty(name)) {
      // TODO: this is a bit fragile and arbitrary to stop when we get to a 'value' property.
      if (isPlainObject(tokens[name]) && 'value' in tokens[name]) {
        to_ret.push(tokens[name]);
      } else if (isPlainObject(tokens[name])) {
        flattenTokens(tokens[name], to_ret);
      }
    }
  }

  return to_ret;
}
