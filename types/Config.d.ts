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

import { Keyed } from './_helpers';

import Parser from './Parser';
import Transform from './Transform';
import TransformGroup from './TransformGroup';
import Filter from './Filter';
import FileHeader from './FileHeader';
import Format from './Format';
import Action from './Action';
import Platform from './Platform';
import { DesignTokens } from './DesignToken';

interface Config {
  parsers?: Parser[];
  transform?: Keyed<Transform>;
  transformGroup?: Keyed<TransformGroup>;
  format?: Keyed<Format>;
  filter?: Keyed<Filter>;
  fileHeader?: Keyed<FileHeader>;
  action?: Keyed<Action>;
  include?: string[];
  source?: string[];
  tokens?: DesignTokens;
  properties?: DesignTokens;
  platforms: Keyed<Platform>;
}

export default Config;