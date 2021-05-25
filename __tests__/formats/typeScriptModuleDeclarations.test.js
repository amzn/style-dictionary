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
  "format": "typescript/module-declarations",
  "filter": {
    "attributes": {
      "category": "color"
    }
  }
};

const properties = {
  "color": {
    "red": {"value": "#FF0000"}
  }
};


var formatter = formats['typescript/module-declarations'].bind(file);

describe('formats', () => {
  describe('typescript/module-declarations', () => {
    it('should be a valid TS file', () => {
      const dictionary = createDictionary({ properties });
      const output = formatter(createFormatArgs({
        dictionary,
        file,
        platform: {},
      }), {}, file);

      // get all lines that have DesignToken
      const lines = output
        .split('\n')
        .filter(l => l.indexOf(': DesignToken') >= 0);

      // assert that any lines have a DesignToken type definition
      lines.forEach(l => {
        expect(l.match(/^.*: DesignToken$/g).length).toEqual(1);
      });
    });
  });
});
