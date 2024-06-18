import type { DesignTokens, Config, LocalOptions } from '../../../types';
import type { InternalFnArguments } from '../../../types/Format';

/**
 *
 * @param {DesignTokens} obj
 * @param {Config & LocalOptions} options
 * @param {number} depth
 */
function processJsonNode(obj: DesignTokens, options: Config & LocalOptions, depth = 0) {
  let output = '';
  if (obj === null) {
    output += `''`;
  } else if (typeof obj === 'string') {
    output += `'${obj}'`;
  } else if (Object.hasOwn(obj, `${options.usesDtcg ? '$' : ''}value`)) {
    // if we have found a leaf (a property with a value) append the value
    output += `$${obj.name}`;
  } else {
    // if we have found a group of tokens, use the Sass group "(...)" syntax and loop -recursively- on the children
    output += '(\n';
    output += Object.keys(obj)
      .map(function (newKey) {
        const newProp = obj[newKey];
        const indent = '  '.repeat(depth + 1);
        return `${indent}'${newKey}': ${processJsonNode(newProp, options, depth + 1)}`;
      })
      .join(',\n');
    output += '\n' + '  '.repeat(depth) + ')';
  }
  return output;
}

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 * }} opts
 */
export default ({ dictionary, options }: Omit<InternalFnArguments, 'file' | 'platform'>) => `
$${options.mapName ?? 'tokens'}: ${processJsonNode(dictionary.tokens, options)};
`;
