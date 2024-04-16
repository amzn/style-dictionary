/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/File.d.ts').File} File
 */

/**
 * @param {{
 *   dictionary: Dictionary
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ dictionary, file, header }) => `
// ${file.destination ?? ''}
//
${header}
#import <Foundation/Foundation.h>


${dictionary.allTokens
  .map((token) => `extern ${file.type ? `${file.type} ` : ''}const ${token.name};`)
  .join('\n')}`;
