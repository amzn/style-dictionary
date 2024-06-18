import type { Config, LocalOptions, TransformedToken } from '../../../types';
import type { InternalFnArguments } from '../../../types/Format';

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   file: File
 *   formatProperty: (token: TransformedToken) => string
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({
  allTokens,
  file,
  formatProperty,
  options,
  header,
}: Omit<
  InternalFnArguments<{
    allTokens: TransformedToken[];
    options: Config & LocalOptions & { import?: string[] };
    formatProperty: (token: TransformedToken) => string;
  }>,
  'dictionary' | 'platform'
>) => `
//
// ${file.destination}
//
${header}
${options.import?.map((item) => `import ${item}`).join('\n')}

${options.accessControl ? `${options.accessControl} ` : ''}${
  options.objectType ? `${options.objectType} ` : ''
}${options.className ? `${options.className} ` : ''}{
    ${allTokens
      .map(
        (token) =>
          `${options.accessControl ? `${options.accessControl} ` : ''}static let ${formatProperty(
            token,
          )}`,
      )
      .join('\n    ')}
}`;
