import type { TransformedToken } from './DesignToken.d.ts';
import type { FormatFn } from './Format.d.ts';
import type { LocalOptions, Config } from './Config.d.ts';
import type { Filter } from './Filter.d.ts';

export interface FormattingOptions {
  prefix?: string;
  suffix?: string;
  lineSeparator?: string;
  header?: string;
  footer?: string;
  commentStyle?: 'short' | 'long' | 'none';
  commentPosition?: 'above' | 'inline';
  indentation?: string;
  separator?: string;
  fileHeaderTimestamp?: boolean;
}

export type FileHeader = (
  defaultMessage: string[],
  options?: Config,
) => Promise<string[]> | string[];

export interface File {
  destination: string;
  format?: string | FormatFn;
  filter?: string | Partial<TransformedToken> | Filter['filter'];
  options?: LocalOptions;
}
