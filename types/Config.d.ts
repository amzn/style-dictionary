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

// TODO: import directly from source files typedefs once they are sufficiently typed.
import type { Parser } from '../types-copy/Parser.d.ts';
import type { Preprocessor } from '../types-copy/Preprocessor.d.ts';
import type { Transform } from '../types-copy/Transform.d.ts';
import type { TransformGroup } from '../types-copy/TransformGroup.d.ts';
import type { Formatter } from '../types-copy/Format.d.ts';
import type { Action } from '../types-copy/Action.d.ts';
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

export interface ResolveReferenceOptions extends RegexOptions {
  ignorePaths?: string[];
}

export interface ResolveReferenceOptionsInternal extends ResolveReferenceOptions {
  current_context?: string[];
  stack?: string[];
  foundCirc?: Object<string, boolean>;
  firstIteration?: boolean;
}

export interface PlatformConfig {
  transformGroup?: string;
  transforms?: string[];
  basePxFontSize?: number;
  prefix?: string;
  buildPath?: string;
  files?: File[];
  actions?: string[];
  options?: LocalOptions;
}

export interface Config {
  source?: string[];
  include?: string[];
  tokens?: DesignTokens;
  platforms: Record<string, PlatformConfig>;
  parsers?: Parser[];
  preprocessors?: Record<string, Preprocessor>;
  transform?: Record<string, Transform>;
  transformGroup?: Record<string, TransformGroup['transforms']>;
  format?: Record<string, Formatter>;
  filter?: Record<string, Filter['matcher']>;
  fileHeader?: Record<string, FileHeader>;
  action?: Record<string, Action>;
}
