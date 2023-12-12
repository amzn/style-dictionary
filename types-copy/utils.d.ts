import type { DesignTokens, DesignToken } from './DesignToken.d.ts';
import type StyleDictionary from './index.d.ts';

interface ResolveOptions {
  regex: string;
  ignorePaths: string[];
  current_context: string[];
  separator: string;
  opening_character: string;
  closing_character: string;
  // for internal usage
  stack: string[];
  foundCirc: Record<string, boolean>;
  firstIterationue: boolean;
}

// Public style-dictionary/utils API
export type usesReferences = (value: string, regexOrOptions?: Object | RegExp) => boolean;
export type getReferences = (
  value: string,
  dictionary: StyleDictionary.Core,
  opts?: ResolveOptions,
  references?: DesignToken[],
) => DesignToken[];
export type resolveReferences = (
  value: string,
  tokens: DesignTokens,
  opts?: ResolveOptions,
) => string;
