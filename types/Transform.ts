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

import type { Filter } from './Filter.ts';
import type { TransformedToken } from './DesignToken.ts';
import type { PlatformConfig, Config } from './Config.ts';
import type { Volume } from './Volume.ts';

interface BaseTransform<Type, Value> {
  name: string;
  type: Type;
  filter?: Filter['filter'];
  transitive?: boolean;
  transform: (
    token: TransformedToken,
    config: PlatformConfig,
    options: Config,
    vol?: Volume,
  ) => Promise<Value> | Value;
}

export type NameTransform = BaseTransform<'name', string>;
export type AttributeTransform = BaseTransform<'attribute', Record<string, unknown>>;
export type ValueTransform = BaseTransform<'value', unknown | undefined>;

export type Transform = NameTransform | AttributeTransform | ValueTransform;
