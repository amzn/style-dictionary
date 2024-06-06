/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 *
 * @param {TransformedToken} token
 * @param {Config & LocalOptions} options
 */
const tokenTemplate = (token, options) => {
  const val = options.usesDtcg ? token.$value : token.value;
  const type = options.usesDtcg ? token.$type : token.type;
  let output = `  <key>${token.name}</key>\n`;
  if (type === 'color') {
    output += `    <dict>
      <key>r</key>
      <real>${val[0] / 255}</real>
      <key>g</key>
      <real>${val[1] / 255}</real>
      <key>b</key>
      <real>${val[2] / 255}</real>
      <key>a</key>
      <real>1</real>
    </dict>`;
  } else if (type === 'dimension') {
    output += `<integer>${val}</integer>`;
  } else {
    output += `<string>${val}</string>`;
  }

  if (token.comment) {
    output += `\n    <!-- ${token.comment} -->`;
  }
  return output;
};

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
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
    .filter((token) => {
      const t = options.usesDtcg ? token.$type : token.type;
      return t !== 'asset' && t !== 'border' && t !== 'shadow' && t !== 'transition';
    })
    .map((token) => tokenTemplate(token, options))
    .join('\n')}
  </dict>
</plist>`;
