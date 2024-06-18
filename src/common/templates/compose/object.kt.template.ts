import type { Config, LocalOptions, TransformedToken } from '../../../types';

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   formatProperty: (token: TransformedToken) => string
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
const composeObjectTemplate = ({
  allTokens,
  formatProperty,
  options,
  header,
}: {
  allTokens: TransformedToken[];
  formatProperty: (token: TransformedToken) => string;
  options: Config & LocalOptions & { import?: string[] };
  header: string;
}) => `
${header}

package ${options.packageName ?? ''};

${options.import?.map((item) => `import ${item}`).join('\n')}

object ${options.className ?? ''} {
${allTokens
  .map(
    (token) =>
      `${token.comment ? `  /** ${token.comment} */\n` : ''}  val ${formatProperty(token)}`,
  )
  .join('\n')}
}`;

export default composeObjectTemplate;
