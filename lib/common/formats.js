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

const fs = require('fs');
const path = require('path');
const _template = require('lodash/template');
const GroupMessages = require('../utils/groupMessages');
const {
  fileHeader,
  formattedVariables,
  getTypeScriptType,
  iconsWithPrefix,
  minifyDictionary,
  sortByReference,
  createPropertyFormatter,
  sortByName,
  setSwiftFileProperties,
  setComposeObjectProperties
} = require('./formatHelpers');

const SASS_MAP_FORMAT_DEPRECATION_WARNINGS = GroupMessages.GROUP.SassMapFormatDeprecationWarnings;

/**
 * @namespace Formats
 */

module.exports = {
  /**
   * Creates a CSS file with variable definitions based on the style dictionary
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @param {string} [options.selector] - Override the root css selector
   * @example
   * ```css
   * :root {
   *   --color-background-base: #f0f0f0;
   *   --color-background-alt: #eeeeee;
   * }
   * ```
   */
  'css/variables': function({dictionary, options={}, file}) {
    const selector = options.selector ? options.selector : `:root`;
    const { outputReferences } = options;
    return fileHeader({file}) +
      `${selector} {\n` +
      formattedVariables({format: 'css', dictionary, outputReferences}) +
      `\n}\n`;
  },

  /**
   * Creates a SCSS file with a flat map based on the style dictionary
   *
   * Name the map by adding a 'mapName' attribute on the file object in your config.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```scss
   * $tokens: (
   *   'color-background-base': #f0f0f0;
   *   'color-background-alt': #eeeeee;
   * )
   * ```
   */
  'scss/map-flat': function({dictionary, options, file}) {
    const template = _template(fs.readFileSync(__dirname + '/templates/scss/map-flat.template'));
    const { allTokens } = dictionary;
    return template({allTokens, file, options, fileHeader});
  },

  // This will soon be removed, is left here only for backwards compatibility
  'sass/map-flat': function({dictionary, options, file}) {
    GroupMessages.add(SASS_MAP_FORMAT_DEPRECATION_WARNINGS, "sass/map-flat");
    return module.exports['scss/map-flat']({dictionary, options, file});
  },

  /**
   * Creates a SCSS file with a deep map based on the style dictionary.
   *
   * Name the map by adding a 'mapName' attribute on the file object in your config.
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @param {Boolean} [options.themeable=true] - Whether or not tokens should default to being themeable, if not otherwise specified per token.
   * @example
   * ```scss
   * $color-background-base: #f0f0f0 !default;
   * $color-background-alt: #eeeeee !default;
   *
   * $tokens: {
   *   'color': (
   *     'background': (
   *       'base': $color-background-base,
   *       'alt': $color-background-alt
   *     )
   *   )
   * )
   * ```
   */
  'scss/map-deep': function({dictionary, options, file}) {
    const mapTemplate = _template(fs.readFileSync(__dirname + '/templates/scss/map-deep.template'));

    // Default the "themeable" option to true for backward compatibility.
    const { outputReferences, themeable = true } = options;
    return '\n' +
      fileHeader({ file, commentStyle: 'long' }) +
      formattedVariables({ format: 'sass', dictionary, outputReferences, themeable })
      + '\n' +
      mapTemplate({dictionary, file});
  },

  // This will soon be removed, is left here only for backwards compatibility
  'sass/map-deep': function({dictionary, options, file}) {
    GroupMessages.add(SASS_MAP_FORMAT_DEPRECATION_WARNINGS, "sass/map-deep");
    return module.exports['scss/map-deep']({dictionary, options, file});
  },

  /**
   * Creates a SCSS file with variable definitions based on the style dictionary.
   *
   * Add `!default` to any variable by setting a `themeable: true` attribute in the token's definition.
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @param {Boolean} [options.themeable=false] - Whether or not tokens should default to being themeable, if not otherwise specified per token.
   * @example
   * ```scss
   * $color-background-base: #f0f0f0;
   * $color-background-alt: #eeeeee !default;
   * ```
   */
  'scss/variables': function({dictionary, options, file}) {
    const { outputReferences, themeable = false } = options;
    return fileHeader({file, commentStyle: 'short'}) +
      formattedVariables({format: 'sass', dictionary, outputReferences, themeable}) + '\n';
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
  'scss/icons': function({dictionary, options, file}) {
    return fileHeader({file, commentStyle: 'short'}) + iconsWithPrefix('$', dictionary.allTokens, options);
  },

  /**
   * Creates a LESS file with variable definitions based on the style dictionary
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```less
   * \@color-background-base: #f0f0f0;
   * \@color-background-alt: #eeeeee;
   * ```
   */
  'less/variables': function({dictionary, options, file}) {
    const { outputReferences } = options;
    return fileHeader({file, commentStyle: 'short'}) +
      formattedVariables({format: 'less', dictionary, outputReferences}) + '\n';
  },

  /**
   * Creates a LESS file with variable definitions and helper classes for icons
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```less
   * \@content-icon-email: '\E001';
   * .icon.email:before { content:\@content-icon-email; }
   * ```
   */
  'less/icons': function({dictionary, options, file}) {
    return fileHeader({file, commentStyle: 'short'}) + iconsWithPrefix('@', dictionary.allTokens, options);
  },

  /**
   * Creates a Stylus file with variable definitions based on the style dictionary
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```stylus
   * $color-background-base= #f0f0f0;
   * $color-background-alt= #eeeeee;
   * ```
   */
  'stylus/variables': function({dictionary, options, file}) {
    const { outputReferences } = options;
    return fileHeader({file, commentStyle: 'short'}) +
      formattedVariables({format: 'stylus', dictionary, outputReferences}) + '\n';
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
   *          value: '#ff0000'
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'javascript/module': function({dictionary, file}) {
    return fileHeader({file}) +
    'module.exports = ' +
      JSON.stringify(dictionary.tokens, null, 2) + ';\n';
  },

  /**
   * Creates a CommonJS module with the whole style dictionary flattened to a single level.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```js
   * module.exports = {
   *  "ColorBaseRed": "#ff0000"
   *}
   *```
   */
  'javascript/module-flat': function({dictionary, file}) {
    return fileHeader({file}) +
      'module.exports = ' + '{\n' + dictionary.allTokens.map(function(token) {
        return `  "${token.name}": ${JSON.stringify(token.value)}`;
      }).join(',\n') + '\n}' + ';\n';
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
   *          value: '#ff0000'
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'javascript/object': function({dictionary, file}) {
    return  fileHeader({file}) +
      'var ' +
      (file.name || '_styleDictionary') +
      ' = ' +
      JSON.stringify(dictionary.tokens, null, 2) +
      ';\n';
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
  'javascript/umd': function({dictionary, file}) {
    var name = file.name || '_styleDictionary'
    return fileHeader({file}) +
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
      '  return ' + JSON.stringify(dictionary.tokens, null, 2) + ';\n' +
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
  'javascript/es6': function({dictionary, file}) {
    return fileHeader({file}) +
      dictionary.allTokens.map(function(token) {
        var to_ret = 'export const ' + token.name + ' = ' + JSON.stringify(token.value) + ';';
        if (token.comment)
          to_ret = to_ret.concat(' // ' + token.comment);
        return to_ret;
      }).join('\n') + '\n';
  },

  // TypeScript declarations
  /**
   * Creates TypeScript declarations for ES6 modules
   *
   * ```json
   * {
   *   "platforms": {
   *     "ts": {
   *       "transformGroup": "js",
   *       "files": [
   *         {
   *           "format": "javascript/es6",
   *           "destination": "colors.js"
   *         },
   *         {
   *           "format": "typescript/es6-declarations",
   *           "destination": "colors.d.ts"
   *         }
   *       ]
   *     }
   *   }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.outputStringLiterals=false] - Whether or not to output literal types for string values
   * @example
   * ```typescript
   * export const ColorBackgroundBase : string;
   * export const ColorBackgroundAlt : string;
   * ```
   */
  'typescript/es6-declarations': function({dictionary, file, options}) {
    return fileHeader({file}) +
      dictionary.allProperties.map(function(prop) {
        let to_ret_prop = '';
        if (prop.comment)
          to_ret_prop += '/** ' + prop.comment + ' */\n';
        to_ret_prop += 'export const ' + prop.name + ' : ' + getTypeScriptType(prop.value, options) + ';';
        return to_ret_prop;
      }).join('\n') + '\n';
  },

  /**
   * Creates TypeScript declarations for CommonJS module
   *
   * ```json
   * {
   *   "platforms": {
   *     "ts": {
   *       "transformGroup": "js",
   *       "files": [
   *         {
   *           "format": "javascript/module",
   *           "destination": "colors.js"
   *         },
   *         {
   *           "format": "typescript/module-declarations",
   *           "destination": "colors.d.ts"
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
   * ```typescript
   * export default tokens;
   * declare interface DesignToken { value: string; name?: string; path?: string[]; comment?: string; attributes?: any; original?: any; }
   * declare const tokens: {
   *  "color": {
   *    "red": DesignToken
   *  }
   * }
   * ```
   *
   * As you can see above example output this does not generate 100% accurate d.ts.
   * This is a compromise between of what style-dictionary can do to help and not bloating the library with rarely used dependencies.
   *
   * Thankfully you can extend style-dictionary very easily:
   *
   * ```js
   * const JsonToTS = require('json-to-ts');
   * StyleDictionaryPackage.registerFormat({
   *   name: 'typescript/accurate-module-declarations',
   *   formatter: function({ dictionary }) {
   *     return 'declare const root: RootObject\n' +
   *     'export default root\n' +
   *     JsonToTS(dictionary.properties).join('\n');
   *   },
   * });
   * ```
   */
  'typescript/module-declarations': function({dictionary, file, options}) {
    const {moduleName=`tokens`} = options;
    function treeWalker(obj) {
      let type = Object.create(null);
      let has = Object.prototype.hasOwnProperty.bind(obj);
      if (has('value')) {
        type = 'DesignToken';
      } else {
        for (var k in obj) if (has(k)) {
          switch (typeof obj[k]) {
            case 'object':
              type[k] = treeWalker(obj[k]);
          }
        }
      }
      return type;
    }
    const designTokenInterface = fs.readFileSync(
      path.resolve(__dirname, `../../types/DesignToken.d.ts`), {encoding:'UTF-8'}
    );

    // get the first and last lines to add to the format by
    // looking for the first and last single-line comment
    const lines = designTokenInterface
      .split('\n');
    const firstLine = lines.indexOf(`//start`) + 1;
    const lastLine = lines.indexOf(`//end`);

    const output = fileHeader({file}) +
`export default ${moduleName};

declare ${lines.slice(firstLine, lastLine).join(`\n`)}

declare const ${moduleName}: ${JSON.stringify(treeWalker(dictionary.tokens), null, 2)}`;

    // JSON stringify will quote strings, because this is a type we need
    // it unquoted.
    return output.replace(/"DesignToken"/g, 'DesignToken') + '\n';
  },

  // Android templates
  /**
   * Creates a [resource](https://developer.android.com/guide/topics/resources/providing-resources) xml file. It is recommended to use a filter with this format
   * as it is generally best practice in Android development to have resource files
   * organized by type (color, dimension, string, etc.). However, a resource file
   * with mixed resources will still work.
   *
   * This format will try to use the proper resource type for each token based on
   * the category (color => color, size => dimen, etc.). However if you want to
   * force a particular resource type you can provide a 'resourceType' attribute
   * on the file configuration. You can also provide a 'resourceMap' if you
   * don't use Style Dictionary's built-in CTI structure.
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <color name="color_base_red_5">#fffaf3f2</color>
   *  <color name="color_base_red_30">#fff0cccc</color>
   *  <dimen name="size_font_base">14sp</color>
   * ```
   */
  'android/resources': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/android/resources.template')
    );
    return template({dictionary, file, options, fileHeader});
  },

  /**
   * Creates a color resource xml file with all the colors in your style dictionary.
   *
   * It is recommended to use the 'android/resources' format with a custom filter
   * instead of this format:
   *
   * ```javascript
   * format: 'android/resources',
   * filter: {
   *   attributes: { category: 'color' }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <color name="color_base_red_5">#fffaf3f2</color>
   *  <color name="color_base_red_30">#fff0cccc</color>
   *  <color name="color_base_red_60">#ffe19d9c</color>
   * ```
   */
  'android/colors': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/android/colors.template')
    );
    return template({dictionary, file, options, fileHeader});
  },

  /**
   * Creates a dimen resource xml file with all the sizes in your style dictionary.
   *
   * It is recommended to use the 'android/resources' format with a custom filter
   * instead of this format:
   *
   * ```javascript
   * format: 'android/resources',
   * filter: {
   *   attributes: { category: 'size' }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <dimen name="size_padding_tiny">5.00dp</dimen>
   *  <dimen name="size_padding_small">10.00dp</dimen>
   *  <dimen name="size_padding_medium">15.00dp</dimen>
   * ```
   */
  'android/dimens': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/android/dimens.template')
    );
    return template({dictionary, file, options, fileHeader});
  },

  /**
   * Creates a dimen resource xml file with all the font sizes in your style dictionary.
   *
   * It is recommended to use the 'android/resources' format with a custom filter
   * instead of this format:
   *
   * ```javascript
   * format: 'android/resources',
   * filter: {
   *   attributes: { category: 'size' }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <dimen name="size_font_tiny">10.00sp</dimen>
   *  <dimen name="size_font_small">13.00sp</dimen>
   *  <dimen name="size_font_medium">15.00sp</dimen>
   * ```
   */
  'android/fontDimens': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/android/fontDimens.template')
    );
    return template({dictionary, file, options, fileHeader});
  },

  /**
   * Creates a resource xml file with all the integers in your style dictionary. It filters your
   * design tokens by `token.attributes.category === 'time'`
   *
   * It is recommended to use the 'android/resources' format with a custom filter
   * instead of this format:
   *
   * ```javascript
   * format: 'android/resources',
   * filter: {
   *   attributes: { category: 'time' }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @todo Update the filter on this.
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *   <integer name="time_duration_short">1000</integer>
   *   <integer name="time_duration_medium">2000</integer>
   *   <integer name="time_duration_long">4000</integer>
   * ```
   */
  'android/integers': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/android/integers.template')
    );
    return template({dictionary, file, options, fileHeader});
  },

  /**
   * Creates a resource xml file with all the strings in your style dictionary. Filters your
   * design tokens by `token.attributes.category === 'content'`
   *
   * It is recommended to use the 'android/resources' format with a custom filter
   * instead of this format:
   *
   * ```javascript
   * format: 'android/resources',
   * filter: {
   *   attributes: { category: 'content' }
   * }
   * ```
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *   <string name="content_icon_email">&#xE001;</string>
   *   <string name="content_icon_chevron_down">&#xE002;</string>
   *   <string name="content_icon_chevron_up">&#xE003;</string>
   * ```
   */
  'android/strings': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/android/strings.template')
    );
    return template({dictionary, file, options, fileHeader});
  },

  // Compose templates
  /**
   * Creates a Kotlin file for Compose containing an object with a `val` for each property.
   *
   * @memberof Formats
   * @kind member
   * @param {String} className The name of the generated Kotlin object
   * @param {String} packageName The package for the generated Kotlin object
   * @param {Object} options
   * @param {String[]} [options.import=['androidx.compose.ui.graphics.Color', 'androidx.compose.ui.unit.*']] - Modules to import. Can be a string or array of strings
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```kotlin
   * package com.example.tokens;
   *
   * import androidx.compose.ui.graphics.Color
   *
   * object StyleDictionary {
   *  val colorBaseRed5 = Color(0xFFFAF3F2)
   * }
   * ```
   */
  'compose/object': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/compose/object.kt.template')
    );
    let allProperties;
    const { outputReferences } = options;
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary,
      formatting: {
        suffix: '',
        commentStyle: 'none' // We will add the comment in the format template
      }
    });

    if (outputReferences) {
      allProperties = [...dictionary.allProperties].sort(sortByReference(dictionary));
    } else {
      allProperties = [...dictionary.allProperties].sort(sortByName);
    }

    options = setComposeObjectProperties(options);

    return template({allProperties, file, options, formatProperty, fileHeader});
  },

  // iOS templates

  /**
   * Creates an Objective-C header file with macros for design tokens
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```objectivec
   * #import <Foundation/Foundation.h>
   * #import <UIKit/UIKit.h>
   *
   * #define ColorFontLink [UIColor colorWithRed:0.00f green:0.47f blue:0.80f alpha:1.00f]
   * #define SizeFontTiny 176.00f
   * ```
   */
  'ios/macros': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/macros.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C plist file
   *
   * @memberof Formats
   * @kind member
   * @todo Fix this template and add example and usage
   */
  'ios/plist': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/plist.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C implementation file of a style dictionary singleton class
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/singleton.m': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/singleton.m.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C header file of a style dictionary singleton class
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/singleton.h': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/singleton.h.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C header file of a static style dictionary class
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/static.h': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/static.h.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C implementation file of a static style dictionary class
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/static.m': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/static.m.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C header file of a color class
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/colors.h': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/colors.h.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C implementation file of a color class
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/colors.m': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/colors.m.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C header file of strings
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/strings.h': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/strings.h.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates an Objective-C implementation file of strings
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'ios/strings.m': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios/strings.m.template')
    );

    return template({ dictionary, options, file, fileHeader });
  },

  /**
   * Creates a Swift implementation file of a class with values. It adds default `class` object type, `public` access control and `UIKit` import.
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {String} [options.accessControl=public] - Level of [access](https://docs.swift.org/swift-book/LanguageGuide/AccessControl.html) of the generated swift object
   * @param {String[]} [options.import=UIKit] - Modules to import. Can be a string or array of strings
   * @param {String} [options.className] - The name of the generated Swift class
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```swift
   * public class StyleDictionary {
   *   public static let colorBackgroundDanger = UIColor(red: 1.000, green: 0.918, blue: 0.914, alpha: 1)
   * }
   * ```
   */
  'ios-swift/class.swift': function({dictionary, options, file, platform}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios-swift/any.swift.template')
    );
    let allTokens;
    const { outputReferences } = options;
    options = setSwiftFileProperties(options, 'class', platform.transformGroup);
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary,
      formatting: {
        suffix: ''
      }
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(sortByReference(dictionary));
    } else {
      allTokens = [...dictionary.allTokens].sort(sortByName);
    }

    return template({allTokens, file, options, formatProperty, fileHeader});
  },

  /**
   * Creates a Swift implementation file of an enum with values. It adds default `enum` object type, `public` access control and `UIKit` import.
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {String} [options.accessControl=public] - Level of [access](https://docs.swift.org/swift-book/LanguageGuide/AccessControl.html) of the generated swift object
   * @param {String[]} [options.import=UIKit] - Modules to import. Can be a string or array of strings
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```swift
   * public enum StyleDictionary {
   *   public static let colorBackgroundDanger = UIColor(red: 1.000, green: 0.918, blue: 0.914, alpha: 1)
   * }
   * ```
   */
  'ios-swift/enum.swift': function({dictionary, options, file, platform}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios-swift/any.swift.template')
    );
    let allTokens;
    const { outputReferences } = options;
    options = setSwiftFileProperties(options, 'enum', platform.transformGroup);
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary,
      formatting: {
        suffix: ''
      }
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(sortByReference(dictionary));
    } else {
      allTokens = [...dictionary.allTokens].sort(sortByName);
    }
    return template({allTokens, file, options, formatProperty, fileHeader});
  },

  /**
   * Creates a Swift implementation file of any given type with values. It has by default `class` object type, `public` access control and `UIKit` import.
   *
   * ```javascript
   * format: 'ios-swift/any.swift',
   * import: ['UIKit', 'AnotherModule'],
   * objectType: 'struct',
   * accessControl: 'internal',
   * ```
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {String} [options.accessControl=public] - Level of [access](https://docs.swift.org/swift-book/LanguageGuide/AccessControl.html) of the generated swift object
   * @param {String[]} [options.import=UIKit] - Modules to import. Can be a string or array of strings
   * @param {String} [options.objectType=class] - The type of the generated Swift object
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```swift
   * import UIKit
   * import AnotherModule
   *
   * internal struct StyleDictionary {
   *   internal static let colorBackgroundDanger = UIColor(red: 1.000, green: 0.918, blue: 0.914, alpha: 1)
   * }
   * ```
   */
   'ios-swift/any.swift': function({ dictionary, options, file, platform }) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/ios-swift/any.swift.template')
    );
    let allTokens;
    const { outputReferences } = options;
    options = setSwiftFileProperties(options, options.objectType, platform.transformGroup);
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary,
      formatting: {
        suffix: ''
      }
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(sortByReference(dictionary));
    } else {
      allTokens = [...dictionary.allTokens].sort(sortByName);
    }
    return template({allTokens, file, options, formatProperty, fileHeader});
  },

  // Css templates

  /**
   * Creates CSS file with @font-face declarations
   *
   * @memberof Formats
   * @kind member
   * @todo Add example and usage
   */
  'css/fonts.css': _template(
    fs.readFileSync(__dirname + '/templates/css/fonts.css.template')
  ),

  // Web templates

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
   *          "value": "#ff0000"
   *        }
   *     }
   *   }
   * }
   * ```
   */
  'json': function({dictionary}) {
    return JSON.stringify(dictionary.tokens, null, 2) + '\n';
  },

  /**
   * Creates a JSON file of the assets defined in the style dictionary.
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
  'json/asset': function({dictionary}) {
    return JSON.stringify({asset: dictionary.tokens.asset}, null, 2);
  },

  /**
   * Creates a JSON nested file of the style dictionary.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```json
   * {
   *   "color": {
   *     "base": {
   *        "red": "#ff0000"
   *     }
   *   }
   * }
   * ```
   */
  'json/nested': function({dictionary}) {
    return JSON.stringify(minifyDictionary(dictionary.tokens), null, 2) + '\n';
  },

  /**
   * Creates a JSON flat file of the style dictionary.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```json
   * {
   *   "color-base-red": "#ff0000"
   * }
   * ```
   */
  'json/flat': function({dictionary}) {
    return '{\n' + dictionary.allTokens.map(function(token) {
        return `  "${token.name}": ${JSON.stringify(token.value)}`;
    }).join(',\n') + '\n}' + '\n';
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
  'sketch/palette': function({dictionary}) {
    var to_ret = {
      'compatibleVersion':'1.0',
      'pluginVersion':'1.1'
    };
    to_ret.colors = dictionary.allTokens
      .filter(function(token) {
        return token.attributes.category === 'color' && token.attributes.type === 'base';
      })
      .map(function(token) {
        return token.value;
      });
    return JSON.stringify(to_ret, null, 2) + '\n';
  },

  /**
   * Creates a sketchpalette file compatible with version 2 of
   * the sketchpalette plugin. To use this you should use the
   * 'color/sketch' transform to get the correct value for the colors.
   *
   * @memberof Formats
   * @kind member
   * @example
   * ```json
   * {
   *   "compatibleVersion": "2.0",
   *   "pluginVersion": "2.2",
   *   "colors": [
   *     {name: "red", r: 1.0, g: 0.0, b: 0.0, a: 1.0},
   *     {name: "green", r: 0.0, g: 1.0, b: 0.0, a: 1.0},
   *     {name: "blue", r: 0.0, g: 0.0, b: 1.0, a: 1.0}
   *   ]
   * }
   * ```
   */
  'sketch/palette/v2': function({dictionary}) {
    var to_ret = {
      compatibleVersion: '2.0',
      pluginVersion: '2.2',
      colors: dictionary.allTokens.map(function(token) {
        // Merging the token's value, which should be an object with r,g,b,a channels
        return Object.assign({
          name: token.name
        }, token.value)
      })
    };
    return JSON.stringify(to_ret, null, 2) + '\n';
  },


  // Flutter templates
  /**
   *  Creates a Dart implementation file of a class with values
   *
   * @memberof Formats
   * @kind member
   * @param {Object} options
   * @param {Boolean} [options.showFileHeader=true] - Whether or not to include a comment that has the build date
   * @param {Boolean} [options.outputReferences=false] - Whether or not to keep [references](/#/formats?id=references-in-output-files) (a -> b -> c) in the output.
   * @example
   * ```dart
   * import 'package:flutter/material.dart';
   *
   * class StyleDictionary {
   *   StyleDictionary._();
   *
   *     static const colorBrandPrimary = Color(0x00ff5fff);
   *     static const sizeFontSizeMedium = 16.00;
   *     static const contentFontFamily1 = "NewJune";
   * ```
   */
  'flutter/class.dart': function({dictionary, options, file}) {
    const template = _template(
      fs.readFileSync(__dirname + '/templates/flutter/class.dart.template')
    );
    let allTokens;
    const { outputReferences } = options;
    const formatProperty = createPropertyFormatter({
      outputReferences,
      dictionary
    });

    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(sortByReference(dictionary));
    } else {
      allTokens = [...dictionary.allTokens].sort(sortByName)
    }
    return template({allTokens, file, options, formatProperty, fileHeader});
  },
};

// Mark which formats are nested
module.exports['json/nested'].nested = true;
module.exports['javascript/module'].nested = true;
module.exports['javascript/object'].nested = true;
