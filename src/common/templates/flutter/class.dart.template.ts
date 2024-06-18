import type { TransformedToken, File, LocalOptions, Config } from '../../../types';

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   file: File
 *   options: LocalOptions & Config
 *   formatProperty: (token: TransformedToken) => string
 *   header: string
 * }} opts
 */
export default ({
  allTokens,
  file,
  options,
  formatProperty,
  header,
}: {
  allTokens: TransformedToken[];
  file: File;
  options: LocalOptions & Config;
  formatProperty: (token: TransformedToken) => string;
  header: string;
}) => `
//
// ${file.destination}
//
${header}

import 'dart:ui';

class ${options.className ? `${options.className} ` : ''}{
    ${options.className ?? ''}._();

    ${allTokens.map((token) => `static const ${formatProperty(token)}`).join('\n    ')}
}`;
