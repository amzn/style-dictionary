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

import { Dictionary } from "./Dictionary";
import { DesignToken } from "./DesignToken";
import { TransformedToken } from "./TransformedToken";
import { File } from "./File";

export interface LineFormatting {
  prefix?: string;
  commentStyle?: "short" | "long" | "none";
  commentPosition?: "inline" | "above";
  indentation?: string;
  separator?: string;
  suffix?: string;
}

export type TokenFormatterArgs = {
  outputReferences?: boolean;
  dictionary: Dictionary;
  format?: "css" | "sass" | "less" | "stylus";
  formatting?: LineFormatting;
};

export interface CommentFormatting {
  prefix: string;
  lineSeparator: string;
  header: string;
  footer: string;
}

export interface FileHeaderArgs {
  file: File;
  commentStyle?: string;
  formatting?: CommentFormatting;
}

export interface FormattedVariablesArgs {
  format: "css" | "sass";
  dictionary: Dictionary;
  outputReferences?: boolean;
  formatting?: LineFormatting;
}

export interface FormatHelpers {
  createPropertyFormatter: (
    args: TokenFormatterArgs,
  ) => (token: TransformedToken) => string;
  fileHeader: (args: FileHeaderArgs) => string;
  formattedVariables: (args: FormattedVariablesArgs) => string;
  minifyDictionary: (dictionary: object) => object;
  getTypeScriptType: (value: unknown) => string;
  iconsWithPrefix: (
    prefix: string,
    allTokens: DesignToken[],
    options: object,
  ) => string;
  sortByReference: (
    dictionary: Dictionary,
  ) => (a: TransformedToken, b: TransformedToken) => number;
  sortByName: (a: DesignToken, b: DesignToken) => number;
  setSwiftFileProperties: (
    options: object,
    objectType: string,
    transformGroup: string,
  ) => string;
}
