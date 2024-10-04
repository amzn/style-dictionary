/**
 * @typedef {import('../../../../types/DesignToken.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   formatProperty: (token: TransformedToken) => string
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, formatProperty, options, header }) => {
  const hasDescription = options.showDescriptionColumn;

  return `
${header}

| Token | ${hasDescription ? 'Description  | ' : ''}Type | Value |
| --- | ${hasDescription ? '---  | ' : ''}--- | --- |
${allTokens
  .map(
    (token) =>
      `| ${token.name.replace(/ $/, '')} | ${hasDescription ? (token.$description ? token.$description : token.comment ? token.comment : '') + ' | ' : ''}${token.original.type} | \u0060${options.usesDtcg ? JSON.stringify(token.original.$value) : token.original.value}\u0060 |`,
  )
  .join('\n')}
`;
};
