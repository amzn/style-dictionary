/**
 * @typedef {import('../../../../types/DesignToken.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/File.ts').File} File
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
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
