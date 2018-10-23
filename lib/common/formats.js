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

const _ = require('lodash');

function fileHeader(options) {
  let to_ret = '';
  // for backward compatibility we need to have the user explicitly hide them
  const showFileHeader = options ? options.showFileHeader : true;
  if (showFileHeader) {
    to_ret += '/**\n';
    to_ret += ' * Do not edit directly\n';
    to_ret += ` * Generated on ${new Date().toUTCString()}\n`;
    to_ret += ' */\n\n';
  }

  return to_ret;
}

function variablesWithPrefix(prefix, properties) {
  return _.map(properties, ({ name, attributes, value, comment }) => {
    let to_ret_prop = `${prefix + name}: ${attributes.category === 'asset' ? `"${value}"` : value};`;

    if (comment) to_ret_prop = to_ret_prop.concat(` // ${comment}`);
    return to_ret_prop;
  })
    .filter(strVal => !!strVal)
    .join('\n');
}

function iconsWithPrefix(prefix, properties, config) {
  return _.chain(properties)
    .filter(({ attributes }) => attributes.category === 'content' && attributes.type === 'icon')
    .map(({ name, value, attributes }) => {
      const varName = `${prefix + name}: ${value};`;
      const className = `.${config.prefix}-icon.${attributes.item}:before `;
      const declaration = `{ content: ${prefix}${name}; }`;
      return `${varName}\n${className}${declaration}`;
    })
    .value()
    .join('\n');
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
  'css/variables': function({ allProperties }) {
    return `${fileHeader(this.options)}:root {\n${variablesWithPrefix(' --', allProperties)}\n}\n`;
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
  'scss/variables': function({ allProperties }) {
    return fileHeader(this.options) + variablesWithPrefix('$', allProperties);
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
  'scss/icons': function({ allProperties }, config) {
    return fileHeader(this.options) + iconsWithPrefix('$', allProperties, config);
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
  'less/variables': function({ allProperties }) {
    return fileHeader(this.options) + variablesWithPrefix('@', allProperties);
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
  'less/icons': function({ allProperties }, config) {
    return fileHeader(this.options) + iconsWithPrefix('@', allProperties, config);
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
  'javascript/module': function({ properties }) {
    return `${fileHeader(this.options)}module.exports = ${JSON.stringify(properties, null, 2)};`;
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
  'javascript/object': function({ properties }) {
    return `${fileHeader(this.options)}var ${this.name || '_styleDictionary'} = ${JSON.stringify(
      properties,
      null,
      2
    )};`;
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
  'javascript/umd': function({ properties }) {
    const name = this.name || '_styleDictionary';
    return `${fileHeader(
      this.options
    )}(function(root, factory) {\n  if (typeof module === "object" && module.exports) {\n    module.exports = factory();\n  } else if (typeof exports === "object") {\n    exports["${name}"] = factory();\n  } else if (typeof define === "function" && define.amd) {\n    define([], factory);\n  } else {\n    root["${name}"] = factory();\n  }\n}(this, function() {\n  return ${JSON.stringify(
      properties,
      null,
      2
    )};\n}))\n`;
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
  'javascript/es6': function({ allProperties }) {
    return (
      fileHeader(this.options) +
      _.map(allProperties, ({ name, value, comment }) => {
        let to_ret_prop = `export const ${name} = ${JSON.stringify(value)};`;
        if (comment) to_ret_prop = to_ret_prop.concat(` // ${comment}`);
        return to_ret_prop;
      }).join('\n')
    );
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
  json: ({ properties }) => JSON.stringify(properties, null, 2),

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
  'json/asset': ({ properties }) => JSON.stringify({ asset: properties.asset }, null, 2),

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
  'sketch/palette': function({ allProperties }) {
    const to_ret = {
      compatibleVersion: '1.0',
      pluginVersion: '1.1',
    };
    to_ret.colors = _.chain(allProperties)
      .filter(({ attributes }) => attributes.category === 'color' && attributes.type === 'base')
      .map(({ value }) => value)
      .value();
    return JSON.stringify(to_ret, null, 2);
  },
};
