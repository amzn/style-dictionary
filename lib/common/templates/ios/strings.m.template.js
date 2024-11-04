/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 *
 * @param {TransformedToken} token
 * @param {Config & LocalOptions} options
 * @returns
 */
function buildToken(token, options) {
  let to_ret = '@{\n';
  to_ret += '  ' + '@"value": ' + (options.usesDtcg ? token.$value : token.value) + ',\n';
  to_ret += '  ' + '@"name": @"' + token.name + '",\n';

  for (const name in token.attributes) {
    if (token.attributes[name]) {
      to_ret += '    ' + '@"' + name + '": @"' + token.attributes[name] + '",\n';
    }
  }

  // remove last comma
  return to_ret.slice(0, -2) + '\n' + '  ' + '}';
}

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


${dictionary.allTokens
  .map(
    (token) => `NSString * const ${token.name} = ${options.usesDtcg ? token.$value : token.value};`,
  )
  .join('\n')}

@implementation ${options.className ?? ''}

+ (NSArray *)values {
  static NSArray* array;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    array = @[
      ${dictionary.allTokens.map((token) => buildToken(token, options)).join(',\n')}
    ];
  });

  return array;
}

@end

`;
