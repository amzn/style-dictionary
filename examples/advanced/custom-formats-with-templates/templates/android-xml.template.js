/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 */

export default ({ dictionary }) => `<?xml version="1.0" encoding="UTF-8"?>
<resources>
${dictionary.allTokens
  .map((token) => {
    if (token.attributes.category === 'color') {
      token.tag = 'color';
    } else if (token.attributes.category === 'size') {
      token.tag = 'dimen';
    } else if (
      token.attributes.category === 'time' ||
      token.attributes.category === 'opacity' ||
      token.attributes.category === 'multiplier'
    ) {
      token.tag = 'double';
    } else if (token.attributes.category === 'content') {
      token.tag = 'string';
    } else {
      token.tag = 'item';
    }
    return token;
  })
  .map(
    (token) =>
      `  <${token.tag} name="${token.name}">${token.value}</${token.tag}>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`,
  )
  .join('\n')}
</resources>`;
