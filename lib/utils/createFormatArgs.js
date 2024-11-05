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

import deepExtend from './deepExtend.js';

/**
 * @typedef {import('../../types/DesignToken.js').Dictionary} Dictionary
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Config.d.ts').Config} Options
 * @typedef {import('../../types/File.d.ts').File} File
 * @typedef {import('../../types/Format.d.ts').FormatFnArguments} FormatFnArguments
 *

/**
 * @param {FormatFnArguments} param0
 */
export default function createFormatArgs({ dictionary, platform, options, file }) {
  const { allTokens, tokens } = dictionary;
  // This will merge platform and file-level configuration
  // where the file configuration takes precedence
  const { options: fileOpts } = platform;
  const fileOptsTakenFromPlatform = /** @type {Partial<File>} */ ({ options: fileOpts });

  // we have to do some typecasting here. We assume that because deepExtends merges objects together, and "file"
  // always has the destination prop, then result will be File rather than Partial<File>, so we just typecast it.
  file = /** @type {File} */ (deepExtend([{}, fileOptsTakenFromPlatform, file]));

  return /** @type {FormatFnArguments & Dictionary} */ ({
    dictionary,
    allTokens,
    tokens,
    platform,
    file,
    options: {
      ...options,
      ...(file.options || {}),
      usesDtcg: options?.usesDtcg ?? false,
    },
  });
}
