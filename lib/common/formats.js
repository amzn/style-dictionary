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

function jsHeader() {
  return '/**\n' +
         ' * Do not edit directly\n' +
         ' * Generated on ' + new Date() + '\n' +
         ' */\n\n';
}

function sassHeader() {
  return '//\n' +
         '// Do not edit directly\n' +
         '// Generated on ' + new Date() + '\n' +
         '//\n\n'
}

function cssHeader() {
  return '/* Do not edit directly */\n' +
         '/* Generated on ' + new Date() + ' */\n\n';
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
    var root_vars = ':root {\n' + _.map(dictionary.allProperties, function (prop) {
      var to_ret_prop = '  --' + prop.name + ': ' + (prop.attributes.category==='asset' ? '"'+prop.value+'"' : prop.value) + ';';

      if (prop.attributes.comment)
        to_ret_prop = to_ret_prop.concat(' /* ' + prop.attributes.comment + ' */ ');
      return to_ret_prop;
    }).filter(function (strVal) { return !!strVal; }).join('\n') + '\n}\n';

    return cssHeader() + root_vars;
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
    var to_ret;
    return sassHeader() + _.map(dictionary.allProperties, function (prop) {
      to_ret = '$' + prop.name + ': ' + (prop.attributes.category==='asset' ? '"'+prop.value+'"' : prop.value) + ';';

      if (prop.attributes.comment)
        to_ret = to_ret.concat(' // ' + prop.attributes.comment);
      return to_ret;
    }).filter(function (strVal) { return !!strVal; }).join('\n');
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
    return sassHeader() + _.chain(dictionary.allProperties)
      .filter(function(prop) {
        return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
      })
      .map(function(prop) {
        var varName = '$' + prop.name + ': ' + prop.value + ';';
        var className = '.' + config.prefix + '-icon.' + prop.attributes.item + ':before ';
        var declaration = '{ content: $' + prop.name + '; }';
        return varName + '\n' + className + declaration;
      })
      .value().join('\n');
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
    return  jsHeader() +
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
    return  jsHeader() +
      'var ' +
      (this.name || '_styleDictionary') +
      ' = ' +
      JSON.stringify(dictionary.properties, null, 2) +
      ';';
  },

  /**
   * Creates a ES6 module of the style dictionary. You can filter the style dictionary
   * to only export properties of a certain type by adding a 'filter' attribute on the
   * file object in the config.
   *
   * ```json
   * {
   *   "platforms": {
   *     "js": {
   *       "files": [
   *         {
   *           "format": "javascript/es6",
   *           "destination": "colors.js",
   *           "filter": {
   *             "category": "color"
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
   * export const BackgroundBase = '#ffffff';
   * export const BackgroundAlt = '#fcfcfcfc';
   * ```
   */
  'javascript/es6': function(dictionary) {
    // this is bound to the file object
    var props = _.filter(dictionary.allProperties, this.filter);
    return jsHeader() +
      _.map(props, function(prop) {
        return 'export const ' + prop.name + ' = \'' + prop.value + '\';';
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
  }
};
