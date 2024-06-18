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

import type { Dictionary } from './DesignToken.d.ts';
import type { PlatformConfig, Config } from './Config.d.ts';
import type { Volume } from './Volume.d.ts';

export interface Action {
  name: string;
  /** The action in the form of a function. */
  do(
    dictionary: Dictionary,
    config: PlatformConfig,
    options: Config,
    vol: Volume,
  ): void | Promise<void>;

  /** A function that undoes the action. */
  undo?(
    dictionary: Dictionary,
    config: PlatformConfig,
    options: Config,
    vol: Volume,
  ): void | Promise<void>;
}
