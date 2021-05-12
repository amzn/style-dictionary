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

const fs = require('fs-extra');

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
    do: function(dictionary, config) {
      var imagesDir = config.buildPath + 'android/main/res/drawable-';
      dictionary.allTokens.forEach(function(token) {
        if (token.attributes.category === 'asset' && token.attributes.type === 'image') {
          var name = token.path.slice(2,4).join('_');
          fs.copySync(token.value, imagesDir + token.attributes.state + '/' + name + '.png');
        }
      });
    },
    undo: function(dictionary, config) {
      var imagesDir = config.buildPath + 'android/main/res/drawable-';
      dictionary.allTokens.forEach(function(token) {
        if (token.attributes.category === 'asset' && token.attributes.type === 'image') {
          var name = token.path.slice(2,4).join('_');
          fs.removeSync(imagesDir + token.attributes.state + '/' + name + '.png');
        }
      });
    }
  },

  /**
   * Action that copies everything in the assets directory to a new assets directory in the build path of the platform.
   *
   * @type {Action}
   * @memberof Actions
   */
  'copy_assets': {
    do: function(dictionary, config) {
      console.log('Copying assets directory to ' + config.buildPath + 'assets');
      fs.copySync('assets', config.buildPath + 'assets');
    },
    undo: function(dictionary, config) {
      console.log('Removing assets directory from ' + config.buildPath + 'assets');
      fs.removeSync( config.buildPath + 'assets');
    }
  }
};
