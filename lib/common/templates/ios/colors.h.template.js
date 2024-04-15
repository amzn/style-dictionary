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
//
// ${file.destination ?? ''}
//
${header}
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ${file.type ?? ''}) {
${dictionary.allTokens.map((token) => `${token.name}`).join(',\n')}
};

@interface ${file.className ? `${file.className} ` : ''}: NSObject
+ (NSArray *)values;
+ (UIColor *)color:(${file.type ?? ''})color;
@end`;
