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

var _ = require('lodash');
var module_def = 'module.exports = ';

function fileHeader() {
  return '/**\n' +
         ' * Do not edit directly\n' +
         ' * Generated on ' + new Date() + '\n' +
         ' */\n\n';
}

function variablesWithPrefix(prefix, properties) {
  return _.map(properties, function(prop) {
      var to_ret_prop = prefix + prop.name + ': ' + (prop.attributes.category==='asset' ? '"'+prop.value+'"' : prop.value) + ';';

      if (prop.comment)
        to_ret_prop = to_ret_prop.concat(' // ' + prop.comment);
      return to_ret_prop;
    })
    .filter(function(strVal) { return !!strVal })
    .join('\n');
}

function iconsWithPrefix(prefix, properties, config) {
  return fileHeader() + _.chain(properties)
    .filter(function(prop) {
      return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
    })
    .map(function(prop) {
      var varName = prefix + prop.name + ': ' + prop.value + ';';
      var className = '.' + config.prefix + '-icon.' + prop.attributes.item + ':before ';
      var declaration = '{ content: ' + prefix + prop.name + '; }';
      return varName + '\n' + className + declaration;
    })
    .value().join('\n');
}
/**
 * @namespace Formats
 */

module.exports = {
  /**
   * Creates a CSS file with variable definitions based on the style dictionary
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```css
   * :root {
   *   --color-background-base: #f0f0f0;
   *   --color-background-alt: #eeeeee;
   * }
   * ```
   */
  'css/variables': function(dictionary) {
    var root_vars = ':root {\n' + variablesWithPrefix(' --', dictionary.allProperties) + '\n}\n';
    return fileHeader() + root_vars;
  },

  /**
   * Creates a SCSS file with variable definitions based on the style dictionary
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```scss
   * $color-background-base: #f0f0f0;
   * $color-background-alt: #eeeeee;
   * ```
   */
  'scss/variables': function(dictionary) {
    return fileHeader() + variablesWithPrefix('$', dictionary.allProperties);
  },

  /**
   * Creates a SCSS file with variable definitions and helper classes for icons
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```scss
   * $content-icon-email: '\E001';
   * .icon.email:before { content:$content-icon-email; }
   * ```
   */
  'scss/icons': function(dictionary, config) {
    return iconsWithPrefix('$', dictionary.allProperties, config);
  },

  /**
   * Creates a LESS file with variable definitions based on the style dictionary
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```less
   * @color-background-base: #f0f0f0;
   * @color-background-alt: #eeeeee;
   * ```
   */
  'less/variables': function(dictionary) {
    return fileHeader() + variablesWithPrefix('@', dictionary.allProperties);
  },

  /**
   * Creates a LESS file with variable definitions and helper classes for icons
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```less
   * @content-icon-email: '\E001';
   * .icon.email:before { content:@content-icon-email; }
   * ```
   */
  'less/icons': function(dictionary, config) {
    return iconsWithPrefix('@', dictionary.allProperties, config);
  },

  /**
   * Creates a CommonJS module with the whole style dictionary
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```js
   * module.exports = {
   *   color: {
   *     base: {
   *        red: {
   *          value: '#ff000'
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'javascript/module': function(dictionary) {
    return  fileHeader() +
      module_def +
      JSON.stringify(dictionary.properties, null, 2) + ';';
  },

  /**
   * Creates a JS file a global var that is a plain javascript object of the style dictionary.
   * Name the variable by adding a 'name' attribute on the file object in your config.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```js
   * var StyleDictionary = {
   *   color: {
   *     base: {
   *        red: {
   *          value: '#ff000'
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'javascript/object': function(dictionary) {
    return  fileHeader() +
      'var ' +
      (this.name || '_styleDictionary') +
      ' = ' +
      JSON.stringify(dictionary.properties, null, 2) +
      ';';
  },

  /**
   * Creates a [UMD](https://github.com/umdjs/umd) module of the style
   * dictionary. Name the module by adding a 'name' attribute on the file object
   * in your config.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```js
   * (function(root, factory) {
   *   if (typeof module === "object" && module.exports) {
   *     module.exports = factory();
   *   } else if (typeof exports === "object") {
   *     exports["_styleDictionary"] = factory();
   *   } else if (typeof define === "function" && define.amd) {
   *     define([], factory);
   *   } else {
   *     root["_styleDictionary"] = factory();
   *   }
   * }(this, function() {
   *   return {
   *     "color": {
   *       "red": {
   *         "value": "#FF0000"
   *       }
   *     }
   *   };
   * }))
   * ```
   */
  'javascript/umd': function(dictionary) {
    var name = this.name || '_styleDictionary'
    return fileHeader() +
      '(function(root, factory) {\n' +
      '  if (typeof module === "object" && module.exports) {\n' +
      '    module.exports = factory();\n' +
      '  } else if (typeof exports === "object") {\n' +
      '    exports["' + name + '"] = factory();\n' +
      '  } else if (typeof define === "function" && define.amd) {\n' +
      '    define([], factory);\n' +
      '  } else {\n' +
      '    root["' + name + '"] = factory();\n' +
      '  }\n' +
      '}(this, function() {\n' +
      '  return ' + JSON.stringify(dictionary.properties, null, 2) + ';\n' +
      '}))\n'
  },

  /**
   * Creates a ES6 module of the style dictionary.
   *
   * ```json
   * {
   *   "platforms": {
   *     "js": {
   *       "transformGroup": "js",
   *       "files": [
   *         {
   *           "format": "javascript/es6",
   *           "destination": "colors.js",
   *           "filter": {
   *             "attributes": {
   *               "category": "color"
   *             }
   *           }
   *         }
   *       ]
   *     }
   *   }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```js
   * export const ColorBackgroundBase = '#ffffff';
   * export const ColorBackgroundAlt = '#fcfcfcfc';
   * ```
   */
  'javascript/es6': function(dictionary) {
    return fileHeader() +
      _.map(dictionary.allProperties, function(prop) {
        var to_ret_prop = 'export const ' + prop.name + ' = ' + JSON.stringify(prop.value) + ';';
        if (prop.comment)
          to_ret_prop = to_ret_prop.concat(' // ' + prop.comment);
        return to_ret_prop;
      }).join('\n');
  },

  /**
   * Creates a JSON file of the style dictionary.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```json
   * {
   *   "color": {
   *     "base": {
   *        "red": {
   *          "value": "#ff000"
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'json': function(dictionary) {
    return JSON.stringify(dictionary.properties, null, 2);
  },

  /**
   * Creates a JSON file of just the assets defined in the style dictionary.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```js
   * {
   *   "asset": {
   *     "image": {
   *        "logo": {
   *          "value": "assets/logo.png"
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'json/asset': function(dictionary) {
    return JSON.stringify({asset: dictionary.properties.asset}, null, 2);
  },

  /**
   * Creates a sketchpalette file of all the base colors
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```json
   * {
   *   "compatibleVersion": "1.0",
   *   "pluginVersion": "1.1",
   *   "colors": [
   *     "#ffffff",
   *     "#ff0000",
   *     "#fcfcfc"
   *   ]
   * }
   * ```
   */
  'sketch/palette': function(dictionary) {
    var to_ret = {
      'compatibleVersion':'1.0',
      'pluginVersion':'1.1'
    };
    to_ret.colors = _.chain(dictionary.allProperties)
      .filter(function(prop) {
        return prop.attributes.category === 'color' && prop.attributes.type === 'base';
      })
      .map(function(prop) {
        return prop.value;
      })
      .value();
    return JSON.stringify(to_ret, null, 2);
  },

  /**
   * Creates a flatten JSON from input, capitalizing and then concatenating 
   * each key with it's pre-key recursively.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```json
    {
      "size": {
        "font": {
           "small": { "value": "13px" },
           "medium": { "value": "15px" },
           "large": { "value": "17px" },
           "base": { "value": "{size.font.medium.value}" }
        }
      }
    }```
   * 
   * Creates:
   * ```json
    {
      "SizeFontSmall": "13px",
      "SizeFontMedium": "15px",
      "SizeFontLarge": "17px",
      "SizeFontBase": "15px"
    }
   * ```
   */
  'json/flat': function(dictionary) {
    var evaluateProp = function(property) {
      // property value is in format '{*}'
      var isReference = /^\{.*\}/g.test(property);
      if (isReference) {
        // removing brackets, taking 'content' out of '{content}'
        property = property.substr(1, property.length - 2);
        return _.get(dictionary, property);
      }
      return property;
    };

    // recursive, initial prefix is none (empty string)
    // iterate over keys capitalizing and concatenating them 
    // until "value" key is found, then evaluate it's value
    var deepFlatten = function(object, prefix) {
      return _.toPairs(object)
        .reduce(function(output, pair) {
          var key = pair[0],
            value = pair[1],
            isValueProperty = key === 'value',
            newKey = isValueProperty ? prefix : prefix + _.capitalize(key);
          if (_.isString(value)) {
            output[newKey] = evaluateProp(value);
          } else {
            Object.assign(output, deepFlatten(value, newKey));
          }
          return output;
        }, {});
    };

    var output = deepFlatten(dictionary, '');
    return JSON.stringify(output, null, 2);
  }
};
