/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
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
#import "${file.className ?? ''}.h"


${dictionary.allTokens
  .map(
    (token) =>
      `${file.type ? `${file.type} ` : ''}const ${token.name} = ${
        options.usesDtcg ? token.$value : token.value
      };`,
  )
  .join('\n')}`;
