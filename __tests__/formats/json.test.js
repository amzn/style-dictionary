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
const fs = require('fs-extra');
const helpers = require('../__helpers');
const createDictionary = require('../../lib/utils/createDictionary');
const createFormatArgs = require('../../lib/utils/createFormatArgs');

const file = {
  "destination": "__output/",
  "format": "json"
};

const properties = {
  "color": {
    "red": {"value": "#FF0000"}
  }
};

const formatter = formats['json'].bind(file);
const dictionary = createDictionary({ properties });

describe('formats', () => {
  describe('json', () => {

    beforeEach(() => {
      helpers.clearOutput();
    });

    afterEach(() => {
      helpers.clearOutput();
    });

    it('should be a valid JSON file', () => {
      fs.writeFileSync('./__tests__/__output/output.json', formatter(createFormatArgs({
        dictionary,
        file,
        platform: {}
      }), {}, file) );
      const test = require('../__output/output.json');
      expect(test.color.red.value).toEqual(dictionary.properties.color.red.value);
    });
  });

});
