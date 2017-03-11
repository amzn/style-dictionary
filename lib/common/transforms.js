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
    UNICODE_PATTERN = /\&\#x([^;]+)\;/g;

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

module.exports = {
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

  'name/human': {
    type: 'name',
    transformer: function(prop) {
      return [
        prop.attributes.item,
        prop.attributes.subitem
      ].join(' ');
    }
  },

  // sizePaddingBase
  'name/cti/camel': {
    type: 'name',
    transformer: function(prop, options) {
      return _.camelCase( [options.prefix].concat(prop.path).join(' ') );
    }
  },

  // size-padding-base
  'name/cti/kebab': {
    type: 'name',
    transformer: function(prop, options) {
      return _.kebabCase([options.prefix].concat(prop.path).join(' '));
    }
  },

  // size_padding_base
  'name/cti/snake': {
    type: 'name',
    transformer: function(prop, options) {
      return _.snakeCase( [options.prefix].concat(prop.path).join(' ') );
    }
  },

  // SIZE_PADDING_BASE
  'name/cti/constant': {
    type: 'name',
    transformer: function(prop, options) {
      return _.snakeCase( [options.prefix].concat(prop.path).join(' ') ).toUpperCase();
    }
  },

  // PADDING_BASE
  'name/ti/constant': {
    type: 'name',
    transformer: function(prop, options) {
      var path = prop.path.slice(1);
      return _.snakeCase( [options.prefix].concat(path).join(' ') ).toUpperCase();
    }
  },

  // SizePaddingBase
  'name/cti/pascal': {
    type: 'name',
    transformer: function(prop, options) {
      return _.upperFirst( _.camelCase([options.prefix].concat(prop.path).join(' ')) );
    }
  },

  'color/rgb': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.value).toRgbString();
    }
  },

  'color/hex': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.value).toHexString();
    }
  },

  // #rrggbbaa
  'color/hex8': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.value).toHex8String();
    }
  },

  // #aarrggbb
  // Android puts the alpha channel first, which is
  // not the standard
  'color/hex8android': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      var str = Color(prop.value).toHex8();
      return '#' + str.slice(6) + str.slice(0,6);
    }
  },

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

  'size/sp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10).toFixed(2) + 'sp';
    }
  },

  'size/dp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10).toFixed(2) + 'dp';
    }
  },

  'size/remToSp': {
    type: 'value',
    matcher: isFontSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(2) + 'sp';
    }
  },

  'size/remToDp': {
    type: 'value',
    matcher: isNotFontSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(2) + 'dp';
    }
  },

  'size/px': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10) + 'px';
    }
  },

  'size/rem': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return parseFloat(prop.value, 10) + 'rem';
    }
  },

  'size/remToPt': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(2) + 'f';
    }
  },

  'size/remToPx': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return (parseFloat(prop.value, 10) * 16).toFixed(0) + 'px';
    }
  },

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

  'content/quote': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'content';
    },
    transformer: function(prop) {
      return '\'' + prop.value + '\'';
    }
  },

  'content/objC/literal': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'content';
    },
    transformer: function(prop) {
      return '@"' + prop.value + '"';
    }
  },

  'font/objC/literal': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'font';
    },
    transformer: function(prop) {
      return '@"' + prop.value + '"';
    }
  },

  'time/seconds': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'time';
    },
    transformer: function(prop) {
      return (parseFloat(prop.value) / 1000).toFixed(2) + 's';
    }
  },


  'asset/base64': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'asset';
    },
    transformer: function(prop) {
      return convertToBase64(prop.value);
    }
  },


  'asset/path': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'asset';
    },
    transformer: function(prop) {
      return path.join(process.cwd(), prop.value);
    }
  },

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
