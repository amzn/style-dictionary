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

import { DesignToken } from './DesignToken';

export type TransformedToken = DesignToken & {
  name: string;
  /** The object path of the property.
   *
   * `color: { background: { primary: { value: "#fff" } } }` will have a path of `['color', 'background', 'primary']`.
   */
  path: string[];
  /**
   * A pristine copy of the original property object.
   *
   * This is to make sure transforms and formats always have the unmodified version of  the original property.
   */
  original: DesignToken;
  /**
   * The file path of the file the token is defined in.
   *
   * This file path is derived from the source or include file path arrays defined in the configuration.
   */
  filePath: string;
  /**
   * If the token is from a file defined in the source array as opposed to include in the [configuration](https://amzn.github.io/style-dictionary/#/config).
   */
  isSource: boolean;
}

export interface TransformedTokens {
  [key: string]: TransformedTokens | TransformedToken;
}