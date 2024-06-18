import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ dictionary, options, file, header }: Omit<InternalFnArguments, 'platform'>) => `
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
