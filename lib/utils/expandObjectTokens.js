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
import { resolveReferences } from './references/resolveReferences.js';
import usesReferences from './references/usesReferences.js';

/**
 * @typedef {import('../../types/DesignToken.d.ts').DesignToken} DesignToken
 * @typedef {import('../../types/DesignToken.d.ts').DesignToken} DesignTokens
 * @typedef {import('../../types/Config.d.ts').Expand} Expand
 * @typedef {import('../../types/Config.d.ts').ExpandFilter} ExpandFilter
 * @typedef {import('../../types/Config.d.ts').Config} Config
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 */

/**
 * expandTypesMap and this function may be slightly confusing,
 * refer to the unit tests for a better explanation
 * @param {string} subtype
 * @param {string} compositionType
 * @param {Config['expandTypesMap']} expandTypesMap
 * @returns {string}
 */
export function getTypeFromMap(subtype, compositionType, expandTypesMap = {}) {
  // the map might exist within the compositionType
  const mapObjForComp = expandTypesMap[compositionType];
  // or instead, it may be on the top-level, independent of the compositionType
  const mappedSubType = expandTypesMap[subtype];
  if (typeof mapObjForComp === 'object' && mapObjForComp[subtype]) {
    return mapObjForComp[subtype];
    // the type mapping might be on the top-level, independent of the compositionType
  } else if (typeof mappedSubType === 'string') {
    return mappedSubType;
  }
  return subtype;
}

/**
 *
 * @param {DesignToken} token
 * @param {ExpandFilter | boolean} condition
 * @param {Config} opts
 * @param {PlatformConfig} [platform]
 */
function shouldExpand(token, condition, opts, platform) {
  if (typeof condition === 'function') {
    return condition(token, opts, platform);
  }
  return condition;
}
// { expand, expandTypesMap, config, platform }
/**
 * @param {DesignToken} token
 * @param {Config} opts
 */
export function expandToken(token, opts) {
  const uses$ = opts.usesDtcg;
  // create a copy of the token without the value/type, so that we have all the meta props
  // which have to be inherited in the expanded tokens.
  /** @type {Record<string, unknown>} */
  const copyMeta = {};
  Object.keys(token)
    // either filter $value & $type, or value and type depending on whether $ is used
    .filter(
      (key) =>
        !['$value', 'value', '$type', 'type']
          .filter((key) => (uses$ ? key.startsWith('$') : !key.startsWith('$')))
          .includes(key),
    )
    .forEach((key) => {
      copyMeta[key] = token[key];
    });

  const value = uses$ ? token.$value : token.value;
  // the $type and type may both be missing if the $type is coming from an ancestor token group,
  // however, prior to expand and preprocessors, we run a step so missing $type is added from the closest ancestor
  const compositionType = /** @type {string} */ (token.$type ?? token.type);
  /** @type {DesignTokens} */
  const expandedTokenObj = {};

  // array of objects is also valid e.g. multi-shadow values
  // https://github.com/design-tokens/community-group/issues/100 there seems to be a consensus for this
  // so this code adds forward-compatibility with that
  const _value = Array.isArray(value) ? value : [value];

  _value.forEach((objectVal, index, arr) => {
    let expandedTokenObjRef = expandedTokenObj;
    // more than 1 means multi-value, meaning we should add nested token group
    // with index to the expanded result
    if (arr.length > 1) {
      expandedTokenObj[index + 1] = {};
      expandedTokenObjRef = expandedTokenObjRef[index + 1];
    }
    Object.entries(objectVal).forEach(([key, value]) => {
      expandedTokenObjRef[key] = {
        ...copyMeta,
        [`${uses$ ? '$' : ''}value`]: value,
        [`${uses$ ? '$' : ''}type`]: getTypeFromMap(
          key,
          compositionType,
          opts.expandTypesMap ?? {},
        ),
      };
    });
  });

  return expandedTokenObj;
}

/**
 * @param {DesignTokens | DesignToken} slice
 * @param {DesignTokens} original
 * @param {Config} opts
 * @param {PlatformConfig} [platform]
 */
function expandTokensRecurse(slice, original, opts, platform) {
  for (const key in slice) {
    const token = slice[key];
    if (typeof token !== 'object' || token === null) {
      continue;
    }
    const uses$ = opts.usesDtcg;
    let value = uses$ ? token.$value : token.value;
    const type = token.$type ?? token.type;
    const expand = platform?.expand ?? opts.expand;
    const expandCondition = /** @type {ExpandFilter | boolean} */ (
      ['function', 'boolean'].includes(typeof expand)
        ? expand
        : // nested/keyed on composition type
          /** @type {Expand} */ (expand)[type]
    );

    if (value) {
      if (shouldExpand(token, expandCondition, opts)) {
        // if our token is a ref, we have to resolve it first in order to expand its value
        if (typeof value === 'string' && usesReferences(value)) {
          value = resolveReferences(value, original, { usesDtcg: uses$ });
          token[uses$ ? '$value' : 'value'] = value;
        }
        if (typeof value === 'object') {
          slice[key] = expandToken(token, opts);
        }
      }
    } else {
      expandTokensRecurse(token, original, opts, platform);
    }
  }
}

/**
 * @param {DesignTokens} dictionary
 * @param {Config} opts
 * @param {PlatformConfig} [platform]
 */
export function expandTokens(dictionary, opts, platform) {
  // create a copy in which we will do mutations
  const copy = structuredClone(dictionary);
  // create a separate copy to check as the original object
  const original = structuredClone(dictionary);
  expandTokensRecurse(copy, original, opts, platform);
  return copy;
}
