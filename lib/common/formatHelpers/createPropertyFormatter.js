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

const defaultFormatting = {
  prefix: '',
  commentStyle: 'long',
  commentPosition: 'inline',
  indentation: '',
  separator: ' =',
  suffix: ';'
};

/**
 * Split a string comment by newlines and
 * convert to multi-line comment if necessary
 * @param {string} to_ret_prop
 * @param {Object} options
 * @param {string} options.comment
 * @param {string} options.indentation
 * @param {string} options.style 'short' | 'long'
 * @param {string} options.position 'above' | 'inline'
 * @returns {string}
 */
function addComment(to_ret_prop, options) {
  const { comment, style, indentation } = options;
  let { position } = options;

  const commentsByNewLine = comment.split("\n");
  if (commentsByNewLine.length > 1) {
    position = 'above';
  }

  let processedComment;
  switch (style) {
    case 'short':
      if (position === 'inline') {
        processedComment = `// ${comment}`;
      } else {
        processedComment = commentsByNewLine.reduce(
          (acc, curr) => `${acc}${indentation}// ${curr}\n`,
          ''
        );
        // remove trailing newline
        processedComment = processedComment.replace(/\n$/g, '');
      }
      break;
    case 'long':
      if (commentsByNewLine.length > 1) {
        processedComment = commentsByNewLine.reduce(
          (acc, curr) => `${acc}${indentation} * ${curr}\n`,
          `${indentation}/**\n`
        );
        processedComment += `${indentation} */`;
      } else {
        processedComment = `${position === 'above' ? indentation : ''
          }/* ${comment} */`;
      }
      break;
  }

  if (position === 'above') {
    // put the comment above the prop if it's multi-line or if commentStyle ended with -above
    to_ret_prop = `${processedComment}\n${to_ret_prop}`;
  } else {
    to_ret_prop = `${to_ret_prop} ${processedComment}`;
  }

  return to_ret_prop;
}

/**
 * Creates a function that can be used to format a property. This can be useful
 * to use as the function on `dictionary.allTokens.map`. The formatting
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
 *     return dictionary.allTokens.map(formatProperty).join('\n');
 *   }
 * });
 * ```
 * @param {Object} options
 * @param {Boolean} options.outputReferences - Whether or not to output references. You will want to pass this from the `options` object sent to the formatter function.
 * @param {Boolean} options.outputReferenceFallbacks - Whether or not to output css variable fallback values when using output references. You will want to pass this from the `options` object sent to the formatter function.
 * @param {Dictionary} options.dictionary - The dictionary object sent to the formatter function
 * @param {String} options.format - Available formats are: 'css', 'sass', 'less', and 'stylus'. If you want to customize the format and can't use one of those predefined formats, use the `formatting` option
 * @param {Object} options.formatting - Custom formatting properties that define parts of a declaration line in code. The configurable strings are: prefix, indentation, separator, suffix, and commentStyle. Those are used to generate a line like this: `${indentation}${prefix}${prop.name}${separator} ${prop.value}${suffix}`
 * @param {Boolean} options.themeable [false] - Whether tokens should default to being themeable.
 * @returns {Function}
 */
function createPropertyFormatter({
  outputReferences = false,
  outputReferenceFallbacks = false,
  dictionary,
  format,
  formatting = {},
  themeable = false
}) {
  const formatDefaults = {};
  switch (format) {
    case 'css':
      formatDefaults.prefix = '--';
      formatDefaults.indentation = '  ';
      formatDefaults.separator = ':';
      break;
    case 'sass':
      formatDefaults.prefix = '$';
      formatDefaults.commentStyle = 'short';
      formatDefaults.indentation = '';
      formatDefaults.separator = ':';
      break;
    case 'less':
      formatDefaults.prefix = '@';
      formatDefaults.commentStyle = 'short';
      formatDefaults.indentation = '';
      formatDefaults.separator = ':';
      break;
    case 'stylus':
      formatDefaults.prefix = '$';
      formatDefaults.commentStyle = 'short';
      formatDefaults.indentation = '';
      formatDefaults.separator = '=';
      break;
  }
  let {prefix, commentStyle, commentPosition, indentation, separator, suffix} = Object.assign({}, defaultFormatting, formatDefaults, formatting);

  return function(prop) {
    let to_ret_prop = `${indentation}${prefix}${prop.name}${separator} `;
    let value = prop.value;

    /**
     * A single value can have multiple references either by interpolation:
     * "value": "{size.border.width.value} solid {color.border.primary.value}"
     * or if the value is an object:
     * "value": {
     *    "size": "{size.border.width.value}",
     *    "style": "solid",
     *    "color": "{color.border.primary.value"}
     * }
     * This will see if there are references and if there are, replace
     * the resolved value with the reference's name.
     */
    if (outputReferences && dictionary.usesReference(prop.original.value)) {
      // Formats that use this function expect `value` to be a string
      // or else you will get '[object Object]' in the output
      const refs = dictionary.getReferences(prop.original.value);

      // original can either be an object value, which requires transitive value transformation in web CSS formats
      // or a different (primitive) type, meaning it can be stringified.
      const originalIsObject = typeof prop.original.value === 'object' && prop.original.value !== null;

      if (!originalIsObject) {
        // when original is object value, we replace value by matching ref.value and putting a var instead.
        // Due to the original.value being an object, it requires transformation, so undoing the transformation
        // by replacing value with original.value is not possible.

        // when original is string value, we replace value by matching original.value and putting a var instead
        // this is more friendly to transitive transforms that transform the string values
        value = prop.original.value;
      }

      refs.forEach(ref => {
        // value should be a string that contains the resolved reference
        // because Style Dictionary resolved this in the resolution step.
        // Here we are undoing that by replacing the value with
        // the reference's name

        // Safe way to check if object contains a property.
        // below can be replaced with the new safe Object.hasOwn() in evergreen browsers / Node 16.9.0 onwards
        if (Object.prototype.hasOwnProperty.call(ref, 'value') && Object.prototype.hasOwnProperty.call(ref, 'name')) {
          const replaceFunc = function() {
            if (format === 'css') {
              if (outputReferenceFallbacks) {
                return `var(${prefix}${ref.name}, ${ref.value})`;
              } else {
                return `var(${prefix}${ref.name})`;
              }
            } else {
              return `${prefix}${ref.name}`;
            }
          }
          value = value.replace(originalIsObject ? ref.value : new RegExp(`{${ref.path.join('.')}(.value)?}`, 'g'), replaceFunc);
        }
      });
    }

    to_ret_prop += prop.attributes.category === 'asset' ? `"${value}"` : value;

    const themeable_prop = typeof prop.themeable === 'boolean' ? prop.themeable : themeable;
    if (format === 'sass' && themeable_prop) {
      to_ret_prop += ' !default';
    }

    to_ret_prop += suffix;

    if (prop.comment && commentStyle !== 'none') {
      to_ret_prop = addComment(to_ret_prop, {
        comment: prop.comment,
        style: commentStyle,
        position: commentPosition,
        indentation,
      });
    }

    return to_ret_prop;
  }
}

module.exports = createPropertyFormatter;
