/**
 * @typedef {import('../../../../types/DesignToken.ts').TransformedTokens} Tokens
 * @typedef {import('../../../../types/DesignToken.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
 */

/**
 *
 * @param {Tokens} obj
 * @param {Config & LocalOptions} options
 * @param {number} depth
 */
function processJsonNode(obj, options, depth = 0) {
  const { formatting } = options;
  const indent = formatting?.indentation ?? '  ';
  const separator = formatting?.separator ?? ':';
  const lineSeparator = formatting?.lineSeparator ?? '\n';
  const prefix = formatting?.prefix ?? '$';
  let output = '';
  if (obj === null) {
    output += `''`;
  } else if (typeof obj === 'string') {
    output += `'${obj}'`;
  } else if (Object.hasOwn(obj, `${options.usesDtcg ? '$' : ''}value`)) {
    // if we have found a leaf (a property with a value) append the value
    output += `${prefix}${obj.name}`;
  } else {
    // if we have found a group of tokens, use the Sass group "(...)" syntax and loop -recursively- on the children
    output += `(${lineSeparator}`;
    output += Object.keys(obj)
      .map(function (newKey) {
        const newProp = obj[newKey];
        return `${indent.repeat(depth + 1)}'${newKey}'${separator} ${processJsonNode(
          newProp,
          options,
          depth + 1,
        )}`;
      })
      .join(`,${lineSeparator}`);
    output += `${lineSeparator}` + indent.repeat(depth) + ')';
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
  const { formatting, mapName } = options;
  const suffix = formatting?.suffix ?? ';';
  const separator = formatting?.separator ?? ':';
  return `
$${mapName ?? 'tokens'}${separator} ${processJsonNode(dictionary.tokens, options)}${suffix}
`;
};
