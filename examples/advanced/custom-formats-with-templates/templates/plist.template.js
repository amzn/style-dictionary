/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 */

/**
 *
 * @param {TransformedToken} token
 */
const tokenTemplate = (token) => {
  let output = `  <key>${token.name}</key>\n`;
  if (token.type === 'color') {
    output += `    <dict>
      <key>r</key>
      <real>${token.value[0] / 255}</real>
      <key>g</key>
      <real>${token.value[1] / 255}</real>
      <key>b</key>
      <real>${token.value[2] / 255}</real>
      <key>a</key>
      <real>1</real>
    </dict>`;
  } else if (token.type === 'dimension') {
    output += `<integer>${token.value}</integer>`;
  } else {
    output += `<string>${token.value}</string>`;
  }

  if (token.comment) {
    output += `\n    <!-- ${token.comment} -->`;
  }
  return output;
};

/**
 * @param {{
 *   dictionary: Dictionary
 * }} opts
 */
export default ({ dictionary }) => `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
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
    .map((token) => tokenTemplate(token))
    .join('\n')}
  </dict>
</plist>`;
