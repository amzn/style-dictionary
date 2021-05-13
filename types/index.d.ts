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

// Minimum TypeScript Version: 3.0

import _DesignToken, {DesignTokens as _DesignTokens} from './DesignToken';
import _File from './File';
import _Options from './Options';
import _FileHeader from './FileHeader';
import _TransformedToken, {TransformedTokens as _TransformedTokens} from './TransformedToken';
import _Platform from './Platform';
import _Transform from './Transform';
import _Filter from './Filter';
import _Format from './Format';
import _Dictionary from './Dictionary';
import _TransformGroup from './TransformGroup';
import _Action from './Action';
import _Parser from './Parser';
import _Config from './Config';
import FormatHelpers from './FormatHelpers';

import { Named, Keyed } from './_helpers';

declare namespace StyleDictionary {

  type DesignToken = _DesignToken;
  type DesignTokens = _DesignTokens;
  type File = _File;
  type Options = _Options;
  type FileHeader = _FileHeader;
  type TransformedToken = _TransformedToken;
  type TransformedTokens = _TransformedTokens;
  type Platform = _Platform;
  type Transform = _Transform;
  type Filter = _Filter;
  type Format = _Format;
  type Dictionary = _Dictionary;
  type TransformGroup = _TransformGroup;
  type Action = _Action;
  type Parser = _Parser;
  type Config = _Config;

  // aliased for backwards compatibility
  type Property = DesignToken;
  type Properties = DesignTokens;
  type Prop = TransformedToken;

  interface Core {
    VERSION: string;
    tokens: DesignTokens | TransformedTokens;
    allTokens: TransformedTokens[];
    properties: Properties;
    allProperties: Prop[];
    options: Config;

    transform: Keyed<Transform>;
    transformGroup: Keyed<TransformGroup>;
    format: Keyed<Format>;
    action: Keyed<Action>;
    filter: Keyed<Filter>;
    fileHeader: Keyed<FileHeader>;
    parsers: Parser[];

    formatHelpers: FormatHelpers;

    registerTransform(this: Core, transform: Named<Transform>): this;
    registerTransformGroup(this: Core, transformGroup: Named<TransformGroup>): this;
    registerFormat(this: Core, format: Named<Format>): this;
    registerTemplate(this: Core, template: Named<{ template: string }>): this;
    registerAction(this: Core, action: Named<Action>): this;
    registerFilter(this: Core, filter: Named<Filter>): this;
    registerParser(this: Core, parser: Parser): this;

    exportPlatform(this: Core, platform: string): TransformedTokens;
    buildPlatform(this: Core, platform: string): this;
    buildAllPlatforms(this: Core): this;

    cleanPlatform(this: Core, platform: string): this;
    cleanAllPlatforms(this: Core): this;

    extend(this: Core, options: string | Config): this;
  }
}

declare var StyleDictionary: StyleDictionary.Core;
export = StyleDictionary;
export as namespace StyleDictionary;
