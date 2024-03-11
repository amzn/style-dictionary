import type { TransformedToken } from './DesignToken.d.ts';
import type { Formatter } from './Format.d.ts';
import type { LocalOptions } from './Config.d.ts';
import type { Matcher } from './Filter.d.ts';

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
}

export type FileHeader = (defaultMessage: string[]) => Promise<string[]> | string[];

export interface File {
  className?: string;
  packageName?: string;
  destination: string;
  format?: string | Formatter;
  filter?: string | Partial<TransformedToken> | Matcher;
  options?: LocalOptions;
  resourceType?: string;
  resourceMap?: Record<string, string>;
  name?: string;
}
