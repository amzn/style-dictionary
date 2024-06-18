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
import { resolve } from 'style-dictionary';
import isPlainObject from 'is-plain-obj';

export const cleanConsoleOutput = (str) => {
  const arr = str
    .split(`\n`)
    // Remove ANSI stuff from the console output so we get human-readable strings
    // https://github.com/chalk/ansi-regex/blob/main/index.js#L3
    .map((s) =>
      s
        // eslint-disable-next-line no-control-regex
        .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
        .trim(),
    );
  return arr.join(`\n`);
};

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

export const fileToJSON = (_path, _fs = fs) => {
  return JSON.parse(_fs.readFileSync(resolve(_path), 'utf-8'));
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

export function fixDate() {
  const constantDate = new Date('2000-01-01');
  // eslint-disable-next-line no-undef
  const __global = typeof window === 'object' ? window : globalThis;

  // eslint-disable-next-line no-undef
  __global.Date = function () {
    return constantDate;
  };
  // eslint-disable-next-line no-undef
  __global.Date.now = function () {
    return constantDate;
  };
}

export function clearSDMeta(tokens) {
  const copy = structuredClone(tokens);
  function recurse(slice) {
    if (isPlainObject(slice)) {
      if (Object.hasOwn(slice, 'value')) {
        ['path', 'original', 'name', 'attributes', 'filePath', 'isSource'].forEach((prop) => {
          delete slice[prop];
        });
      } else {
        Object.values(slice).forEach((prop) => {
          recurse(prop);
        });
      }
    }
  }
  recurse(copy);
  return copy;
}
