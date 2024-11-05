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
