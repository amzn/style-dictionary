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

import Color from 'tinycolor2';
import { join } from 'path-unified';
import { snakeCase, kebabCase, camelCase } from 'change-case';
import convertToBase64 from '../utils/convertToBase64.js';
import GroupMessages from '../utils/groupMessages.js';

/**
 * @typedef {import('../../types/Transform.d.ts').Transform} Transform
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Config.d.ts').Config} Config
 */

const UNKNOWN_CSS_FONT_PROPS_WARNINGS = GroupMessages.GROUP.UnknownCSSFontProperties;

/**
 * @param {string} str
 * @returns {string}
 */

const UNICODE_PATTERN = /&#x([^;]+);/g;
const camelOpts = {
  mergeAmbiguousCharacters: true,
};

/**
 * @param {Token} token
 * @param {Config} options
 * @returns {boolean}
 */
export function isColor(token, options) {
  return (
    (options.usesDtcg ? token.$type : token.type) === 'color' &&
    Color(options.usesDtcg ? token.$value : token.value).isValid()
  );
}

/**
 * @param {Token} token
 * @param {Config} options
 * @returns {boolean}
 */
function isDimension(token, options) {
  return (options.usesDtcg ? token.$type : token.type) === 'dimension';
}

/**
 * @param {Token} token
 * @param {Config} options
 * @returns {boolean}
 */
function isFontSize(token, options) {
  return (options.usesDtcg ? token.$type : token.type) === 'fontSize';
}

/**
 * @param {Token} token
 * @param {Config} options
 * @returns {boolean}
 */
function isAsset(token, options) {
  return (options.usesDtcg ? token.$type : token.type) === 'asset';
}

/**
 * @param {Token} token
 * @param {Config} options
 * @returns {boolean}
 */
function isContent(token, options) {
  return (options.usesDtcg ? token.$type : token.type) === 'content';
}

/**
 * @param {string} character
 * @param {Token} token
 * @param {Config} options
 * @returns {string}
 */
function wrapValueWith(character, token, options) {
  return `${character}${options.usesDtcg ? token.$value : token.value}${character}`;
}

/**
 * @param {Token} token
 * @param {Config} options
 * @returns {string}
 */
function wrapValueWithDoubleQuote(token, options) {
  return wrapValueWith('"', token, options);
}

/**
 * @param {string} name
 * @param {string|number} value
 * @param {string} unitType
 * @returns {string}
 */
function throwSizeError(name, value, unitType) {
  throw `Invalid Number: '${name}: ${value}' is not a valid number, cannot transform to '${unitType}' \n`;
}

/**
 * @param {PlatformConfig} config
 * @returns {number}
 */
function getBasePxFontSize(config) {
  return (config && config.basePxFontSize) || 16;
}

/**
 * @param {string} fontString
 */
function quoteWrapWhitespacedFont(fontString) {
  let fontName = fontString.trim();
  const isQuoted = fontName.startsWith("'") && fontName.endsWith("'");
  if (!isQuoted) {
    fontName = fontName.replace(/'/g, "\\'");
  }
  const hasWhiteSpace = new RegExp('\\s+').test(fontName);
  return hasWhiteSpace && !isQuoted ? `'${fontName}'` : fontName;
}

/**
 * @param {Token} token
 * @param {Config} options
 */
function processFontFamily(token, options) {
  const val = options.usesDtcg ? token.$value : token.value;
  const type = options.usesDtcg ? token.$type : token.type;

  /**
   * @param {string|string[]} _family
   * @returns
   */
  const processFamily = (_family) => {
    let family = _family;
    if (typeof family === 'string' && family.includes(',')) {
      family = family.split(',').map((part) => part.trim());
    }

    if (Array.isArray(family)) {
      return family.map((part) => quoteWrapWhitespacedFont(part)).join(', ');
    }

    return quoteWrapWhitespacedFont(family);
  };

  if (type === 'typography') {
    if (val.fontFamily) {
      return {
        ...val,
        fontFamily: processFamily(val.fontFamily),
      };
    }
    return val;
  }

  return processFamily(val);
}

/**
 * @param {Token} token
 * @param {Config} options
 */
function transformCubicBezierCSS(token, options) {
  const val = options.usesDtcg ? token.$value : token.value;
  const type = options.usesDtcg ? token.$type : token.type;

  /** @param {number[]|string} easing */
  const transformEasing = (easing) => {
    if (Array.isArray(easing)) {
      return `cubic-bezier(${easing.join(', ')})`;
    }
    return easing;
  };

  if (type === 'transition') {
    if (val.timingFunction) {
      return {
        ...val,
        timingFunction: transformEasing(val.timingFunction),
      };
    }
    return val;
  }
  return transformEasing(val);
}

/**
 * @namespace Transforms
 * @type {Record<string, Omit<Transform, 'name'>>}
 */
export default {
  /**
   * Adds: category, type, item, subitem, and state on the attributes object based on the location in the style dictionary.
   *
   * ```js
   * // Matches: all
   * // Returns:
   * {
   *   "category": "color",
   *   "type": "background",
   *   "item": "button",
   *   "subitem": "primary",
   *   "state": "active"
   * }
   * ```
   *
   * @memberof Transforms
   */
  'attribute/cti': {
    type: 'attribute',
    transform: function (token) {
      const attrNames = ['category', 'type', 'item', 'subitem', 'state'];
      const originalAttrs = token.attributes || {};
      /** @type {Record<string, string>} */
      const generatedAttrs = {};

      for (let i = 0; i < token.path.length && i < attrNames.length; i++) {
        generatedAttrs[attrNames[i]] = token.path[i];
      }

      return Object.assign(generatedAttrs, originalAttrs);
    },
  },

  /**
   * Adds: hex, hsl, hsv, rgb, red, blue, green.
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns
   * {
   *   "hex": "009688",
   *   "rgb": {"r": 0, "g": 150, "b": 136, "a": 1},
   *   "hsl": {"h": 174.4, "s": 1, "l": 0.294, "a": 1},
   *   "hsv": {"h": 174.4, "s": 1, "l": 0.588, "a": 1},
   * }
   * ```
   *
   * @memberof Transforms
   */
  'attribute/color': {
    type: 'attribute',
    filter: isColor,
    transform: function (token, _, options) {
      const color = Color(options.usesDtcg ? token.$value : token.value);
      return {
        hex: color.toHex(),
        rgb: color.toRgb(),
        hsl: color.toHsl(),
        hsv: color.toHsv(),
      };
    },
  },

  /**
   * Creates a human-friendly name
   *
   * ```js
   * // Matches: All
   * // Returns:
   * "button primary"
   * ```
   *
   * @memberof Transforms
   */
  'name/human': {
    type: 'name',
    transform: function (token) {
      return [token.attributes?.item, token.attributes?.subitem].join(' ');
    },
  },

  /**
   * Creates a camel case name. If you define a prefix on the platform in your config, it will prepend with your prefix
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "colorBackgroundButtonPrimaryActive"
   * "prefixColorBackgroundButtonPrimaryActive"
   * ```
   *
   * @memberof Transforms
   */
  'name/camel': {
    type: 'name',
    transform: function (token, config) {
      return camelCase([config.prefix].concat(token.path).join(' '), camelOpts);
    },
  },

  /**
   * Creates a kebab case name. If you define a prefix on the platform in your config, it will prepend with your prefix
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "color-background-button-primary-active"
   * "prefix-color-background-button-primary-active"
   * ```
   *
   * @memberof Transforms
   */
  'name/kebab': {
    type: 'name',
    transform: function (token, config) {
      return kebabCase([config.prefix].concat(token.path).join(' '));
    },
  },

  /**
   * Creates a snake case name. If you define a prefix on the platform in your config, it will prepend with your prefix
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "color_background_button_primary_active"
   * "prefix_color_background_button_primary_active"
   * ```
   *
   * @memberof Transforms
   */
  'name/snake': {
    type: 'name',
    transform: function (token, config) {
      return snakeCase([config.prefix].concat(token.path).join(' '));
    },
  },

  /**
   * Creates a constant-style name based on the full CTI of the token. If you define a prefix on the platform in your config, it will prepend with your prefix
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "COLOR_BACKGROUND_BUTTON_PRIMARY_ACTIVE"
   * "PREFIX_COLOR_BACKGROUND_BUTTON_PRIMARY_ACTIVE"
   * ```
   *
   * @memberof Transforms
   */
  'name/constant': {
    type: 'name',
    transform: function (token, config) {
      return snakeCase([config.prefix].concat(token.path).join(' ')).toUpperCase();
    },
  },

  /**
   * Creates a Pascal case name. If you define a prefix on the platform in your config, it will prepend with your prefix
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "ColorBackgroundButtonPrimaryActive"
   * "PrefixColorBackgroundButtonPrimaryActive"
   * ```
   *
   * @memberof Transforms
   */
  'name/pascal': {
    type: 'name',
    transform: function (token, config) {
      /** @param {string} str */
      const upperFirst = function (str) {
        return str ? str[0].toUpperCase() + str.slice(1) : '';
      };
      return upperFirst(camelCase([config.prefix].concat(token.path).join(' '), camelOpts));
    },
  },

  /**
   * Transforms the value into an RGB string
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * "rgb(0, 150, 136)"
   * ```
   *
   * @memberof Transforms
   */
  'color/rgb': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      return Color(options.usesDtcg ? token.$value : token.value).toRgbString();
    },
  },

  /**
   * Transforms the value into an HSL string or HSLA if alpha is present. Better browser support than color/hsl-4
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * "hsl(174, 100%, 29%)"
   * "hsl(174, 100%, 29%, .5)"
   * ```
   *
   * @memberof Transforms
   */
  'color/hsl': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      return Color(options.usesDtcg ? token.$value : token.value).toHslString();
    },
  },

  /**
   * Transforms the value into an HSL string, using fourth argument if alpha is present.
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * "hsl(174 100% 29%)"
   * "hsl(174 100% 29% / .5)"
   * ```
   *
   * @memberof Transforms
   */
  'color/hsl-4': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const color = Color(options.usesDtcg ? token.$value : token.value);
      const o = color.toHsl();
      const vals = `${Math.round(o.h)} ${Math.round(o.s * 100)}% ${Math.round(o.l * 100)}%`;
      if (color.getAlpha() === 1) {
        return `hsl(${vals})`;
      } else {
        return `hsl(${vals} / ${o.a})`;
      }
    },
  },

  /**
   * Transforms the value into an 6-digit hex string
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * "#009688"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      return Color(options.usesDtcg ? token.$value : token.value).toHexString();
    },
  },

  /**
   * Transforms the value into an 8-digit hex string
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * "#009688ff"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex8': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      return Color(options.usesDtcg ? token.$value : token.value).toHex8String();
    },
  },

  /**
   * Transforms the value into an 8-digit hex string for Android because they put the alpha channel first
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * "#ff009688"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex8android': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const str = Color(options.usesDtcg ? token.$value : token.value).toHex8();
      return '#' + str.slice(6) + str.slice(0, 6);
    },
  },

  /**
   * Transforms the value into a Color class for Compose
   *
   * ```kotlin
   * // Matches: token.type === 'color'
   * // Returns:
   * Color(0xFF009688)
   * ```
   *
   * @memberof Transforms
   */
  'color/composeColor': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const str = Color(options.usesDtcg ? token.$value : token.value).toHex8();
      return 'Color(0x' + str.slice(6) + str.slice(0, 6) + ')';
    },
  },

  /**
   * Transforms the value into an UIColor class for iOS
   *
   * ```objective-c
   * // Matches: token.type === 'color'
   * // Returns:
   * [UIColor colorWithRed:0.114f green:0.114f blue:0.114f alpha:1.000f]
   * ```
   *
   * @memberof Transforms
   */
  'color/UIColor': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const rgb = Color(options.usesDtcg ? token.$value : token.value).toRgb();
      return (
        '[UIColor colorWithRed:' +
        (rgb.r / 255).toFixed(3) +
        'f' +
        ' green:' +
        (rgb.g / 255).toFixed(3) +
        'f' +
        ' blue:' +
        (rgb.b / 255).toFixed(3) +
        'f' +
        ' alpha:' +
        rgb.a.toFixed(3) +
        'f]'
      );
    },
  },

  /**
   * Transforms the value into an UIColor swift class for iOS
   *
   * ```swift
   * // Matches: token.type === 'color'
   * // Returns:
   * UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 0.6)
   * ```
   *
   * @memberof Transforms
   */
  'color/UIColorSwift': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const { r, g, b, a } = Color(options.usesDtcg ? token.$value : token.value).toRgb();
      const rFixed = (r / 255.0).toFixed(3);
      const gFixed = (g / 255.0).toFixed(3);
      const bFixed = (b / 255.0).toFixed(3);
      return `UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})`;
    },
  },

  /**
   * Transforms the value into an UIColor swift class for iOS
   *
   * ```swift
   * // Matches: token.type === 'color'
   * // Returns:
   * Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 0.6)
   * ```
   *
   * @memberof Transforms
   */
  'color/ColorSwiftUI': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const { r, g, b, a } = Color(options.usesDtcg ? token.$value : token.value).toRgb();
      const rFixed = (r / 255.0).toFixed(3);
      const gFixed = (g / 255.0).toFixed(3);
      const bFixed = (b / 255.0).toFixed(3);
      return `Color(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, opacity: ${a})`;
    },
  },

  /**
   * Transforms the value into a hex or rgb string depending on if it has transparency
   *
   * ```css
   * // Matches: token.type === 'color'
   * // Returns:
   * #000000
   * rgba(0,0,0,0.5)
   * ```
   *
   * @memberof Transforms
   */
  'color/css': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const color = Color(options.usesDtcg ? token.$value : token.value);
      if (color.getAlpha() === 1) {
        return color.toHexString();
      } else {
        return color.toRgbString();
      }
    },
  },

  /**
   *
   * Transforms a color into an object with red, green, blue, and alpha
   * attributes that are floats from 0 - 1. This object is how Sketch stores
   * colors.
   *
   * ```js
   * // Matches: token.type === 'color'
   * // Returns:
   * {
   *   red: 0.5,
   *   green: 0.5,
   *   blue: 0.5,
   *   alpha: 1
   * }
   * ```
   * @memberof Transforms
   */
  'color/sketch': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      let color = Color(options.usesDtcg ? token.$value : token.value).toRgb();
      return {
        red: (color.r / 255).toFixed(5),
        green: (color.g / 255).toFixed(5),
        blue: (color.b / 255).toFixed(5),
        alpha: color.a,
      };
    },
  },

  /**
   * Transforms the value into a scale-independent pixel (sp) value for font sizes on Android. It will not scale the number.
   *
   * ```js
   * // Matches: token.type === 'fontSize'
   * // Returns:
   * "10.0sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/sp': {
    type: 'value',
    filter: isFontSize,
    transform: function (token, _, options) {
      const nonParsedVal = options.usesDtcg ? token.$value : token.value;
      const val = parseFloat(nonParsedVal);
      if (isNaN(val)) throwSizeError(token.name, nonParsedVal, 'sp');
      return val.toFixed(2) + 'sp';
    },
  },

  /**
   * Transforms the value into a density-independent pixel (dp) value for non-font sizes on Android. It will not scale the number.
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "10.0dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/dp': {
    type: 'value',
    filter: isDimension,
    transform: function (token, _, options) {
      const nonParsedVal = options.usesDtcg ? token.$value : token.value;
      const val = parseFloat(nonParsedVal);
      if (isNaN(val)) throwSizeError(token.name, nonParsedVal, 'dp');
      return val.toFixed(2) + 'dp';
    },
  },

  /**
   * Transforms the value into a useful object ( for React Native support )
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * {
   *  original: "10px",
   *  number: 10,
   *  decimal: 0.1, // 10 divided by 100
   *  scale: 160, // 10 times 16
   * }
   * ```
   *
   * @memberof Transforms
   */
  'size/object': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'object');

      return {
        original: value,
        number: parsedVal,
        decimal: parsedVal / 100,
        scale: parsedVal * getBasePxFontSize(config),
      };
    },
  },

  /**
   * Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes on Android. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```js
   * // Matches: token.type === 'fontSize'
   * // Returns:
   * "16.0sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToSp': {
    type: 'value',
    filter: isFontSize,
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'sp');
      return (parsedVal * baseFont).toFixed(2) + 'sp';
    },
  },

  /**
   * Transforms the value from a REM size on web into a density-independent pixel (dp) value for non font-sizes on Android. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "16.0dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToDp': {
    type: 'value',
    filter: isDimension,
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'dp');
      return (parsedVal * baseFont).toFixed(2) + 'dp';
    },
  },

  /**
   * Adds 'px' to the end of the number. Does not scale the number
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "10px"
   * ```
   *
   * @memberof Transforms
   */
  'size/px': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, _, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'px');
      return parsedVal + 'px';
    },
  },

  /**
   * Adds 'rem' to the end of the number. Does not scale the number
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "10rem"
   * ```
   *
   * @memberof Transforms
   */
  'size/rem': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, _, options) {
      const nonParsed = options.usesDtcg ? token.$value : token.value;
      // if the dimension already has a unit (non-digit / . period character)
      if (`${nonParsed}`.match(/[^0-9.]/g)) {
        return nonParsed;
      }
      const parsedVal = parseFloat(nonParsed);
      if (isNaN(parsedVal)) throwSizeError(token.name, nonParsed, 'rem');
      if (parsedVal === 0) return Number.isInteger(nonParsed) ? 0 : '0';
      return parsedVal + 'rem';
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) and adds 'pt' to the end.
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "16pt"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToPt': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'pt');
      return (parsedVal * baseFont).toFixed(2) + 'f';
    },
  },

  /**
   * Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes in Compose. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```kotlin
   * // Matches: token.type === 'fontSize'
   * // Returns:
   * "16.0.sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/compose/remToSp': {
    type: 'value',
    filter: isFontSize,
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'sp');
      return (parsedVal * baseFont).toFixed(2) + '.sp';
    },
  },

  /**
   * Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes in Compose. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```kotlin
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "16.0.dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/compose/remToDp': {
    type: 'value',
    filter: isDimension,
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'dp');
      return (parsedVal * baseFont).toFixed(2) + '.dp';
    },
  },

  /**
   * Adds the .em Compose extension to the end of a number. Does not scale the value
   *
   * ```kotlin
   * // Matches: token.type === 'fontSize'
   * // Returns:
   * "16.0em"
   * ```
   *
   * @memberof Transforms
   */
  'size/compose/em': {
    type: 'value',
    filter: isFontSize,
    transform: function (token, _, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'em');
      return parsedVal + '.em';
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) to get to points for Swift and initializes a CGFloat
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns: "CGFloat(16.00)""
   * ```
   *
   * @memberof Transforms
   */
  'size/swift/remToCGFloat': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'CGFloat');
      return `CGFloat(${(parsedVal * baseFont).toFixed(2)})`;
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) and adds 'px' to the end.
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "16px"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToPx': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, config, options) {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'px');
      return (parsedVal * baseFont).toFixed(0) + 'px';
    },
  },

  /**
   * Scales non-zero numbers to rem, and adds 'rem' to the end. If you define a "basePxFontSize" on the platform in your config, it will be used to scale the value, otherwise 16 (default web font size) will be used.
   *
   * ```js
   * // Matches: token.type === 'dimension'
   * // Returns:
   * "0"
   * "1rem"
   * ```
   *
   * @memberof Transforms
   */
  'size/pxToRem': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: (token, config, options) => {
      const value = options.usesDtcg ? token.$value : token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(config);

      if (isNaN(parsedVal)) {
        throwSizeError(token.name, value, 'rem');
      }

      if (parsedVal === 0) {
        return '0';
      }

      return `${parsedVal / baseFont}rem`;
    },
  },

  /**
   * Takes a unicode point and transforms it into a form CSS can use.
   *
   * ```js
   * // Matches: token.type === 'html'
   * // Returns:
   * "'\\E001'"
   * ```
   *
   * @memberof Transforms
   */
  'html/icon': {
    type: 'value',
    filter: function (token, options) {
      return (options.usesDtcg ? token.$type : token.type) === 'html';
    },
    transform: function (token, _, options) {
      return (options.usesDtcg ? token.$value : token.value).replace(
        UNICODE_PATTERN,
        /**
         * @param {string} match
         * @param {string} variable */
        function (match, variable) {
          return "'\\" + variable + "'";
        },
      );
    },
  },

  /**
   * Wraps the value in a single quoted string
   *
   * ```js
   * // Matches: token.type === 'content'
   * // Returns:
   * "'string'"
   * ```
   *
   * @memberof Transforms
   */
  'content/quote': {
    type: 'value',
    filter: isContent,
    transform: function (token, _, options) {
      return wrapValueWith("'", token, options);
    },
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objective-c
   * // Matches: token.type === 'content'
   * // Returns:
   * \@"string"
   * ```
   *
   * @memberof Transforms
   */
  'content/objC/literal': {
    type: 'value',
    filter: isContent,
    transform: function (token, _, options) {
      return '@' + wrapValueWithDoubleQuote(token, options);
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```swift
   * // Matches: token.type === 'content'
   * // Returns:
   * "string"
   * ```
   *
   * @memberof Transforms
   */
  'content/swift/literal': {
    type: 'value',
    filter: isContent,
    transform: (token, _, options) => wrapValueWithDoubleQuote(token, options),
  },

  /**
   * Assumes a time in miliseconds and transforms it into a decimal
   *
   * ```js
   * // Matches: token.type === 'time'
   * // Returns:
   * "0.5s"
   * ```
   *
   * @memberof Transforms
   */
  'time/seconds': {
    type: 'value',
    filter: function (token, options) {
      return (options.usesDtcg ? token.$type : token.type) === 'time';
    },
    transform: function (token, _, options) {
      return (parseFloat(options.usesDtcg ? token.$value : token.value) / 1000).toFixed(2) + 's';
    },
  },

  /**
   * Turns fontFamily tokens into valid CSS string values
   * https://design-tokens.github.io/community-group/format/#font-family
   * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
   *
   * ```js
   * // Matches: token.type === 'fontFamily'
   * // Returns:
   * "'Arial Narrow', Arial, sans-serif"
   * ```.
   *
   * @memberof Transforms
   */
  'fontFamily/css': {
    type: 'value',
    // typography properties can be references, while fontFamily prop might not
    transitive: true,
    filter: (token, options) => {
      const type = options.usesDtcg ? token.$type : token.type;
      return !!type && ['fontFamily', 'typography'].includes(type);
    },
    transform: (token, _, options) => {
      return processFontFamily(token, options);
    },
  },

  /**
   * Turns fontFamily tokens into valid CSS string values
   * https://design-tokens.github.io/community-group/format/#font-family
   * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
   *
   * ```js
   * // Matches: token.type === 'fontFamily'
   * // Returns:
   * "'Arial Narrow', Arial, sans-serif"
   * ```.
   *
   * @memberof Transforms
   */
  'cubicBezier/css': {
    type: 'value',
    // transition properties can be references, while timingFunction might not be
    transitive: true,
    filter: (token, options) => {
      const type = options.usesDtcg ? token.$type : token.type;
      return !!type && ['cubicBezier', 'transition'].includes(type);
    },
    transform: (token, _, options) => {
      return transformCubicBezierCSS(token, options);
    },
  },

  /**
   * Turns strokeStyle object-value tokens into stringified CSS fallback
   * https://design-tokens.github.io/community-group/format/#stroke-style
   * https://design-tokens.github.io/community-group/format/#example-fallback-for-object-stroke-style
   * CSS does not allow detailed control of the dash pattern or line caps on dashed borders, so we use dashed fallback
   * ```js
   * // Matches: token.type === 'border'
   * // Returns:
   * "dashed"
   * ```.
   *
   * @memberof Transforms
   */
  'strokeStyle/css/shorthand': {
    type: 'value',
    // border properties can be references, while style property might not be
    transitive: true,
    filter: (token, options) => (options.usesDtcg ? token.$type : token.type) === 'strokeStyle',
    transform: (token, _, options) => {
      const val = options.usesDtcg ? token.$value : token.value;
      if (typeof val !== 'object') {
        // already transformed to string
        return val;
      }
      return 'dashed';
    },
  },

  /**
   * Turns border tokens object-value into stringified CSS shorthand
   * https://design-tokens.github.io/community-group/format/#border
   *
   * ```js
   * // Matches: token.type === 'border'
   * // Returns:
   * "2px solid #000000"
   * ```.
   *
   * @memberof Transforms
   */
  'border/css/shorthand': {
    type: 'value',
    // border properties can be references
    transitive: true,
    filter: (token, options) => (options.usesDtcg ? token.$type : token.type) === 'border',
    transform: (token, _, options) => {
      const val = options.usesDtcg ? token.$value : token.value;
      if (typeof val !== 'object') {
        // already transformed to string
        return val;
      }
      const { color, width } = val;
      let { style } = val;

      // use fallback for style object value, since CSS does not allow
      // detailed control of the dash pattern or line caps on dashed borders
      // https://design-tokens.github.io/community-group/format/#example-fallback-for-object-stroke-style
      if (typeof style === 'object') {
        style = 'dashed';
      }
      return `${width ? `${width} ` : ''}${style ? `${style}` : 'none'}${color ? ` ${color}` : ''}`;
    },
  },

  /**
   * Turns typography tokens object-value into stringified CSS shorthand
   * https://design-tokens.github.io/community-group/format/#typography
   *
   * Available props within typography has been extended here
   * to include those available in CSS font shorthand:
   * https://developer.mozilla.org/en-US/docs/Web/CSS/font
   *
   * ```js
   * // Matches: token.type === 'typography'
   * // Returns:
   * "500 20px/1.5 Arial"
   * ```.
   *
   * @memberof Transforms
   */
  'typography/css/shorthand': {
    type: 'value',
    // typography properties can be references
    transitive: true,
    filter: (token, options) => (options.usesDtcg ? token.$type : token.type) === 'typography',
    transform: (token, platform, options) => {
      const val = options.usesDtcg ? token.$value : token.value;
      if (typeof val !== 'object') {
        // already transformed to string
        return val;
      }
      let { fontFamily } = val;
      const { fontWeight, fontVariant, fontWidth, fontSize, fontStyle, lineHeight } = val;

      const CSSShorthandProps = [
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontWidth',
        'fontSize',
        'lineHeight',
        'fontFamily',
      ];

      const unknownProps = Object.keys(val).filter((key) => !CSSShorthandProps.includes(key));
      if (unknownProps.length > 0) {
        GroupMessages.add(
          UNKNOWN_CSS_FONT_PROPS_WARNINGS,
          `${unknownProps.join(', ')} for token at ${token.path.join('.')}${
            token.filePath ? ` in ${token.filePath}` : ''
          }`,
        );
      }

      fontFamily = fontFamily ?? 'sans-serif';

      return `${fontStyle ? `${fontStyle} ` : ''}${fontVariant ? `${fontVariant} ` : ''}${
        fontWeight ? `${fontWeight} ` : ''
      }${fontWidth ? `${fontWidth} ` : ''}${
        fontSize ? `${fontSize}` : `${getBasePxFontSize(platform)}px`
      }${lineHeight ? `/${lineHeight} ` : ' '}${fontFamily}`;
    },
  },

  /**
   * Turns transition tokens object-value into stringified CSS shorthand
   * https://design-tokens.github.io/community-group/format/#border
   *
   * ```js
   * // Matches: token.type === 'transition'
   * // Returns:
   * "200ms linear 50ms"
   * ```.
   *
   * @memberof Transforms
   */
  'transition/css/shorthand': {
    type: 'value',
    // transition properties can be references
    transitive: true,
    filter: (token, options) => (options.usesDtcg ? token.$type : token.type) === 'transition',
    transform: (token, _, options) => {
      const val = options.usesDtcg ? token.$value : token.value;
      if (typeof val !== 'object') {
        // already transformed to string
        return val;
      }
      const { duration, delay, timingFunction } = val;

      return `${duration} ${timingFunction} ${delay}`;
    },
  },

  /**
   * Turns shadow tokens object-value into stringified CSS shorthand
   * https://design-tokens.github.io/community-group/format/#shadow
   *
   * ```js
   * // Matches: token.type === 'shadow'
   * // Returns:
   * "inset 2px 4px 10px 5px #000000"
   * ```.
   *
   * @memberof Transforms
   */
  'shadow/css/shorthand': {
    type: 'value',
    // shadow properties can be references
    transitive: true,
    filter: (token, options) => (options.usesDtcg ? token.$type : token.type) === 'shadow',
    transform: (token, _, options) => {
      const val = options.usesDtcg ? token.$value : token.value;
      if (typeof val !== 'object') {
        // already transformed to string
        return val;
      }

      /** @param {any} val */
      const stringifyShadow = (val) => {
        // check if the shadows are objects, they might already be transformed to strings if they were refs
        if (typeof val !== 'object') {
          return val;
        }
        const { type, color, offsetX, offsetY, blur, spread } = val;
        return `${type ? `${type} ` : ''}${offsetX ?? 0} ${offsetY ?? 0} ${blur ?? 0} ${
          spread ? `${spread} ` : ''
        }${color ?? `#000000`}`;
      };

      if (Array.isArray(val)) {
        return val.map(stringifyShadow).join(', ');
      }
      return stringifyShadow(val);
    },
  },

  /**
   * Wraps the value in a CSS url() function https://developer.mozilla.org/en-US/docs/Web/CSS/url
   *
   * ```js
   * // Matches: token.type === 'asset'
   * // Returns:
   * url("https://www.example.com/style.css")
   * ```
   *
   * @memberof Transforms
   */
  'asset/url': {
    type: 'value',
    filter: isAsset,
    transform: function (token, _, options) {
      return `url("${(options.usesDtcg ? token.$value : token.value).replace(/"/g, `\\"`)}")`;
    },
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```js
   * // Matches: token.type === 'asset'
   * // Returns:
   * 'IyBlZGl0b3Jjb25maWcub3JnCnJvb3QgPSB0cnVlCgpbKl0KaW5kZW50X3N0eWxlID0gc3BhY2UKaW5kZW50X3NpemUgPSAyCmVuZF9vZl9saW5lID0gbGYKY2hhcnNldCA9IHV0Zi04CnRyaW1fdHJhaWxpbmdfd2hpdGVzcGFjZSA9IHRydWUKaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSB0cnVlCgpbKi5tZF0KdHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gZmFsc2U='
   * ```
   *
   * @memberof Transforms
   */
  'asset/base64': {
    type: 'value',
    filter: isAsset,
    transform: function (token, _, options, vol) {
      return convertToBase64(options.usesDtcg ? token.$value : token.value, vol);
    },
  },

  /**
   * Prepends the local file path
   *
   * ```js
   * // Matches: token.type === 'asset'
   * // Returns:
   * "path/to/file/asset.png"
   * ```
   *
   * @memberof Transforms
   */
  'asset/path': {
    type: 'value',
    filter: isAsset,
    transform: function (token, _, options) {
      return join(process?.cwd() ?? '/', options.usesDtcg ? token.$value : token.value);
    },
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objective-c
   * // Matches: token.type === 'asset'
   * // Returns: \@"string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/objC/literal': {
    type: 'value',
    filter: isAsset,
    transform: function (token, _, options) {
      return '@' + wrapValueWithDoubleQuote(token, options);
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```swift
   * // Matches: token.type === 'asset'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/swift/literal': {
    type: 'value',
    filter: isAsset,
    transform: (token, _, options) => wrapValueWithDoubleQuote(token, options),
  },

  /**
   * Transforms the value into a Flutter Color object using 8-digit hex with the alpha chanel on start
   *  ```js
   *  // Matches: token.type === 'color'
   *  // Returns:
   *  Color(0xFF00FF5F)
   *  ```
   *  @memberof Transforms
   *
   */
  'color/hex8flutter': {
    type: 'value',
    filter: isColor,
    transform: function (token, _, options) {
      const str = Color(options.usesDtcg ? token.$value : token.value)
        .toHex8()
        .toUpperCase();
      return `Color(0x${str.slice(6)}${str.slice(0, 6)})`;
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```dart
   * // Matches: token.type === 'content'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'content/flutter/literal': {
    type: 'value',
    filter: isContent,
    transform: (token, _, options) => wrapValueWithDoubleQuote(token, options),
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```dart
   * // Matches: token.type === 'asset'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/flutter/literal': {
    type: 'value',
    filter: isAsset,
    transform: (token, _, options) => wrapValueWithDoubleQuote(token, options),
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) to get to points for Flutter
   *
   * ```dart
   * // Matches: token.type === 'dimension'
   * // Returns: 16.00
   * ```
   *
   * @memberof Transforms
   */
  'size/flutter/remToDouble': {
    type: 'value',
    filter: (token, options) => isDimension(token, options) || isFontSize(token, options),
    transform: function (token, config, options) {
      const baseFont = getBasePxFontSize(config);
      return (parseFloat(options.usesDtcg ? token.$value : token.value) * baseFont).toFixed(2);
    },
  },
};
