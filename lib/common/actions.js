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

var _ = require('lodash');

var fs = require('fs-extra');
var chalk = require('chalk');

/**
 * @namespace Actions
 */
module.exports = {
  /**
   * Action to copy images into appropriate android directories.
   *
   * @type {Action}
   * @memberof Actions
   */
  'android/copyImages': {
    do({ allProperties }, { buildPath }) {
      var imagesDir = `${buildPath}android/main/res/drawable-`;
      _.each(allProperties, ({ attributes, path, value }) => {
        if (attributes.category === 'asset' && attributes.type === 'image') {
          var name = path.slice(2, 4).join('_');
          fs.copySync(value, `${imagesDir + attributes.state}/${name}.png`);
        }
      });
    },
    undo({ allProperties }, { buildPath }) {
      var imagesDir = `${buildPath}android/main/res/drawable-`;
      _.each(allProperties, ({ attributes, path }) => {
        if (attributes.category === 'asset' && attributes.type === 'image') {
          var name = path.slice(2, 4).join('_');
          fs.removeSync(`${imagesDir + attributes.state}/${name}.png`);
        }
      });
    },
  },

  /**
   * Action that copies everything in the assets directory to a new assets directory in the build path of the platform.
   *
   * @type {Action}
   * @memberof Actions
   */
  copy_assets: {
    do(dictionary, { buildPath }) {
      console.log(`Copying assets directory to ${buildPath}assets`);
      fs.copySync('assets', `${buildPath}assets`);
    },
    undo(dictionary, { buildPath }) {
      console.log(`Removing assets directory from ${buildPath}assets`);
      fs.removeSync(`${buildPath}assets`);
    },
  },
};
