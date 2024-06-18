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
}: Omit<InternalFnArguments, 'platform' | 'file'>) => `<?xml version="1.0" encoding="UTF-8"?>

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
