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
export default ({ dictionary, options, file, header }) => `
//
// ${file.destination ?? ''}
//
${header}
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ${options.type ?? ''}) {
${dictionary.allTokens.map((token) => `${token.name}`).join(',\n')}
};

@interface ${options.className ? `${options.className} ` : ''}: NSObject
+ (NSArray *)values;
+ (UIColor *)color:(${options.type ?? ''})color;
@end`;
