import { addComment } from '../../formatHelpers/createPropertyFormatter.js';

/**
 * @typedef {import('../../../../types/DesignToken.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
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
    separator: _f.separator ?? ':',
    lineSeparator: _f.lineSeparator ?? '\n',
    prefix: _f.prefix ?? '',
    suffix: _f.suffix ?? ';',
    commentStyle: _f.commentStyle ?? 'short',
    commentPosition: _f.commentPosition ?? 'above',
  };
  return `
${header}$${options.mapName ?? 'tokens'}${f.separator} (${f.lineSeparator}${allTokens
    .map((token, i, arr) => {
      const tokenString = `${f.indentation}'${f.prefix ?? ''}${token.name}'${f.separator} ${
        options.usesDtcg ? token.$value : token.value
      }${i !== arr.length - 1 ? ',' : ''}`;
      if (token.comment && f.commentStyle !== 'none') {
        return addComment(tokenString, token.comment, f);
      }
      return tokenString;
    })
    .join(`${f.lineSeparator}`)}${f.lineSeparator})${f.suffix}`;
};
