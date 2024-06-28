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

import JSON5 from 'json5';
import glob from '@bundled-es-modules/glob';
import path from '@bundled-es-modules/path-browserify';
import { fs } from 'style-dictionary/fs';
import deepExtend from './deepExtend.js';

function traverseObj(obj, fn) {
  for (let key in obj) {
    fn.apply(null, [obj, key, obj[key]]);
    if (obj[key] && typeof obj[key] === 'object') {
      traverseObj(obj[key], fn);
    }
  }
}

/**
 * Takes an array of json files and merges
 * them together. Optionally does a deep extend.
 * @private
 * @param {String[]} arr - Array of paths to json (or node modules that export objects) files
 * @param {Boolean} [deep=false] - If it should perform a deep merge
 * @param {Function} collision - A function to be called when a name collision happens that isn't a normal deep merge of objects
 * @param {Boolean} [source=true] - If json files are "sources", tag tokens
 * @param {Object[]} [parsers=[]] - Custom file parsers
 * @returns {Object}
 */
export default async function combineJSON(arr, deep, collision, source, parsers = []) {
  const to_ret = {};
  let files = [];

  for (let i = 0; i < arr.length; i++) {
    const new_files = glob.sync(arr[i], { fs }).sort();
    files = files.concat(new_files);
  }

  // adjust for browser env glob results have leading slash
  files = files.map((f) => f.replace(/^\//, ''));

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    let file_content = null;
    try {
      // Iterate over custom parsers, if the file path matches the parser's
      // pattern regex, use it's parse function to generate the object
      parsers.forEach(({ pattern, parse }) => {
        if (filePath.match(pattern)) {
          file_content = parse({
            contents: fs.readFileSync(filePath, { encoding: 'UTF-8' }),
            filePath,
          });
        }
      });

      // If there is no file_content then no custom parser ran on that file
      if (!file_content) {
        let parsedFile;
        if (['.js', '.mjs'].includes(path.extname(filePath))) {
          const fileToImport = path.resolve(
            typeof window === 'object' ? '' : process.cwd(),
            filePath,
          );
          parsedFile = (await import(fileToImport)).default;
        } else {
          parsedFile = JSON5.parse(fs.readFileSync(filePath));
        }

        file_content = deepExtend([file_content, parsedFile]);
      }
    } catch (e) {
      e.message = 'Failed to load or parse JSON or JS Object: ' + e.message;
      throw e;
    }

    // Add some side data on each property to make filtering easier
    traverseObj(file_content, (obj) => {
      if (obj.hasOwnProperty('value') && !obj.filePath) {
        obj.filePath = filePath;

        obj.isSource = source || source === undefined ? true : false;
      }
    });

    if (deep) {
      deepExtend([to_ret, file_content], collision);
    } else {
      Object.assign(to_ret, file_content);
    }
  }

  return to_ret;
}
