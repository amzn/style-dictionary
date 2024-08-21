import type { TransformedToken } from './DesignToken.ts';
import type { FormatFn } from './Format.ts';
import type { LocalOptions, Config } from './Config.ts';
import type { Filter } from './Filter.ts';

// Generally, overriding these would break most formats and are meant
// for the FormattedVariables/createPropertyFormatter helpers,
export interface FormattingOptions extends FormattingOverrides {
  prefix?: string;
  suffix?: string;
  lineSeparator?: string;
  separator?: string;
}

// These you can usually override on the formats level without breaking it
// to customize the output
// Be careful with indentation if the output syntax is indentation-sensitive (e.g. python, yaml)
export interface FormattingOverrides {
  commentStyle?: 'short' | 'long' | 'none';
  commentPosition?: 'above' | 'inline';
  indentation?: string;
  header?: string;
  footer?: string;
  fileHeaderTimestamp?: boolean;
}

export type FileHeader = (
  defaultMessage: string[],
  options?: Config,
) => Promise<string[]> | string[];

export interface File {
  destination?: string;
  format?: string | FormatFn;
  filter?: string | Partial<TransformedToken> | Filter['filter'];
  options?: LocalOptions;
}
