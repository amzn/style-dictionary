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


/**
 *
 * @module formatHelpers
 */

// no-op default
const defaultFileHeader = (arr) => arr

/**
 *
 * This is for creating the comment at the top of generated files with the generated at date.
 * It will use the custom file header if defined on the configuration, or use the
 * default file header.
 * @memberof module:formatHelpers
 * @param {File} file - The file object that is passed to the formatter.
 * @param {String} commentStyle - The only options are 'short' and 'xml', which will use the // or \<!-- --> style comments respectively. Anything else will use \/\* style comments.
 * @returns {String}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, file }) {
 *     return fileHeader(file, 'short') +
 *       dictionary.allProperties.map(token => `${token.name} = ${token.value}`);
 *   }
 * });
 * ```
 */
function fileHeader(file, commentStyle) {
  // showFileHeader is true by default
  let showFileHeader = true;
  if (file.options && typeof file.options.showFileHeader !== 'undefined') {
    showFileHeader = file.options.showFileHeader;
  }

  // Return empty string if the showFileHeader is false
  if (!showFileHeader) return '';

  let fn = defaultFileHeader;
  if (file.options && typeof file.options.fileHeader === 'function') {
    fn = file.options.fileHeader;
  }

  // default header
  const defaultHeader = [
    `Do not edit directly`,
    `Generated on ${new Date().toUTCString()}`
  ];
  let commentPrefix, commentHeader, commentFooter;
  if (showFileHeader) {
    if (commentStyle === 'short') {
      commentPrefix = '// ';
      commentHeader = '\n';
      commentFooter = '\n\n';
    } else if (commentStyle === 'xml') {
      commentPrefix = ' ';
      commentHeader = '<!--\n';
      commentFooter = '\n-->\n';
    } else {
      commentPrefix = ' * ';
      commentHeader = '/**\n';
      commentFooter = '\n */\n\n';
    }
  }

  return `${commentHeader}${fn(defaultHeader)
    .map(line => `${commentPrefix}${line}`)
    .join('\n')}${commentFooter}`;
}

/**
 *
 * This is used to create lists of variables like Sass variables or CSS custom properties
 * @memberof module:formatHelpers
 * @param {String} format - What type of variables to output. Options are: css, sass, less, and stylus
 * @param {Object} dictionary - The dictionary object that gets passed to the formatter method.
 * @param {Boolean} outputReferences - Whether or not to output references
 * @returns {String}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, options }) {
 *     return formattedVariables('less', dictionary, options.outputReferences);
 *   }
 * });
 * ```
 */
function formattedVariables(format, dictionary, outputReferences = false) {
  var prefix, commentStyle, indentation, separator;

  switch(format) {
    case 'css':
      prefix = '--';
      indentation = '  ';
      separator = ':';
      break;
    case 'sass':
      prefix = '$';
      commentStyle = 'short';
      indentation = '';
      separator = ':';
      break;
    case 'less':
      prefix = '@';
      commentStyle = 'short';
      indentation = '';
      separator = ':';
      break;
    case 'stylus':
      prefix = '$';
      commentStyle = 'short';
      indentation = '';
      separator = '=';
      break;
  }

  return dictionary.allProperties
    // Some languages are imperative, meaning a variable has to be defined
    // before it is used. If `outputReferences` is true, check if the token
    // has a reference, and if it does send it to the end of the array.
    .sort((a) => {
      if (outputReferences) {
        if (dictionary.usesReference(a.original.value)) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 0;
      }
    })
    .map(function(prop) {
      var to_ret_prop = `${indentation}${prefix}${prop.name}${separator} `;
      let value = prop.value;

      if (outputReferences && dictionary.usesReference(prop.original.value)) {
        var ref = dictionary.getReference(prop.original.value).name;
        if (format === 'css') {
          value = `var(${prefix}${ref})`
        } else {
          value = `${prefix}${ref}`;
        }
      }

      to_ret_prop += (prop.attributes.category==='asset' ? '"'+value+'"' : value);

      if (format == 'sass' && prop.themeable === true) {
        to_ret_prop += ' !default';
      }

      to_ret_prop += ';';

      if (prop.comment) {
        if (commentStyle === 'short') {
          to_ret_prop = to_ret_prop.concat(' // ' + prop.comment);
        } else {
          to_ret_prop = to_ret_prop.concat(' /* ' + prop.comment + ' */');
        }
      }

      return to_ret_prop;
    })
    .filter(function(strVal) { return !!strVal })
    .join('\n');
}

/**
 *
 * This is used to create CSS (and CSS pre-processor) lists of icons. It assumes you are
 * using an icon font and creates helper classes with the :before psuedo-selector to add
 * a unicode character.
 * __You probably don't need this.__
 * @memberof module:formatHelpers
 * @param {String} prefix - Character to prefix variable names, like '$' for Sass
 * @param {Property[]} properties - allProperties array on the dictionary object passed to the formatter function.
 * @param {Object} options - options object passed to the formatter function.
 * @returns {String}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, options }) {
 *     return iconsWithPrefix('$', dictionary.allProperties, options);
 *   }
 * });
 * ```
 */
function iconsWithPrefix(prefix, properties, options) {
  return properties.filter(function(prop) {
      return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
    })
    .map(function(prop) {
      var varName = prefix + prop.name + ': ' + prop.value + ';';
      var className = '.' + options.prefix + '-icon.' + prop.attributes.item + ':before ';
      var declaration = '{ content: ' + prefix + prop.name + '; }';
      return varName + '\n' + className + declaration;
    })
    .join('\n');
}

/**
 * Outputs an object stripping out everything except values
 * @memberof module:formatHelpers
 * @param {Object} obj - The object to minify. You will most likely pass `dictionary.properties` to it.
 * @returns {Object}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary }) {
 *     return JSON.stringify(minifyDictionary(dictionary.properties));
 *   }
 * });
 * ```
 */
function minifyDictionary(obj) {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  var toRet = {};

  if (obj.hasOwnProperty('value')) {
    return obj.value;
  } else {
    for(var name in obj) {
      if(obj.hasOwnProperty(name)) {
        toRet[name] = minifyDictionary(obj[name]);
      }
    }
  }
  return toRet;
}

module.exports = {
  minifyDictionary,
  fileHeader,
  formattedVariables,
  iconsWithPrefix,
}