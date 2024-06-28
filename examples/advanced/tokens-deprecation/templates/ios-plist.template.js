/**
 * @typedef {import('style-dictionary/types').Dictionary} Dictionary
 * @typedef {import('style-dictionary/types').TransformedToken} TransformedToken
 * @typedef {import('style-dictionary/types').File} File
 * @typedef {import('style-dictionary/types').Config} Config
 * @typedef {import('style-dictionary/types').LocalOptions} LocalOptions
 */

/**
 *
 * @param {TransformedToken} token
 * @param {Config & LocalOptions} options
 */
const tokenTemplate = (token, options) => {
  let output = `  <key>${token.name}</key>\n`;
  if (token.type === 'color') {
    output += `    <dict>
        <key>r</key>
        <real>${(options.usesDtcg ? token.$value : token.value)[0] / 255}</real>
        <key>g</key>
        <real>${(options.usesDtcg ? token.$value : token.value)[1] / 255}</real>
        <key>b</key>
        <real>${(options.usesDtcg ? token.$value : token.value)[2] / 255}</real>
        <key>a</key>
        <real>1</real>
      </dict>`;
  } else if (token.type === 'dimension') {
    output += `<integer>${options.usesDtcg ? token.$value : token.value}</integer>`;
  } else {
    output += `<string>${options.usesDtcg ? token.$value : token.value}</string>`;
  }

  if (token.comment) {
    output += `\n    <!-- ${token.comment} -->`;
  }
  if (token.deprecated) {
    output += '\n    <key>deprecated</key><true/>';
    if (token.deprecated_comment) {
      output += ' <!-- ' + token.deprecated_comment + ' -->';
    }
  }
  return output;
};

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ dictionary, options, header }) => `
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  ${header}
  <plist version="1.0">
    <dict>
    ${dictionary.allTokens
      .filter(
        (token) =>
          token.type !== 'asset' &&
          token.type !== 'border' &&
          token.type !== 'shadow' &&
          token.type !== 'transition',
      )
      .map((token) => tokenTemplate(token, options))
      .join('\n')}
    </dict>
  </plist>`;
