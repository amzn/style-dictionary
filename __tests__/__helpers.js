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

export const expectThrowsAsync = async (method, errorMessage) => {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an('Error');
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
};

export const fileToJSON = (path, _fs = fs) => {
  return JSON.parse(_fs.readFileSync(path, 'utf-8'));
};

export const clearOutput = (outputFolder = '__tests__/__output', _fs = fs) => {
  try {
    _fs.rmdirSync(outputFolder);
  } catch (e) {
    //
  }
};

export const fileExists = (filePath, _fs = fs) => {
  try {
    return _fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

export const dirExists = (dirPath, _fs = fs) => {
  return _fs.existsSync(dirPath);
};
