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
const formats = require('../../lib/common/formats');
const createDictionary = require('../../lib/utils/createDictionary');
const createFormatArgs = require('../../lib/utils/createFormatArgs');

const file = {
  "destination": "__output/",
  "format": "typescript/es6-declarations"
};

const properties = {
  "color": {
    "red": {
      "comment": "Used for errors",
      "name": "colorRed",
      "value": "#FF0000"
    }
  }
};

const formatter = formats['typescript/es6-declarations'].bind(file);

describe('formats', () => {
  describe('typescript/es6-declarations', () => {
    it('should be a valid TS file', () => {
      const dictionary = createDictionary({ properties });
      const output = formatter(createFormatArgs({
        dictionary,
        file,
        platform: {},
      }));

      // get all lines that begin with export
      const lines = output
        .split('\n')
        .filter(l => l.indexOf('export') >= 0);

      // assert that any lines have a string type definition
      lines.forEach(l => {
        expect(l.match(/^export.* : string;$/g).length).toEqual(1);
      });
    });

    it('with outputStringLiterals should match snapshot', () => {
      const customFile = Object.assign({}, file, {
        options: {
          outputStringLiterals: true
        }
      });

      const dictionary = createDictionary({ properties });
      const output = formatter(createFormatArgs({
        dictionary,
        file: customFile,
        platform: {},
      }));

      expect(output).toMatchSnapshot();
    });
  });
});
