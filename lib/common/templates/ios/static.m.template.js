/**
 * @typedef {import('../../../../types/DesignToken.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/File.ts').File} File
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ dictionary, file, options, header }) => `
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
