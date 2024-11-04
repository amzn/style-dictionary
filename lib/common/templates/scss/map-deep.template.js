/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedTokens} Tokens
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 *
 * @param {Tokens} obj
 * @param {Config & LocalOptions} options
 * @param {number} depth
 */
function processJsonNode(obj, options, depth = 0) {
  const indent = options.formatting?.indentation ?? '  ';
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
    output += `(\n`;
    output += Object.keys(obj)
      .map(function (newKey) {
        const newProp = obj[newKey];
        return `${indent.repeat(depth + 1)}'${newKey}': ${processJsonNode(
          newProp,
          options,
          depth + 1,
        )}`;
      })
      .join(`,\n`);
    output += `\n` + indent.repeat(depth) + ')';
  }
  return output;
}

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 * }} opts
 */
export default ({ dictionary, options }) => {
  return `
$${options.mapName ?? 'tokens'}: ${processJsonNode(dictionary.tokens, options)};
`;
};
