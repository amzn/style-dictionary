/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 *
 * @param {TransformedTokens} slice
 * @param {Config & LocalOptions} options
 * @param {string} [indent]
 */
function buildDictionary(slice, options, indent) {
  indent = indent || '  ';
  let to_ret = '@{\n';
  if (Object.hasOwn(slice, `${options.usesDtcg ? '$' : ''}value`)) {
    const token = /** @type {TransformedToken} */ (slice);
    let value = options.usesDtcg ? token.$value : token.value;
    if (token.type === 'dimension' || token.type === 'fontSize' || token.type === 'time') {
      value = '@' + value;
    }
    to_ret += indent + '@"value": ' + value + ',\n';
    to_ret += indent + '@"name": @"' + token.name + '",\n';

    for (const name in token.attributes) {
      if (token.attributes[name]) {
        to_ret += indent + '@"' + name + '": @"' + token.attributes[name] + '",\n';
      }
    }

    // remove last comma
    return to_ret.slice(0, -2) + '\n' + indent + '}';
  } else {
    for (const name in slice) {
      to_ret +=
        indent + '@"' + name + '": ' + buildDictionary(slice[name], options, indent + '  ') + ',\n';
    }
    // remove last comma
    return to_ret.slice(0, -2) + '\n' + indent + '}';
  }
}

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   file: File
 *   header: string
 * }} opts
 */
export default ({ dictionary, options, file, header }) => `
//
// ${file.destination ?? ''}
//
${header}
#import "${file.className ?? ''}.h"

@implementation ${file.className ?? ''}

+ (NSDictionary *)getProperty:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:keyPath];
}

+ (nonnull)getValue:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:[NSString stringWithFormat:@"%@.value", keyPath]];
}

+ (NSDictionary *)properties {
  static NSDictionary * dictionary;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    dictionary = ${buildDictionary(dictionary.tokens, options)};
  });

  return dictionary;
}

@end

`;
