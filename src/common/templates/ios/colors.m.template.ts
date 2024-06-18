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

@implementation ${options.className ?? ''}

+ (UIColor *)color:(${options.type ?? ''})colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
${dictionary.allTokens.map((token) => (options.usesDtcg ? token.$value : token.value)).join(',\n')}
    ];
  });

  return colorArray;
}

@end`;
