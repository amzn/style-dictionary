import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   file: File
 *   options: LocalOptions & Config
 *   header: string
 * }} opts
 */
export default ({
  file,
  options,
  header,
}: Omit<InternalFnArguments, 'dictionary' | 'platform'>) => `
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
