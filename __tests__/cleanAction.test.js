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
import { expect } from 'chai';
import { fs } from 'style-dictionary/fs';
import StyleDictionary from 'style-dictionary';
import { fileExists, clearOutput } from './__helpers.js';

const StyleDictionaryExtended = new StyleDictionary({
  platforms: {
    android: {
      actions: ['cleanAction.test.js'],
    },
  },
});

StyleDictionaryExtended.registerAction({
  name: 'cleanAction.test.js',
  do: function () {
    fs.mkdirSync('__tests__/__output', { recursive: true });
    fs.writeFileSync('__tests__/__output/action.txt', 'hi');
  },
  undo: function () {
    fs.unlinkSync('__tests__/__output/action.txt');
  },
});

describe('cleanAction', () => {
  describe('clean actions', () => {
    beforeEach(() => {
      clearOutput();
    });

    afterEach(() => {
      clearOutput();
    });

    it('should delete a file properly', async () => {
      await StyleDictionaryExtended.buildPlatform('android');
      await StyleDictionaryExtended.cleanPlatform('android');
      expect(fileExists('__tests__/__output/action.txt')).to.be.false;
    });
  });
});
