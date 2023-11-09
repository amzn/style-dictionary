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
import StyleDictionary from 'style-dictionary';
import { clearOutput, fileExists } from './__helpers.js';

describe('buildAllPlatforms', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should work with json config', async () => {
    const StyleDictionaryExtended = new StyleDictionary('__tests__/__configs/test.json');
    await StyleDictionaryExtended.buildAllPlatforms();
    expect(fileExists('__tests__/__output/web/_icons.css')).to.be.true;
    expect(fileExists('__tests__/__output/android/colors.xml')).to.be.true;
  });

  it('should work with js config', async () => {
    const StyleDictionaryExtended = new StyleDictionary('__tests__/__configs/test.js');
    await StyleDictionaryExtended.buildAllPlatforms();
    expect(fileExists('__tests__/__output/web/_icons.css')).to.be.true;
    expect(fileExists('__tests__/__output/android/colors.xml')).to.be.true;
  });
});
