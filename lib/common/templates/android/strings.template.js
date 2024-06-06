/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ dictionary, options, header }) => `<?xml version="1.0" encoding="UTF-8"?>

${header}
<resources>
${dictionary.allTokens
  .filter((token) => (options.usesDtcg ? token.$type : token.type) === 'content')
  .map(
    (token) =>
      `  <string name="${token.name}">${options.usesDtcg ? token.$value : token.value}</string>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`,
  )
  .join('\n')}
</resources>`;
