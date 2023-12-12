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

import type { Parser } from './Parser.d.ts';
import type { Preprocessor } from './Preprocessor.d.ts';
import type { Transform } from './Transform.d.ts';
import type { TransformGroup } from './TransformGroup.d.ts';
import type { Filter } from './Filter.d.ts';
import type { FileHeader } from './FileHeader.d.ts';
import type { Formatter } from './Format.d.ts';
import type { Action } from './Action.d.ts';
import type { Platform } from './Platform.d.ts';
import type { DesignTokens } from './DesignToken.d.ts';

export interface Config {
  parsers?: Parser[];
  preprocessors?: Record<string, Preprocessor>;
  transform?: Record<string, Transform>;
  transformGroup?: Record<string, TransformGroup['transforms']>;
  format?: Record<string, Formatter>;
  filter?: Record<string, Filter['matcher']>;
  fileHeader?: Record<string, FileHeader>;
  action?: Record<string, Action>;
  include?: string[];
  source?: string[];
  tokens?: DesignTokens;
  platforms: Record<string, Platform>;
}
