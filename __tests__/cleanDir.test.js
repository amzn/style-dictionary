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
import { clearOutput, dirExists } from './__helpers.js';
import StyleDictionary from '../lib/StyleDictionary.js';
import cleanFile from '../lib/cleanFile.js';
import cleanDir from '../lib/cleanDir.js';

function format() {
  return 'hi';
}

describe('cleanDir', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should delete a dir properly', async () => {
    const file = { destination: 'test.txt', format: 'foo' };
    const buildPath = '__tests__/__output/extradir1/extradir2/';
    const sd = new StyleDictionary({
      hooks: {
        formats: {
          foo: () => 'foo',
        },
      },
      platforms: {
        foo: {
          buildPath,
          files: [file],
        },
      },
    });
    await sd.buildPlatform('foo');
    await cleanFile(file, { buildPath });
    await cleanDir(file, { buildPath });
    expect(dirExists(buildPath)).to.be.false;
    expect(dirExists('__tests__/__output/extradir1')).to.be.false;
  });
});
