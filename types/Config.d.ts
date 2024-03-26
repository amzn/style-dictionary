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

import type { DesignTokens, TransformedToken } from './DesignToken.d.ts';
import type { Filter, Matcher } from './Filter.d.ts';
import type { FileHeader, File } from './File.d.ts';
import type { Parser } from './Parser.d.ts';
import type { Preprocessor } from './Preprocessor.d.ts';
import type { Transform } from './Transform.d.ts';
import type { Formatter } from './Format.d.ts';
import type { Action } from './Action.d.ts';

export interface LocalOptions {
  showFileHeader?: boolean;
  fileHeader?: string | FileHeader;
  outputReferences?: boolean;
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
  unfilteredTokens?: DesignTokens;
}

export interface ResolveReferencesOptions extends RegexOptions {
  ignorePaths?: string[];
  usesDtcg?: boolean;
}

export interface ResolveReferencesOptionsInternal extends ResolveReferencesOptions {
  current_context?: string[];
  stack?: string[];
  foundCirc?: Record<string, boolean>;
  firstIteration?: boolean;
  throwImmediately?: boolean;
}

export interface LogConfig {
  warnings?: 'warn' | 'error' | 'disabled';
  verbosity?: 'default' | 'silent' | 'verbose';
}

export interface PlatformConfig extends RegexOptions {
  log?: LogConfig;
  transformGroup?: string;
  transforms?: string[] | Omit<Transform, 'name'>[];
  basePxFontSize?: number;
  prefix?: string;
  buildPath?: string;
  files?: File[];
  actions?: string[] | Omit<Action, 'name'>[];
  options?: LocalOptions;
}

export interface Config {
  log?: LogConfig;
  source?: string[];
  include?: string[];
  tokens?: DesignTokens;
  platforms?: Record<string, PlatformConfig>;
  parsers?: Parser[];
  preprocessors?: Record<string, Preprocessor>;
  transform?: Record<string, Transform>;
  transformGroup?: Record<string, string[]>;
  format?: Record<string, Formatter>;
  filter?: Record<string, Filter['matcher']>;
  fileHeader?: Record<string, FileHeader>;
  action?: Record<string, Action>;
  usesDtcg?: boolean;
}
