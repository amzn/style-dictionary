/**
 * @typedef {import('../../../../types/DesignToken.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/File.ts').File} File
 * @typedef {import('../../../../types/Config.ts').Config} Config
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
export default ({ dictionary, options, file, header }) => `
//
// ${file.destination ?? ''}
//
${header}
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

${dictionary.allTokens
  .map((token) => `#define ${token.name} ${options.usesDtcg ? token.$value : token.value}`)
  .join('\n')}
`;
