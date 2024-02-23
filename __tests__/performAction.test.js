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
import { clearOutput, fileExists } from './__helpers.js';

describe('performAction', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  describe('handle actions', () => {
    it('should write to a file properly', async () => {
      const sd = new StyleDictionary({
        platforms: {
          android: {
            actions: ['test'],
          },
        },
      });
      await sd.hasInitialized;

      sd.registerAction({
        name: 'test',
        do: function () {
          fs.mkdirSync('__tests__/__output', { recursive: true });
          fs.writeFileSync('__tests__/__output/action.txt', 'hi', 'utf-8');
        },
        undo: function () {
          fs.unlinkSync('__tests__/__output/action.txt');
        },
      });
      await sd.buildPlatform('android');

      expect(fileExists('__tests__/__output/action.txt')).to.be.true;
    });

    it('should handle async actions to write to a file', async () => {
      const sd = new StyleDictionary({
        platforms: {
          android: {
            actions: ['test-async'],
          },
        },
      });
      await sd.hasInitialized;

      sd.registerAction({
        name: 'test-async',
        do: async function () {
          fs.promises.mkdir('__tests__/__output', { recursive: true });
          fs.promises.writeFile('__tests__/__output/action.txt', 'hi', 'utf-8');
        },
        undo: async function () {
          fs.promises.unlink('__tests__/__output/action.txt');
        },
      });
      await sd.buildPlatform('android');

      expect(fileExists('__tests__/__output/action.txt')).to.be.true;
    });
  });
});
