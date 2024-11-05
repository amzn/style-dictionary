/**
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   file: File
 *   options: LocalOptions & Config
 *   header: string
 * }} opts
 */
export default ({ file, options, header }) => `
//
// ${file.destination ?? ''}
//
${header}
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface ${options.className ? `${options.className} ` : ''}: NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end`;
