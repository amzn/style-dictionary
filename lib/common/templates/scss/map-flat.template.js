import { addComment } from '../../formatHelpers/createPropertyFormatter.js';

/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, options, header }) => {
  const _f = options.formatting ?? {};
  const f = {
    ..._f,
    indentation: _f.indentation ?? '  ',
    commentStyle: _f.commentStyle ?? 'short',
    commentPosition: _f.commentPosition ?? 'above',
  };
  return `
${header}$${options.mapName ?? 'tokens'}: (\n${allTokens
    .map((token, i, arr) => {
      const tokenString = `${f.indentation}'${token.name}': ${
        options.usesDtcg ? token.$value : token.value
      }${i !== arr.length - 1 ? ',' : ''}`;
      if (token.comment && f.commentStyle !== 'none') {
        return addComment(tokenString, token.comment, f);
      }
      return tokenString;
    })
    .join(`\n`)}\n);`;
};
