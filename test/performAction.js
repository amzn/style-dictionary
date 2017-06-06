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

var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    fs              = require('fs-extra'),
    StyleDictionary = require('../index');

StyleDictionary.registerAction({
  name: 'test',
  do: function() {
    fs.writeFileSync('./test/output/action.txt', 'hi')
  },
  undo: function() {
    fs.removeSync('./test/output/action.txt')
  }
});

var test = StyleDictionary.extend({
  "platforms": {
    "android": {
      "actions": ["test"]
    }
  }
});

describe('buildPlatform', function() {
  describe('handle actions', function() {
    beforeEach(function() {
      helpers.clearOutput();
    });

    it('should write to a file properly', function() {
      test.buildPlatform('android');
      assert(helpers.fileExists('./test/output/action.txt'));
    });
  });
});
