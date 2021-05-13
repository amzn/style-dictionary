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

import Dictionary from './Dictionary';
import TransformedToken from './TransformedToken';
import File from './File';

interface LineFormatting {
  prefix?: string;
  commentStyle?: "short" | "long" | "none";
  indentation?: string;
  separator?: string;
  suffix?: string;
}

type TokenFormatterArguments = {
  outputReferences?: boolean;
  dictionary: Dictionary;
  format?: "css" | "sass" | "less" | "stylus";
  formatting?: LineFormatting;
}

interface CommentFormatting {
  prefix: string;
  lineSeparator: string;
  header: string;
  footer: string;
}

interface FileHeaderParameters {
  file: File;
  commentStyle: string;
  formatting?: CommentFormatting;
}

interface FormattedVariablesOptions {
  format: "css" | "sass";
  dictionary: Dictionary
  outputReferences?: boolean;
  formatting?: LineFormatting;
}

interface FormatHelpers {
  createPropertyFormatter: (options: TokenFormatterArguments) =>
    (token: TransformedToken) => string;
  fileHeader: (options: FileHeaderParameters) => string;
  formattedVariables: (options: FormattedVariablesOptions) => string;
}

export default FormatHelpers;