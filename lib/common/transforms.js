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

var Color           = require('tinycolor2'),
    _               = require('lodash'),
    path            = require('path'),
    convertToBase64 = require('../utils/convertToBase64'),
    UNICODE_PATTERN = /&#x([^;]+);/g;

function isColor(prop) {
  return prop.attributes.category === 'color';
}

function isSize(prop) {
  return prop.attributes.category === 'size';
}

function isFontSize(prop) {
  return prop.attributes.category === 'size' &&
    (prop.attributes.type === 'font' || prop.attributes.type === 'icon');
}

function isNotFontSize(prop) {
  return prop.attributes.category === 'size' &&
    prop.attributes.type !== 'font' &&
    prop.attributes.type !== 'icon';
}

/**
 * @namespace Transforms
 */
module.exports = {
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
    transformer: function(prop) {
      return {
        category: prop.path[0],
        type:     prop.path[1],
        item:     prop.path[2],
        subitem:  prop.path[3],
        state:    prop.path[4]
      }
    }
  },

  /**
   * Adds: hex, hsl, hsv, rgb, red, blue, green.
   *
   * ```js
   * // Matches: prop.attributes.category === 'color'
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
    transformer: function (prop) {
      var color = Color(prop.value);
      return {
        hex: color.toHex(),
        rgb: color.toRgb(),
        hsl: color.toHsl(),
        hsv: color.toHsv()
      };
    }
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
    transformer: function(prop) {
      return [
        prop.attributes.item,
        prop.attributes.subitem
      ].join(' ');
    }
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
    transformer: function(prop, options) {
      return _.camelCase( [options.prefix].concat(prop.path).join(' ') );
    }
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
    transformer: function(prop, options) {
      return _.kebabCase([options.prefix].concat(prop.path).join(' '));
    }
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
    transformer: function(prop, options) {
      return _.snakeCase( [options.prefix].concat(prop.path).join(' ') );
    }
  },

  /**
   * Creates a constant-style name based on the full CTI of the property. If you define a prefix on the platform in your config, it will prepend with your prefix
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
    transformer: function(prop, options) {
      return _.snakeCase( [options.prefix].concat(prop.path).join(' ') ).toUpperCase();
    }
  },

  /**
   * Creates a constant-style name on just the type and item of the property. This is useful if you want to create different static classes/files for categories like `Color.BACKGROUND_BASE`. If you define a prefix on the platform in your config, it will prepend with your prefix.
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
    transformer: function(prop, options) {
      var path = prop.path.slice(1);
      return _.snakeCase( [options.prefix].concat(path).join(' ') ).toUpperCase();
    }
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
    transformer: function(prop, options) {
      return _.upperFirst( _.camelCase([options.prefix].concat(prop.path).join(' ')) );
    }
  },

  /**
   * Transforms the value into an RGB string
   *
   * ```js
   * // Matches: prop.attributes.category === 'color'
   * // Returns:
   * "rgb(0, 150, 136)"
   * ```
   *
   * @memberof Transforms
   */
  'color/rgb': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.value).toRgbString();
    }
  },

  /**
   * Transforms the value into an 6-digit hex string
   *
   * ```js
   * // Matches: prop.attributes.category === 'color'
   * // Returns:
   * "#009688"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.value).toHexString();
    }
  },

  /**
   * Transforms the value into an 8-digit hex string
   *
   * ```js
   * // Matches: prop.attributes.category === 'color'
   * // Returns:
   * "#009688ff"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex8': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.value).toHex8String();
    }
  },

  /**
   * Transforms the value into an 8-digit hex string for Android because they put the alpha channel first
   *
   * ```js
   * // Matches: prop.attributes.category === 'color'
   * // Returns:
   * "#ff009688"
   * ```
   *
   * @memberof Transforms
   */
  'color/hex8android': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      var str = Color(prop.value).toHex8();
      return '#' + str.slice(6) + str.slice(0,6);
    }
  },

  /**
   * Transforms the value into an UIColor class for iOS
   *
   * ```objectivec
   * // Matches: prop.attributes.category === 'color'
   * // Returns:
   * [UIColor colorWithRed:0.00f green:0.59f blue:0.53f alpha:1.0f]
   * ```
   *
   * @memberof Transforms
   */
  'color/UIColor': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      var rgb = Color(prop.value).toRgb();
      return '[UIColor colorWithRed:' + (rgb.r/255).toFixed(2) + 'f' +
             ' green:' + (rgb.g/255).toFixed(2) + 'f' +
             ' blue:' + (rgb.b/255).toFixed(2) + 'f' +
             ' alpha:' + rgb.a.toFixed(2) + 'f]';
    }
  },

  /**
   * Transforms the value into a hex or rgb string depending on if it has transparency
   *
   * ```css
   * // Matches: prop.attributes.category === 'color'
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
    transformer: function (prop) {
      var color = Color(prop.value);
      if (color.getAlpha() === 1) {
        return color.toHexString();
      } else {
        return color.toRgbString();
      }
    }
  },

  /**
   * Transforms the value into a scale-independent pixel (sp) value for font sizes on Android. It will not scale the number.
   *
   * ```js
   * // Matches: prop.attributes.category === 'size' && prop.attributes.type === 'font'
   * // Returns:
   * "10.0sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/sp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10).toFixed(2) + 'sp';
    }
  },

  /**
   * Transforms the value into a density-independent pixel (dp) value for non-font sizes on Android. It will not scale the number.
   *
   * ```js
   * // Matches: prop.attributes.category === 'size' && prop.attributes.type !== 'font'
   * // Returns:
   * "10.0dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/dp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10).toFixed(2) + 'dp';
    }
  },

  /**
   * Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes on Android. It WILL scale the number by a factor of 16 (common base font size on web).
   *
   * ```js
   * // Matches: prop.attributes.category === 'size' && prop.attributes.type === 'font'
   * // Returns:
   * "16.0sp"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToSp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(2) + 'sp';
    }
  },


  /**
   * Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes on Android. It WILL scale the number by a factor of 16 (common base font size on web).
   *
   * ```js
   * // Matches: prop.attributes.category === 'size' && prop.attributes.type !== 'font'
   * // Returns:
   * "16.0dp"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToDp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(2) + 'dp';
    }
  },


  /**
   * Adds 'px' to the end of the number. Does not scale the number
   *
   * ```js
   * // Matches: prop.attributes.category === 'size'
   * // Returns:
   * "10px"
   * ```
   *
   * @memberof Transforms
   */
  'size/px': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10) + 'px';
    }
  },

  /**
   * Adds 'rem' to the end of the number. Does not scale the number
   *
   * ```js
   * // Matches: prop.attributes.category === 'size'
   * // Returns:
   * "10rem"
   * ```
   *
   * @memberof Transforms
   */
  'size/rem': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10) + 'rem';
    }
  },

  /**
   * Scales the number by 16 (default web font size) and adds 'pt' to the end.
   *
   * ```js
   * // Matches: prop.attributes.category === 'size'
   * // Returns:
   * "16pt"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToPt': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(2) + 'f';
    }
  },

  /**
   * Scales the number by 16 (default web font size) and adds 'px' to the end.
   *
   * ```js
   * // Matches: prop.attributes.category === 'size'
   * // Returns:
   * "16px"
   * ```
   *
   * @memberof Transforms
   */
  'size/remToPx': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(0) + 'px';
    }
  },

  /**
   * Takes a unicode point and transforms it into a form CSS can use.
   *
   * ```js
   * // Matches: prop.attributes.category === 'content' && prop.attributes.type === 'icon'
   * // Returns:
   * "'\\E001'"
   * ```
   *
   * @memberof Transforms
   */
  'content/icon': {
    type: 'value',
    matcher: function (prop) {
      return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
    },
    transformer: function (prop) {
      return prop.value.replace(UNICODE_PATTERN, function (match, variable) {
        return "'\\" + variable + "'";
      });
    }
  },

  /**
   * Wraps the value in a single quoted string
   *
   * ```js
   * // Matches: prop.attributes.category === 'content'
   * // Returns:
   * "'string'"
   * ```
   *
   * @memberof Transforms
   */
  'content/quote': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'content';
    },
    transformer: function(prop) {
      return '\'' + prop.value + '\'';
    }
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objectivec
   * // Matches: prop.attributes.category === 'content'
   * // Returns:
   * @"string"
   * ```
   *
   * @memberof Transforms
   */
  'content/objC/literal': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'content';
    },
    transformer: function(prop) {
      return '@"' + prop.value + '"';
    }
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objectivec
   * // Matches: prop.attributes.category === 'font'
   * // Returns: @"string"
   * ```
   *
   * @memberof Transforms
   */
  'font/objC/literal': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'font';
    },
    transformer: function(prop) {
      return '@"' + prop.value + '"';
    }
  },

  /**
   * Assumes a time in miliseconds and transforms it into a decimal
   *
   * ```js
   * // Matches: prop.attributes.category === 'time'
   * // Returns:
   * "0.5s"
   * ```
   *
   * @memberof Transforms
   */
  'time/seconds': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'time';
    },
    transformer: function(prop) {
      return (parseFloat(prop.value) / 1000).toFixed(2) + 's';
    }
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```js
   * // Matches: prop.attributes.category === 'asset'
   * // Returns:
   * 'IyBlZGl0b3Jjb25maWcub3JnCnJvb3QgPSB0cnVlCgpbKl0KaW5kZW50X3N0eWxlID0gc3BhY2UKaW5kZW50X3NpemUgPSAyCmVuZF9vZl9saW5lID0gbGYKY2hhcnNldCA9IHV0Zi04CnRyaW1fdHJhaWxpbmdfd2hpdGVzcGFjZSA9IHRydWUKaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSB0cnVlCgpbKi5tZF0KdHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gZmFsc2U='
   * ```
   *
   * @memberof Transforms
   */
  'asset/base64': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'asset';
    },
    transformer: function(prop) {
      return convertToBase64(prop.value);
    }
  },

  /**
   * Prepends the local file path
   *
   * ```js
   * // Matches: prop.attributes.category === 'asset'
   * // Returns:
   * "path/to/file/asset.png"
   * ```
   *
   * @memberof Transforms
   */
  'asset/path': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'asset';
    },
    transformer: function(prop) {
      return path.join(process.cwd(), prop.value);
    }
  },

  /**
   * Wraps the value in a double-quoted string and prepends an '@' to make a string literal.
   *
   * ```objectivec
   * // Matches: prop.attributes.category === 'asset'
   * // Returns: @"string"
   * ```
   *
   * @memberof Transforms
   */
  'asset/objC/literal': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'asset';
    },
    transformer: function(prop) {
      return '@"' + prop.value + '"';
    }
  }
};
