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
import childProcess from 'child_process';
import fs from 'node:fs';
import { clearOutput, fileExists } from '../__tests__/__helpers.js';

describe('cliBuildWithJsConfig', () => {
  beforeEach(() => {
    clearOutput(undefined, fs);
    childProcess.execSync('node ./bin/style-dictionary build --config __tests__/__configs/test.js');
  });

  afterEach(() => {
    clearOutput();
  });

  it('should work with json config', () => {
    expect(fileExists('__tests__/__output/web/_icons.css', fs)).to.be.true;
    expect(fileExists('__tests__/__output/android/colors.xml', fs)).to.be.true;
  });

  it('should work with javascript config', () => {
    expect(fileExists('__tests__/__output/web/_icons.css', fs)).to.be.true;
    expect(fileExists('__tests__/__output/android/colors.xml', fs)).to.be.true;
  });
});
