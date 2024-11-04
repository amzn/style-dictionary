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
 *   options: LocalOptions & Config
 *   formatProperty: (token: TransformedToken) => string
 *   header: string
 * }} opts
 */
export default ({ allTokens, file, options, formatProperty, header }) => `
//
// ${file.destination}
//
${header}

import 'dart:ui';

class ${options.className ? `${options.className} ` : ''}{
    ${options.className ?? ''}._();

    ${allTokens.map((token) => `static const ${formatProperty(token)}`).join('\n    ')}
}`;
