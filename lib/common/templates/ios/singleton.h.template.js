/**
 * @typedef {import('../../../../types/File.d.ts').File} File
 */

/**
 * @param {{
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ file, header }) => `
//
// ${file.destination ?? ''}
//
${header}
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface ${file.className ? `${file.className} ` : ''}: NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end`;
