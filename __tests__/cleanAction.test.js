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
const helpers = require('./__helpers');
const StyleDictionary = require('../index');

const StyleDictionaryExtended = StyleDictionary.extend({
  platforms: {
    android: {
      actions: ['test'],
    },
  },
});

StyleDictionaryExtended.registerAction({
  name: 'test',
  do: () => fs.writeFileSync('./__tests__/__output/action.txt', 'hi'),
  undo: () => fs.removeSync('./__tests__/__output/action.txt'),
});

describe('cleanAction', () => {
  describe('clean actions', () => {
    beforeEach(() => {
      helpers.clearOutput();
    });

    afterEach(() => {
      helpers.clearOutput();
    });

    it('should delete a file properly', () => {
      StyleDictionaryExtended.buildPlatform('android');
      StyleDictionaryExtended.cleanPlatform('android');
      expect(helpers.fileDoesNotExist('./__tests__/__output/action.txt')).toBeTruthy();
    });
  });
});
