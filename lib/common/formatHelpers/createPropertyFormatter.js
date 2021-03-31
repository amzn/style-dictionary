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

const createReferenceRegex = require('../../utils/references/createReferenceRegex');

const defaultFormatting = {
  prefix: '',
  commentStyle: 'long',
  indentation: '',
  separator: ' =',
  suffix: ';'
}

/**
 * Creates a function that can be used to format a property. This can be useful
 * to use as the function on `dictionary.allProperties.map`. The formatting
 * is configurable either by supplying a `format` option or a `formatting` object
 * which uses: prefix, indentation, separator, suffix, and commentStyle.
 * @memberof module:formatHelpers
 * @example
 * ```javascript
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, options }) {
 *     const { outputReferences } = options;
 *     const formatProperty = createPropertyFormatter({
 *       outputReferences,
 *       dictionary,
 *       format: 'css'
 *     });
 *     return dictionary.allProperties.map(formatProperty).join('\n');
 *   }
 * });
 * ```
 * @param {Object} options
 * @param {Boolean} options.outputReferences - Whether or not to output references. You will want to pass this from the `options` object sent to the formatter function.
 * @param {Dictionary} options.dictionary - The dictionary object sent to the formatter function
 * @param {String} options.format - Available formats are: 'css', 'sass', 'less', and 'stylus'. If you want to customize the format and can't use one of those predefined formats, use the `formatting` option
 * @param {Object} options.formatting - Custom formatting properties that define parts of a declaration line in code. The configurable strings are: prefix, indentation, separator, suffix, and commentStyle. Those are used to generate a line like this: `${indentation}${prefix}${prop.name}${separator} ${prop.value}${suffix}`
 * @returns {Function}
 */
function createPropertyFormatter({outputReferences, dictionary, format, formatting={}}) {
  let {prefix, commentStyle, indentation, separator, suffix} = Object.assign({}, defaultFormatting, formatting);

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

  const regex = createReferenceRegex({});

  return function(prop) {
    let to_ret_prop = `${indentation}${prefix}${prop.name}${separator} `;
    let value = prop.value;

    if (outputReferences && dictionary.usesReference(prop.original.value)) {
      const refs = dictionary.getReferences(prop.original.value);

      value = prop.original.value.replace(regex, function(match, variable) {
        // get the specific reference in the list of references
        const ref = refs
          .find(token => token.path.join('.') === variable.replace('.value',''))
          .name;
        if (format === 'css') {
          return `var(${prefix}${ref})`
        } else {
          return `${prefix}${ref}`;
        }
      });
    }

    to_ret_prop += prop.attributes.category === 'asset' ? `"${value}"` : value;

    if (format == 'sass' && prop.themeable === true) {
      to_ret_prop += ' !default';
    }

    to_ret_prop += suffix;

    if (prop.comment) {
      if (commentStyle === 'short') {
        to_ret_prop = to_ret_prop.concat(` // ${prop.comment}`);
      } else {
        to_ret_prop = to_ret_prop.concat(` /* ${prop.comment} */`);
      }
    }

    return to_ret_prop;
  }
}

module.exports = createPropertyFormatter;