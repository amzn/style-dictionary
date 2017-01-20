var Color           = require('color'),
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

module.exports = {
  'attribute/color': {
    type: 'attribute',
    matcher: function (prop) {
      return prop.attributes.category === 'color' && prop.value.indexOf('{') < 0;
    },
    transformer: function (prop) {
      var color = Color(prop.value);
      return {
        hex: color.hexString(),
        rgb: color.rgbString(),
        hsl: color.hslString(),
        hsv: color.hwbString(),
        red: color.red(),
        blue: color.blue(),
        green: color.green()
      };
    }
  },

  'attribute/cti': {
    type: 'attribute',
    matcher: function() { return true; },
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

  'color/rgb': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.original.value).rgbString();
    }
  },

  'color/rgb_array': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.original.value).rgbArray();
    }
  },

  'color/hex': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      return Color(prop.original.value).hexString();
    }
  },

  'color/UIColor': {
    type: 'value',
    matcher: isColor,
    transformer: function (prop) {
      var rgb = Color(prop.original.value).rgbArray();
      return '[UIColor colorWithRed:' + (rgb[0]/255).toFixed(2) + 'f' +
             ' green:' + (rgb[1]/255).toFixed(2) + 'f' +
             ' blue:' + (rgb[2]/255).toFixed(2) + 'f' +
             ' alpha:1.0f]';
    }
  },

  'size/sp': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'size' &&
            (prop.attributes.type === 'font' || prop.attributes.type === 'icon');
    },
    transformer: function(prop) {
      return prop.original.value.replace(/(\D)/g, '') + 'sp';
    }
  },

  'size/dp': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'size' &&
             prop.attributes.type !== 'font' &&
             prop.attributes.type !== 'icon';
    },
    transformer: function(prop) {
      return prop.original.value.replace(/(\D)/g, '') + 'dp';
    }
  },

  'size/px': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'size';
    },
    transformer: function(prop) {
      return prop.original.value.replace(/(\D)/g, '') + 'px';
    }
  },

  'size/rem': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return prop.original.value + 'rem';
    }
  },

  'size/remToPt': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return '@' + (prop.original.value * 16).toFixed(2) + 'f';
    }
  },

  'size/remToPx': {
    type: 'value',
    matcher: isSize,
    transformer: function(prop) {
      return (prop.original.value * 16).toFixed(0) + 'px';
    }
  },

  'content/icon': {
    type: 'value',
    matcher: function (prop) {
      return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
    },
    transformer: function (prop) {
      return prop.original.value.replace(UNICODE_PATTERN, function (match, variable) {
        return '\'\\' + variable + '\'';
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
      return (parseInt(prop.original.value) / 1000).toString() + 's';
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
      return path.join(process.cwd(), prop.original.value);
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
