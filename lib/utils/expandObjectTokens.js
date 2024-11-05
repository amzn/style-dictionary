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
import { deepmerge } from './deepmerge.js';
import isPlainObject from 'is-plain-obj';

/**
 * @typedef {import('../../types/DesignToken.d.ts').DesignToken} DesignToken
 * @typedef {import('../../types/DesignToken.d.ts').PreprocessedTokens} PreprocessedTokens
 * @typedef {import('../../types/Config.d.ts').Expand} Expand
 * @typedef {import('../../types/Config.d.ts').ExpandConfig} ExpandConfig
 * @typedef {import('../../types/Config.d.ts').ExpandFilter} ExpandFilter
 * @typedef {import('../../types/Config.d.ts').Config} Config
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 */

export const DTCGTypesMap = {
  // https://design-tokens.github.io/community-group/format/#border
  border: {
    style: 'strokeStyle',
    width: 'dimension',
  },
  // https://design-tokens.github.io/community-group/format/#transition
  transition: {
    delay: 'duration',
    // needs more discussion https://github.com/design-tokens/community-group/issues/103
    timingFunction: 'cubicBezier',
  },
  // https://design-tokens.github.io/community-group/format/#shadow
  shadow: {
    offsetX: 'dimension',
    offsetY: 'dimension',
    blur: 'dimension',
    spread: 'dimension',
  },
  // https://design-tokens.github.io/community-group/format/#gradient
  gradient: {
    position: 'number',
  },
  // https://design-tokens.github.io/community-group/format/#typography
  typography: {
    fontSize: 'dimension',
    letterSpacing: 'dimension',
    lineHeight: 'number',
  },
  // https://design-tokens.github.io/community-group/format/#object-value
  strokeStyle: {
    dashArray: 'dimension',
  },
};

/**
 * expandTypesMap and this function may be slightly confusing,
 * refer to the unit tests for a better explanation
 * @param {string} subtype
 * @param {string} compositionType
 * @param {Expand['typesMap']} expandTypesMap
 * @returns {string}
 */
export function getTypeFromMap(subtype, compositionType, expandTypesMap = {}) {
  const typeMap = deepmerge(DTCGTypesMap, expandTypesMap);
  // the map might exist within the compositionType
  const mapObjForComp = typeMap[compositionType];
  // or instead, it may be on the top-level, independent of the compositionType
  const mappedSubType = typeMap[subtype];
  if (typeof mapObjForComp === 'object' && mapObjForComp[subtype]) {
    return mapObjForComp[subtype];
    // the type mapping might be on the top-level, independent of the compositionType
  } else if (typeof mappedSubType === 'string') {
    return mappedSubType;
  }
  return subtype;
}

/**
 * @param {DesignToken} token
 * @param {Config} opts
 * @param {PlatformConfig} [platform]
 */
function shouldExpand(token, opts, platform) {
  const expand = platform?.expand ?? opts.expand ?? false;

  /** @type {ExpandFilter | boolean} */
  let condition = false;
  let reverse = false;

  if (typeof expand === 'function' || typeof expand === 'boolean') {
    condition = expand;
  } else {
    const type = /** @type {string} */ (opts.usesDtcg ? token.$type : token.type);
    if (expand.include === undefined && expand.exclude === undefined) {
      condition = true;
    }

    if (expand.include) {
      condition =
        typeof expand.include === 'function' ? expand.include : expand.include.includes(type);
    }

    if (/** @type {Expand} */ (expand).exclude) {
      if (expand.include) {
        throw Error(
          'expand.include should not be combined with expand.exclude, use one or the other.',
        );
      }
      condition =
        typeof expand.exclude === 'function' ? expand.exclude : expand.exclude.includes(type);
      reverse = true;
    }
  }

  let result = condition;
  if (typeof condition === 'function') {
    result = condition(token, opts, platform);
  }

  return reverse ? !result : result;
}

/**
 * @param {DesignToken} token
 * @param {Config} opts
 * @param {PlatformConfig} [platform]
 */
export function expandToken(token, opts, platform) {
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
  /** @type {PreprocessedTokens} */
  const expandedTokenObj = {};
  /** @type {Expand['typesMap']} */
  let typesMap = {};
  const expand = platform?.expand ?? opts.expand;
  if (typeof expand === 'object') {
    typesMap = expand.typesMap ?? {};
  }

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
        [`${uses$ ? '$' : ''}type`]: getTypeFromMap(key, compositionType, typesMap),
      };
      if (Array.isArray(expandedTokenObjRef[key].path)) {
        // if we're expanding on platform level, we already have a path property
        // we will need to adjust this by adding the new keys of th expanded tokens to the path array
        expandedTokenObjRef[key].path = [...expandedTokenObjRef[key].path, key];
      }
    });
  });

  return expandedTokenObj;
}

/**
 * @param {PreprocessedTokens | DesignToken} slice
 * @param {PreprocessedTokens} original
 * @param {Config} opts
 * @param {PlatformConfig} [platform]
 */
function expandTokensRecurse(slice, original, opts, platform) {
  for (const key in slice) {
    const token = slice[key];
    if (!isPlainObject(token) || token === null) {
      continue;
    }
    const uses$ = opts.usesDtcg;
    let value = uses$ ? token.$value : token.value;
    if (value) {
      // if our token is a ref, we have to resolve it first in order to expand its value
      if (typeof value === 'string' && usesReferences(value)) {
        try {
          value = resolveReferences(value, original, { usesDtcg: uses$ });
        } catch (e) {
          // do nothing, references may be broken but now is not the time to
          // complain about it, as we're just doing this here so we can expand
          // tokens that reference object-value tokens that need to be expanded
        }
      }

      if (
        isPlainObject(value) ||
        // support multi-value arrays where each item is an object, e.g. shadow tokens
        (Array.isArray(value) && value.every((sub) => isPlainObject(sub)))
      ) {
        // if the resolved value is an object, then we must assume it could get expanded and
        // we must set the value to the resolved value, since the reference might be broken after expansion
        slice[key][uses$ ? '$value' : 'value'] = value;

        if (shouldExpand(token, opts, platform)) {
          slice[key] = expandToken(token, opts, platform);
        }
      }
    }
    // We might expect an else statement here on the line above, but we also want
    // to recurse if a value is present so that we support expanding nested object values,
    // e.g. a border can have a style prop (strokeStyle) which itself
    // can also be an object value with dashArray and lineCap props.
    // More info: https://design-tokens.github.io/community-group/format/#example-border-composite-token-examples
    expandTokensRecurse(slice[key], original, opts, platform);
  }
}

/**
 * @param {PreprocessedTokens} dictionary
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
