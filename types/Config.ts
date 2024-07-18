/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import type { DesignToken, DesignTokens, PreprocessedTokens } from './DesignToken.ts';
import type { Filter } from './Filter.ts';
import type { FileHeader, File, FormattingOptions } from './File.ts';
import type { Parser } from './Parser.ts';
import type { Preprocessor } from './Preprocessor.ts';
import type { Transform } from './Transform.ts';
import type { Format, OutputReferences } from './Format.ts';
import type { Action } from './Action.ts';

export interface Hooks {
  parsers?: Record<string, Omit<Parser, 'name'>>;
  preprocessors?: Record<string, Preprocessor['preprocessor']>;
  transformGroups?: Record<string, string[]>;
  transforms?: Record<string, Omit<Transform, 'name'>>;
  formats?: Record<string, Format['format']>;
  fileHeaders?: Record<string, FileHeader>;
  filters?: Record<string, Filter['filter']>;
  actions?: Record<string, Omit<Action, 'name'>>;
}

export interface LocalOptions {
  showFileHeader?: boolean;
  fileHeader?: string | FileHeader;
  outputReferences?: OutputReferences;
  outputReferenceFallbacks?: boolean;
  formatting?: FormattingOptions;
  [key: string]: any;
}

export interface RegexOptions {
  regex?: RegExp;
  opening_character?: string;
  closing_character?: string;
  separator?: string;
}

export interface GetReferencesOptions extends RegexOptions {
  usesDtcg?: boolean;
  unfilteredTokens?: PreprocessedTokens;
  warnImmediately?: boolean;
}

export interface ResolveReferencesOptions extends RegexOptions {
  usesDtcg?: boolean;
  warnImmediately?: boolean;
}

export interface ResolveReferencesOptionsInternal extends ResolveReferencesOptions {
  ignorePaths?: string[];
  current_context?: string[];
  stack?: string[];
  foundCirc?: Record<string, boolean>;
  firstIteration?: boolean;
}

export interface LogConfig {
  warnings?: 'warn' | 'error' | 'disabled';
  verbosity?: 'default' | 'silent' | 'verbose';
  errors?: {
    brokenReferences?: 'throw' | 'console';
  };
}

export type ExpandFilter = (
  token: DesignToken,
  options: Config,
  platform?: PlatformConfig,
) => boolean;

export interface Expand {
  typesMap?: Record<string, Record<string, string> | string>;
  include?: string[] | ExpandFilter;
  exclude?: string[] | ExpandFilter;
}

export type ExpandConfig = Expand | boolean | ExpandFilter;

export interface PlatformConfig extends RegexOptions {
  log?: LogConfig;
  transformGroup?: string;
  transforms?: string[] | Omit<Transform, 'name'>[];
  expand?: ExpandConfig;
  prefix?: string;
  buildPath?: string;
  files?: File[];
  actions?: string[] | Omit<Action, 'name'>[];
  options?: LocalOptions;
  // Allows adding custom options on the platform level which is how you can pass external options to transforms
  [key: string]: any;
}

export interface Config {
  log?: LogConfig;
  source?: string[];
  include?: string[];
  tokens?: DesignTokens;
  hooks?: Hooks;
  expand?: ExpandConfig;
  platforms?: Record<string, PlatformConfig>;
  parsers?: string[];
  preprocessors?: string[];
  usesDtcg?: boolean;
}
