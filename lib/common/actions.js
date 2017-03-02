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

var _  = require('lodash'),
    fs = require('fs-extra');

module.exports = {
  'android/copyImages': function(dictionary, config) {
    var imagesDir = config.buildPath + 'android/main/res/drawable-';
    _.each(dictionary.allProperties, function(prop) {
      if (prop.attributes.category === 'asset' && prop.attributes.type === 'image') {
        var name = prop.path.slice(2,4).join('_');
        fs.copySync(prop.value, imagesDir + prop.attributes.state + '/' + name + '.png');
      }
    });
  },

  'copy_assets': function(dictionary, config) {
    console.log('Copying assets directory');
    fs.copySync('assets', config.buildPath + 'assets');
  }
};
