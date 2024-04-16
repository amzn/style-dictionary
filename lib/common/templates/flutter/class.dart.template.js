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
 *   header: string
 * }} opts
 */
export default ({ allTokens, file, formatProperty, header }) => `
//
// ${file.destination}
//
${header}

import 'dart:ui';

class ${file.className ? `${file.className} ` : ''}{
    ${file.className ?? ''}._();

    ${allTokens.map((token) => `static const ${formatProperty(token)}`).join('\n    ')}
}`;
