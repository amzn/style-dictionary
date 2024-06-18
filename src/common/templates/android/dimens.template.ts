import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({
  dictionary,
  options,
  header,
}: Omit<InternalFnArguments, 'file' | 'platform'>) => `<?xml version="1.0" encoding="UTF-8"?>

${header}
<resources>
${dictionary.allTokens
  .filter((token) => (options.usesDtcg ? token.$type : token.type) === 'dimension')
  .map(
    (token) =>
      `  <dimen name="${token.name}">${options.usesDtcg ? token.$value : token.value}</dimen>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`,
  )
  .join('\n')}
</resources>`;
