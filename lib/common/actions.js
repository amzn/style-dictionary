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

import { fs } from 'style-dictionary/fs';

/**
 * @typedef {import('../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../types/Action.d.ts').Action} Action
 * @typedef {import('../../types/Config.js').PlatformConfig} Config
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} Token
 */

/**
 * @namespace Actions
 * @type {Record<string, Omit<Action, 'name'>>}
 */
export default {
  /**
   * Action to copy images into appropriate android directories.
   *
   * @memberof Actions
   */
  'android/copyImages': {
    do: async function (dictionary, config, options, vol = fs) {
      const imagesDir = `${config.buildPath}android/main/res/drawable-`;
      /**
       * @param {Token} token
       */
      await Promise.all(
        dictionary.allTokens.map((token) => {
          if (token.type === 'asset') {
            const name = token.path.slice(2, 4).join('_');
            const dir = `${imagesDir}${token.attributes?.state}`;
            const path = `${dir}/${name}.png`;
            return vol.promises.mkdir(dir, { recursive: true }).then(() => {
              return vol.promises.copyFile(options.usesDtcg ? token.$value : token.value, path);
            });
          }
        }),
      );
    },
    undo: async function (dictionary, config, options, vol = fs) {
      const imagesDir = `${config.buildPath}android/main/res/drawable-`;
      /**
       * @param {Token} token
       */
      await Promise.all(
        dictionary.allTokens.map((token) => {
          if (token.type === 'asset') {
            const name = token.path.slice(2, 4).join('_');
            const dir = `${imagesDir}${token.attributes?.state}`;
            const path = `${dir}/${name}.png`;
            return vol.promises.unlink(path);
          }
        }),
      );
    },
  },

  /**
   * Action that copies everything in the assets directory to a new assets directory in the build path of the platform.
   *
   * @memberof Actions
   */
  copy_assets: {
    do: async function (_, config, options, vol = fs) {
      if (config.log?.verbosity !== 'silent') {
        // eslint-disable-next-line no-console
        console.log('Copying assets directory to ' + config.buildPath + 'assets');
      }
      return vol.promises.cp(
        'assets',
        config.buildPath + 'assets',
        // @ts-expect-error ICpOptions requires other props, this is a mistake in memfs types definition
        {
          recursive: true,
        },
      );
    },
    undo: async function (_, config, options, vol = fs) {
      if (config.log?.verbosity !== 'silent') {
        // eslint-disable-next-line no-console
        console.log('Removing assets directory from ' + config.buildPath + 'assets');
      }
      return vol.promises.rmdir(config.buildPath + 'assets', { recursive: true });
    },
  },
};
