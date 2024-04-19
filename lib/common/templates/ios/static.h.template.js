/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   dictionary: Dictionary
 *   file: File
 *   options: LocalOptions & Config
 *   header: string
 * }} opts
 */
export default ({ dictionary, file, options, header }) => `
// ${file.destination ?? ''}
//
${header}
#import <Foundation/Foundation.h>


${dictionary.allTokens
  .map((token) => `extern ${options.type ? `${options.type} ` : ''}const ${token.name};`)
  .join('\n')}`;
