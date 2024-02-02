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
    do: function (dictionary, config, options) {
      const imagesDir = `${config.buildPath}android/main/res/drawable-`;
      /**
       * @param {Token} token
       */
      dictionary.allTokens.forEach((token) => {
        if (token.attributes?.category === 'asset' && token.attributes.type === 'image') {
          const name = token.path.slice(2, 4).join('_');
          const dir = `${imagesDir}${token.attributes.state}`;
          const path = `${dir}/${name}.png`;
          fs.mkdirSync(dir, { recursive: true });
          fs.copyFileSync(options.usesW3C ? token.$value : token.value, path);
        }
      });
    },
    undo: function (dictionary, config) {
      const imagesDir = `${config.buildPath}android/main/res/drawable-`;
      /**
       * @param {Token} token
       */
      dictionary.allTokens.forEach((token) => {
        if (token.attributes?.category === 'asset' && token.attributes.type === 'image') {
          const name = token.path.slice(2, 4).join('_');
          const dir = `${imagesDir}${token.attributes.state}`;
          const path = `${dir}/${name}.png`;
          fs.unlinkSync(path);
        }
      });
    },
  },

  /**
   * Action that copies everything in the assets directory to a new assets directory in the build path of the platform.
   *
   * @memberof Actions
   */
  copy_assets: {
    do: function (dictionary, config) {
      // eslint-disable-next-line no-console
      console.log('Copying assets directory to ' + config.buildPath + 'assets');
      fs.copyFileSync('assets', config.buildPath + 'assets');
    },
    undo: function (dictionary, config) {
      // eslint-disable-next-line no-console
      console.log('Removing assets directory from ' + config.buildPath + 'assets');
      fs.unlinkSync(config.buildPath + 'assets');
    },
  },
};
