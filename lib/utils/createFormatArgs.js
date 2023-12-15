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
 * @typedef {import('../../types/Config.d.ts').Obj} Obj
 * @typedef {import('../../types/File.d.ts').File} File
 *

/**
 *
 * @param {{
 *   dictionary: Dictionary;
 *   platform: PlatformConfig;
 *   file: File;
 * }} param0
 * @returns
 */
export default function createFormatArgs({ dictionary, platform, file }) {
  const { allTokens, tokens } = dictionary;
  // This will merge platform and file-level configuration
  // where the file configuration takes precedence
  const { options } = platform;

  // For some reason typescript doesn't allow us to cast File to Obj and vice versa...
  const _file = /** @type {Obj} */ (/** @type {unknown} */ (file));
  const extended = /** @type {File} */ (
    /** @type {unknown} */ (deepExtend([{}, { options }, _file]))
  );
  file = extended;

  return {
    dictionary,
    allTokens,
    tokens,
    platform,
    file,
    options: file.options || {},
  };
}
