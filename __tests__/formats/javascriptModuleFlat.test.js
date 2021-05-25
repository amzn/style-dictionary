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

const fs = require('fs-extra');
const helpers = require('../__helpers');
const formats = require('../../lib/common/formats');
const createDictionary = require('../../lib/utils/createDictionary');
const createFormatArgs = require('../../lib/utils/createFormatArgs');

const file = {
  "destination": "__output/",
  "format": "javascript/module-flat",
};
const properties = {
  color: {
    red: {
      value: "#EF5350",
      name: "ColorRed",
      original: {
        value: "#EF5350"
      },
      attributes: {
        category: "color",
        type: "red"
      },
      path: [
        "color",
        "red"
      ]
    }
  }
};

const formatter = formats['javascript/module-flat'].bind(file);
const dictionary = createDictionary({ properties });

describe('formats', () => {
  describe('javascript/module-flat', () => {

    beforeEach(() => {
      helpers.clearOutput();
    });

    afterEach(() => {
      helpers.clearOutput();
    });

    it('should be a valid JS file', () => {
      fs.writeFileSync('./__tests__/__output/output.js', formatter(createFormatArgs({
        dictionary,
        file: {},
        platform: {}
      }), {}, {}) );
      const test = require('../__output/output.js');
      expect(test.ColorRed).toEqual(dictionary.allProperties[0].value);
    });

  });
});
