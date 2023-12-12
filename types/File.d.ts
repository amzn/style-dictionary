export interface FormattingOptions {
  lineSeparator?: string;
  prefix?: string;
  header?: string;
  footer?: string;
}

export type FileHeader = (defaultMessage: string[]) => string[];

export interface File {
  className?: string;
  packageName?: string;
  destination: string;
  format?: string;
  filter?: string | Partial<TransformedToken> | Matcher;
  options?: LocalOptions;
}
