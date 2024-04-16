/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   file: File
 *   formatProperty: (token: TransformedToken) => string
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, file, formatProperty, options, header }) => `
//
// ${file.destination}
//
${header}

namespace TODO;

using System.CodeDom.Compiler;
using Microsoft.Maui.Graphics;
${options.usings
  .map(/** @param {string} namespace */ (namespace) => `using ${namespace};`)
  .join('\n')}

[GeneratedCode("TODO", "TODO")]
${options.accessModifier ? `${options.accessModifier} ` : ''}static class ${
  file.className ? `${file.className} ` : ''
}
{
    ${allTokens
      .map(
        (token) =>
          `${options.accessModifier ? `${options.accessModifier} ` : ''}static ${
            file.type ? `${file.type} ` : ''
          } ${formatProperty(token)}`,
      )
      .join('\n    ')}
}`;
