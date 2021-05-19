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

import { Matcher } from './Matcher';
import { TransformedToken } from './TransformedToken';
import { Platform } from './Platform';

export interface NameTransform {
  type: "name";
  matcher?: Matcher;
  transformer: (
    token: TransformedToken,
    options?: Platform
  ) => string;
}

export interface ValueTransform {
  type: "value";
  transitive?: boolean;
  matcher?: Matcher;
  transformer: (
    token: TransformedToken,
    options?: Platform
  ) => any;
}

export interface AttributeTransform {
  type: "attribute";
  matcher?: Matcher;
  transformer: (
    token: TransformedToken,
    options?: Platform
  ) => { [key: string]: any };
}

export type Transform = NameTransform | ValueTransform | AttributeTransform;