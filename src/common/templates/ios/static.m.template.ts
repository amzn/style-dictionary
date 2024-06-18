import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ dictionary, file, options, header }: Omit<InternalFnArguments, 'platform'>) => `
//
// ${file.destination ?? ''}
//
${header}
#import "${options.className ?? ''}.h"


${dictionary.allTokens
  .map(
    (token) =>
      `${options.type ? `${options.type} ` : ''}const ${token.name} = ${
        options.usesDtcg ? token.$value : token.value
      };`,
  )
  .join('\n')}`;
