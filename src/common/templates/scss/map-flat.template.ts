import type { TransformedToken } from '../../../types';
import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({
  allTokens,
  options,
  header,
}: Omit<
  InternalFnArguments<{ allTokens: TransformedToken[] }>,
  'dictionary' | 'file' | 'platform'
>) => `
${header}$${options.mapName ?? 'tokens'}: (
${allTokens
  .map(
    (token) =>
      `${token.comment ? `  // ${token.comment}\n` : ''}  '${token.name}': ${
        options.usesDtcg ? token.$value : token.value
      }`,
  )
  .join(',\n')}
);`;
