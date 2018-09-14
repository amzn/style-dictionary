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

var helpers = require('./helpers');
var fs = require('fs-extra');
var StyleDictionary = require('../index').extend({
  "platforms": {
    "android": {
      "actions": ["test"]
    }
  }
});

StyleDictionary.registerAction({
  name: 'test',
  do: function() {
    fs.writeFileSync('./__tests__/output/action.txt', 'hi')
  },
  undo: function() {
    fs.removeSync('./__tests__/output/action.txt')
  }
});

describe('buildPlatform', () => {
  describe('handle actions', () => {
    beforeEach(() => {
      helpers.clearOutput();
    });

    it('should write to a file properly', () => {
      StyleDictionary.buildPlatform('android');
      expect(helpers.fileExists('./__tests__/output/action.txt')).toBeTruthy();
    });
  });
});
