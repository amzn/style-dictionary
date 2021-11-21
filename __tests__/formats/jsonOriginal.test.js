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
  destination: 'output/',
  format: 'json/original',
};

const properties = {
  color: {
    base: {
      red: {
        primary: {
          value: '#611D1D',
          type: 'color',
          desciption: null,
          isSource: true,
          name: "primary"
        },
        secondary: {
          value: '#611D1C',
          type: 'color',
          desciption: null,
          isSource: true,
          original: {
            value: '#611D1C',
            type: 'color',
            desciption: null
          },
          name: "secondary"
        },
        tertiary: {
          inverse: {
            value: '#000000'
          },
        },
      },
    },
  },
};

const expected = {
  color: {
    base: {
      red: {
        primary: {
          value: '#611D1D',
          type: 'color',
          desciption: null,
        },
        secondary: {
          value: '#611D1C',
          type: 'color',
          desciption: null,
        },
        tertiary: {
          inverse: {
            value: '#000000'
          },
        },
      },
    },
  },
}

const formatter = formats['json/original'].bind(file);
const dictionary = createDictionary({ properties });

describe('formats', function () {
  describe('json/original', function () {
    beforeEach(() => {
      helpers.clearOutput();
    });

    afterEach(() => {
      helpers.clearOutput();
    });

    it('should be a valid JSON file', function () {
      fs.writeFileSync('./__tests__/__output/json-original.json', formatter(createFormatArgs({
        dictionary,
        file,
        platform: {}
      }), {}, file));
      const test = require('../__output/json-original.json');
      expect(test)
        .toEqual(expected);
    });
  });
});
