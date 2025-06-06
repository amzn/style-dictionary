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

/**
 * This type is also used in the `typescript/module-declarations` format
 * Make sure to also change it there when this type changes!
 */
export interface DesignToken {
  value?: any;
  $value?: any;
  type?: string;
  $type?: string;
  $description?: string;
  name?: string;
  comment?: string;
  themeable?: boolean;
  attributes?: Record<string, unknown>;
  /**
   * When flattening tokens, DesignToken is given a key that matches the original ancestor tree e.g. `{colors.red.500}`
   */
  key?: string;
  [key: string]: any;
}

export interface DesignTokens {
  $type?: string;
  [key: string]: DesignTokens | DesignToken | string | undefined;
}

// Same as DesignTokens but without the $type group property
// after preprocessing the type is delegated to tokens level
export interface PreprocessedTokens {
  [key: string]: PreprocessedTokens | DesignToken;
}

export interface TransformedToken extends DesignToken {
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
   * If the token is from a file defined in the source array as opposed to include in the [configuration](https://styledictionary.com/reference/config).
   */
  isSource: boolean;
}

export interface TransformedTokens {
  [key: string]: TransformedTokens | TransformedToken;
}

export interface Dictionary {
  tokens: TransformedTokens;
  allTokens: TransformedToken[];
  tokenMap: Map<string, TransformedToken>;
  unfilteredTokens?: TransformedTokens;
  unfilteredAllTokens?: TransformedToken[];
  unfilteredTokenMap?: Map<string, TransformedToken>;
}
