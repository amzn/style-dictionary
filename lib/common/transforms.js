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

/**
 * @typedef {import('../../types/Transform.d.ts').Transform} Transform
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} Options
 */

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
 * @returns {boolean}
 */
function isColor(token) {
  return token.attributes?.category === 'color';
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
function isSize(token) {
  return token.attributes?.category === 'size';
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
function isFontSize(token) {
  return (
    token.attributes?.category === 'size' &&
    (token.attributes.type === 'font' || token.attributes.type === 'icon')
  );
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
function isNotFontSize(token) {
  return (
    token.attributes?.category === 'size' &&
    token.attributes.type !== 'font' &&
    token.attributes.type !== 'icon'
  );
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
function isAsset(token) {
  return token.attributes?.category === 'asset';
}

/**
 * @param {Token} token
 * @returns {boolean}
 */
function isContent(token) {
  return token.attributes?.category === 'content';
}

/**
 * @param {string} character
 * @param {Token} token
 * @returns {string}
 */
function wrapValueWith(character, token) {
  return `${character}${token.$value ?? token.value}${character}`;
}

/**
 * @param {Token} token
 * @returns {string}
 */
function wrapValueWithDoubleQuote(token) {
  return wrapValueWith('"', token);
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
 * @param {Options} options
 * @returns {number}
 */
function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || 16;
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
    transformer: function (token) {
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
   * // Matches: token.attributes.category === 'color'
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
    matcher: isColor,
    transformer: function (token) {
      const color = Color(token.$value ?? token.value);
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
    transformer: function (token) {
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
  'name/cti/camel': {
    type: 'name',
    transformer: function (token, options) {
      return camelCase([options.prefix].concat(token.path).join(' '), camelOpts);
    },
  },

  /**
   * Creates a camel case name without the category at the front.  This is most useful when there is a class, struct, enum, etc.
   * that already has the category in it (e.g., StyleDictionaryColors.baseDarkRed instad of StyleDictionaryColors.colorBaseDarkRed).
   * If you define a prefix on the platform in your config, it will prepend with your prefix
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "backgroundButtonPrimaryActive"
   * "prefixBackgroundButtonPrimaryActive"
   * ```
   *
   * @memberof Transforms
   */
  'name/ti/camel': {
    type: 'name',
    transformer: function (token, options) {
      return camelCase(
        [options.prefix].concat(token.path.slice(1, token.path.length)).join(' '),
        camelOpts,
      );
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
  'name/cti/kebab': {
    type: 'name',
    transformer: function (token, options) {
      return kebabCase([options.prefix].concat(token.path).join(' '));
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
  'name/cti/snake': {
    type: 'name',
    transformer: function (token, options) {
      return snakeCase([options.prefix].concat(token.path).join(' '));
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
  'name/cti/constant': {
    type: 'name',
    transformer: function (token, options) {
      return snakeCase([options.prefix].concat(token.path).join(' ')).toUpperCase();
    },
  },

  /**
   * Creates a constant-style name on the type and item of the token. This is useful if you want to create different static classes/files for categories like `Color.BACKGROUND_BASE`. If you define a prefix on the platform in your config, it will prepend with your prefix.
   *
   * ```js
   * // Matches: all
   * // Returns:
   * "BACKGROUND_BUTTON_PRIMARY_ACTIVE"
   * "PREFIX_BACKGROUND_BUTTON_PRIMARY_ACTIVE"
   * ```
   *
   * @memberof Transforms
   */
  'name/ti/constant': {
    type: 'name',
    transformer: function (token, options) {
      const path = token.path.slice(1);
      return snakeCase([options.prefix].concat(path).join(' ')).toUpperCase();
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
  'name/cti/pascal': {
    type: 'name',
    transformer: function (token, options) {
      /** @param {string} str */
      const upperFirst = function (str) {
        return str ? str[0].toUpperCase() + str.slice(1) : '';
      };
      return upperFirst(camelCase([options.prefix].concat(token.path).join(' '), camelOpts));
    },
  },

  /**
   * Transforms the value into an RGB string
   *
   * ```js
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * "rgb(0, 150, 136)"
   * ```
   *
   * @memberof Transforms
   */
  'color/rgb': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      return Color(token.$value ?? token.value).toRgbString();
    },
  },

  /**
   * Transforms the value into an HSL string or HSLA if alpha is present. Better browser support than color/hsl-4
   *
   * ```js
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * "hsl(174, 100%, 29%)"
   * "hsl(174, 100%, 29%, .5)"
   * ```
   *
   * @memberof Transforms
   */
  'color/hsl': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      return Color(token.$value ?? token.value).toHslString();
    },
  },

  /**
   * Transforms the value into an HSL string, using fourth argument if alpha is present.
   *
   * ```js
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * "hsl(174 100% 29%)"
   * "hsl(174 100% 29% / .5)"
   * ```
   *
   * @memberof Transforms
   */
  'color/hsl-4': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const color = Color(token.$value ?? token.value);
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
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * "#009688"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      return Color(token.$value ?? token.value).toHexString();
    },
  },

  /**
   * Transforms the value into an 8-digit hex string
   *
   * ```js
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * "#009688ff"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex8': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      return Color(token.$value ?? token.value).toHex8String();
    },
  },

  /**
   * Transforms the value into an 8-digit hex string for Android because they put the alpha channel first
   *
   * ```js
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * "#ff009688"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex8android': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const str = Color(token.$value ?? token.value).toHex8();
      return '#' + str.slice(6) + str.slice(0, 6);
    },
  },

  /**
   * Transforms the value into a Color class for Compose
   *
   * ```kotlin
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * Color(0xFF009688)
   * ```
   *
   * @memberof Transforms
   */
  'color/composeColor': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const str = Color(token.$value ?? token.value).toHex8();
      return 'Color(0x' + str.slice(6) + str.slice(0, 6) + ')';
    },
  },

  /**
   * Transforms the value into an UIColor class for iOS
   *
   * ```objectivec
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * [UIColor colorWithRed:0.114f green:0.114f blue:0.114f alpha:1.000f]
   * ```
   *
   * @memberof Transforms
   */
  'color/UIColor': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const rgb = Color(token.$value ?? token.value).toRgb();
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
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 0.6)
   * ```
   *
   * @memberof Transforms
   */
  'color/UIColorSwift': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const { r, g, b, a } = Color(token.$value ?? token.value).toRgb();
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
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 0.6)
   * ```
   *
   * @memberof Transforms
   */
  'color/ColorSwiftUI': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const { r, g, b, a } = Color(token.$value ?? token.value).toRgb();
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
   * // Matches: token.attributes.category === 'color'
   * // Returns:
   * #000000
   * rgba(0,0,0,0.5)
   * ```
   *
   * @memberof Transforms
   */
  'color/css': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const color = Color(token.$value ?? token.value);
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
   * // Matches: token.attributes.category === 'color'
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
    matcher: /** @param {Token} token */ (token) => token.attributes?.category === 'color',
    transformer: function (token) {
      let color = Color(token.original.value).toRgb();
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
   * // Matches: token.attributes.category === 'size' && token.attributes.type === 'font'
   * // Returns:
   * "10.0sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/sp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function (token) {
      const val = parseFloat(token.$value ?? token.value);
      if (isNaN(val)) throwSizeError(token.name, token.$value ?? token.value, 'sp');
      return val.toFixed(2) + 'sp';
    },
  },

  /**
   * Transforms the value into a density-independent pixel (dp) value for non-font sizes on Android. It will not scale the number.
   *
   * ```js
   * // Matches: token.attributes.category === 'size' && token.attributes.type !== 'font'
   * // Returns:
   * "10.0dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/dp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function (token) {
      const val = parseFloat(token.$value ?? token.value);
      if (isNaN(val)) throwSizeError(token.name, token.$value ?? token.value, 'dp');
      return val.toFixed(2) + 'dp';
    },
  },

  /**
   * Transforms the value into a usefull object ( for React Native support )
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
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
    matcher: isSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'object');

      return {
        original: value,
        number: parsedVal,
        decimal: parsedVal / 100,
        scale: parsedVal * getBasePxFontSize(options),
      };
    },
  },

  /**
   * Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes on Android. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```js
   * // Matches: token.attributes.category === 'size' && token.attributes.type === 'font'
   * // Returns:
   * "16.0sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToSp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'sp');
      return (parsedVal * baseFont).toFixed(2) + 'sp';
    },
  },

  /**
   * Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes on Android. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```js
   * // Matches: token.attributes.category === 'size' && token.attributes.type !== 'font'
   * // Returns:
   * "16.0dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToDp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'dp');
      return (parsedVal * baseFont).toFixed(2) + 'dp';
    },
  },

  /**
   * Adds 'px' to the end of the number. Does not scale the number
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
   * // Returns:
   * "10px"
   * ```
   *
   * @memberof Transforms
   */
  'size/px': {
    type: 'value',
    matcher: isSize,
    transformer: function (token) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'px');
      return parsedVal + 'px';
    },
  },

  /**
   * Adds 'rem' to the end of the number. Does not scale the number
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
   * // Returns:
   * "10rem"
   * ```
   *
   * @memberof Transforms
   */
  'size/rem': {
    type: 'value',
    matcher: isSize,
    transformer: function (token) {
      const parsedVal = parseFloat(token.$value ?? token.value);
      if (isNaN(parsedVal)) throwSizeError(token.name, token.$value ?? token.value, 'rem');
      return parsedVal + 'rem';
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) and adds 'pt' to the end.
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
   * // Returns:
   * "16pt"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToPt': {
    type: 'value',
    matcher: isSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'pt');
      return (parsedVal * baseFont).toFixed(2) + 'f';
    },
  },

  /**
   * Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes in Compose. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```kotlin
   * // Matches: token.attributes.category === 'size' && token.attributes.type === 'font'
   * // Returns:
   * "16.0.sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/compose/remToSp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'sp');
      return (parsedVal * baseFont).toFixed(2) + '.sp';
    },
  },

  /**
   * Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes in Compose. It WILL scale the number by a factor of 16 (or the value of 'basePxFontSize' on the platform in your config).
   *
   * ```kotlin
   * // Matches: token.attributes.category === 'size' && token.attributes.type !== 'font'
   * // Returns:
   * "16.0.dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/compose/remToDp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'dp');
      return (parsedVal * baseFont).toFixed(2) + '.dp';
    },
  },

  /**
   * Adds the .em Compose extension to the end of a number. Does not scale the value
   *
   * ```kotlin
   * // Matches: token.attributes.category === 'size' && token.attributes.type === 'font'
   * // Returns:
   * "16.0em"
   * ```
   *
   * @memberof Transforms
   */
  'size/compose/em': {
    type: 'value',
    matcher: isFontSize,
    transformer: function (token) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'em');
      return parsedVal + '.em';
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) to get to points for Swift and initializes a CGFloat
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
   * // Returns: "CGFloat(16.00)""
   * ```
   *
   * @memberof Transforms
   */
  'size/swift/remToCGFloat': {
    type: 'value',
    matcher: isSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'CGFloat');
      return `CGFloat(${(parsedVal * baseFont).toFixed(2)})`;
    },
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) and adds 'px' to the end.
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
   * // Returns:
   * "16px"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToPx': {
    type: 'value',
    matcher: isSize,
    transformer: function (token, options) {
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);
      const baseFont = getBasePxFontSize(options);
      if (isNaN(parsedVal)) throwSizeError(token.name, value, 'px');
      return (parsedVal * baseFont).toFixed(0) + 'px';
    },
  },

  /**
   * Scales non-zero numbers to rem, and adds 'rem' to the end. If you define a "basePxFontSize" on the platform in your config, it will be used to scale the value, otherwise 16 (default web font size) will be used.
   *
   * ```js
   * // Matches: token.attributes.category === 'size'
   * // Returns:
   * "0"
   * "1rem"
   * ```
   *
   * @memberof Transforms
   */
  'size/pxToRem': {
    type: 'value',
    matcher: isSize,
    transformer: (token, options) => {
      const baseFont = getBasePxFontSize(options);
      const value = token.$value ?? token.value;
      const parsedVal = parseFloat(value);

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
   * // Matches: token.attributes.category === 'content' && token.attributes.type === 'icon'
   * // Returns:
   * "'\\E001'"
   * ```
   *
   * @memberof Transforms
   */
  'content/icon': {
    type: 'value',
    matcher: /** @param {Token} token */ function (token) {
      return token.attributes?.category === 'content' && token.attributes.type === 'icon';
    },
    transformer: function (token) {
      return (token.$value ?? token.value).replace(
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
   * // Matches: token.attributes.category === 'content'
   * // Returns:
   * "'string'"
   * ```
   *
   * @memberof Transforms
   */
  'content/quote': {
    type: 'value',
    matcher: isContent,
    transformer: function (token) {
      return wrapValueWith("'", token);
    },
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objectivec
   * // Matches: token.attributes.category === 'content'
   * // Returns:
   * \@"string"
   * ```
   *
   * @memberof Transforms
   */
  'content/objC/literal': {
    type: 'value',
    matcher: isContent,
    transformer: function (token) {
      return '@' + wrapValueWithDoubleQuote(token);
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```swift
   * // Matches: token.attributes.category === 'content'
   * // Returns:
   * "string"
   * ```
   *
   * @memberof Transforms
   */
  'content/swift/literal': {
    type: 'value',
    matcher: isContent,
    transformer: wrapValueWithDoubleQuote,
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objectivec
   * // Matches: token.attributes.category === 'font'
   * // Returns: \@"string"
   * ```
   *
   * @memberof Transforms
   */
  'font/objC/literal': {
    type: 'value',
    matcher: /** @param {Token} token */ function (token) {
      return token.attributes?.category === 'font';
    },
    transformer: function (token) {
      return '@' + wrapValueWithDoubleQuote(token);
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```swift
   * // Matches: token.attributes.category === 'font'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'font/swift/literal': {
    type: 'value',
    matcher: /** @param {Token} token */ function (token) {
      return token.attributes?.category === 'font';
    },
    transformer: wrapValueWithDoubleQuote,
  },

  /**
   * Assumes a time in miliseconds and transforms it into a decimal
   *
   * ```js
   * // Matches: token.attributes.category === 'time'
   * // Returns:
   * "0.5s"
   * ```
   *
   * @memberof Transforms
   */
  'time/seconds': {
    type: 'value',
    matcher: /** @param {Token} token */ function (token) {
      return token.attributes?.category === 'time';
    },
    transformer: function (token) {
      return (parseFloat(token.$value ?? token.value) / 1000).toFixed(2) + 's';
    },
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```js
   * // Matches: token.attributes.category === 'asset'
   * // Returns:
   * 'IyBlZGl0b3Jjb25maWcub3JnCnJvb3QgPSB0cnVlCgpbKl0KaW5kZW50X3N0eWxlID0gc3BhY2UKaW5kZW50X3NpemUgPSAyCmVuZF9vZl9saW5lID0gbGYKY2hhcnNldCA9IHV0Zi04CnRyaW1fdHJhaWxpbmdfd2hpdGVzcGFjZSA9IHRydWUKaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSB0cnVlCgpbKi5tZF0KdHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gZmFsc2U='
   * ```
   *
   * @memberof Transforms
   */
  'asset/base64': {
    type: 'value',
    matcher: isAsset,
    transformer: function (token) {
      return convertToBase64(token.$value ?? token.value);
    },
  },

  /**
   * Prepends the local file path
   *
   * ```js
   * // Matches: token.attributes.category === 'asset'
   * // Returns:
   * "path/to/file/asset.png"
   * ```
   *
   * @memberof Transforms
   */
  'asset/path': {
    type: 'value',
    matcher: isAsset,
    transformer: function (token) {
      return join(process?.cwd() ?? '/', token.$value ?? token.value);
    },
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objectivec
   * // Matches: token.attributes.category === 'asset'
   * // Returns: \@"string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/objC/literal': {
    type: 'value',
    matcher: isAsset,
    transformer: function (token) {
      return '@' + wrapValueWithDoubleQuote(token);
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```swift
   * // Matches: token.attributes.category === 'asset'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/swift/literal': {
    type: 'value',
    matcher: isAsset,
    transformer: wrapValueWithDoubleQuote,
  },

  /**
   * Transforms the value into a Flutter Color object using 8-digit hex with the alpha chanel on start
   *  ```js
   *  // Matches: token.attributes.category === 'color'
   *  // Returns:
   *  Color(0xFF00FF5F)
   *  ```
   *  @memberof Transforms
   *
   */
  'color/hex8flutter': {
    type: 'value',
    matcher: isColor,
    transformer: function (token) {
      const str = Color(token.$value ?? token.value)
        .toHex8()
        .toUpperCase();
      return `Color(0x${str.slice(6)}${str.slice(0, 6)})`;
    },
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```dart
   * // Matches: token.attributes.category === 'content'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'content/flutter/literal': {
    type: 'value',
    matcher: isContent,
    transformer: wrapValueWithDoubleQuote,
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```dart
   * // Matches: token.attributes.category === 'asset'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/flutter/literal': {
    type: 'value',
    matcher: isAsset,
    transformer: wrapValueWithDoubleQuote,
  },

  /**
   * Wraps the value in a double-quoted string to make a string literal.
   *
   * ```dart
   * // Matches: token.attributes.category === 'font'
   * // Returns: "string"
   * ```
   *
   * @memberof Transforms
   */
  'font/flutter/literal': {
    type: 'value',
    matcher: /** @param {Token} token */ function (token) {
      return token.attributes?.category === 'font';
    },
    transformer: wrapValueWithDoubleQuote,
  },

  /**
   * Scales the number by 16 (or the value of 'basePxFontSize' on the platform in your config) to get to points for Flutter
   *
   * ```dart
   * // Matches: token.attributes.category === 'size'
   * // Returns: 16.00
   * ```
   *
   * @memberof Transforms
   */
  'size/flutter/remToDouble': {
    type: 'value',
    matcher: isSize,
    transformer: function (token, options) {
      const baseFont = getBasePxFontSize(options);
      return (parseFloat(token.$value ?? token.value) * baseFont).toFixed(2);
    },
  },
};
