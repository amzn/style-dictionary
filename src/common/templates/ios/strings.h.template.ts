import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   dictionary: Dictionary
 *   file: File
 *   options: LocalOptions & Config
 *   header: string
 * }} opts
 */
export default ({ dictionary, file, options, header }: Omit<InternalFnArguments, 'platform'>) => `
//
// ${file.destination ?? ''}
//
${header}
#import <Foundation/Foundation.h>


${dictionary.allTokens.map((token) => `extern NSString * const ${token.name};`).join('\n')}

@interface ${options.className ?? ''} : NSObject
+ (NSArray *)values;
@end`;
