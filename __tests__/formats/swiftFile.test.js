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
const _ = require('../../lib/utils/es6_');

const originalFile = {
  "destination": "__output/",
  "format": "ios-swift/any.swift",
  "className": "StyleDictionary",
  "filter": {
    "attributes": {
      "category": "color"
    }
  },
  "options": {}
};

var file = {}

const properties = {
  color: {
    base: {
      red: {
        value: 'UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)',
        filePath: 'tokens/color/base.json',
        original: { value: '#FF0000' },
        name: 'colorBaseRed',
        attributes: { category: 'color', type: 'base', item: 'red' },
        path: [ 'color', 'base', 'red' ]
      }
    }
  }
};

const format = formats['ios-swift/any.swift'];
const dictionary = createDictionary({ properties });

describe('formats', () => {

  describe('ios-swift/any.swift', () => {
    beforeEach(() => {
      file = _.cloneDeep(originalFile);
    });

    it('should match default snapshot', () => {
      expect(format(createFormatArgs({
        dictionary,
        file,
        platform: {}
      }), {}, file)).toMatchSnapshot();
    });

    it('with import override should match snapshot', () => {
      file.options.import = ["UIKit", "AnotherModule"];
      expect(format(createFormatArgs({
        dictionary,
        file,
        platform: {}
      }), {}, file)).toMatchSnapshot();
    });

    it('with objectType override should match snapshot', () => {
      file.options.objectType = "struct"
      expect(format(createFormatArgs({
        dictionary,
        file,
        platform: {}
      }), {}, file)).toMatchSnapshot();
    });

    it('with access control override should match snapshot', () => {
      file.options.accessControl = "internal"
      expect(format(createFormatArgs({
        dictionary,
        file,
        platform: {}
      }), {}, file)).toMatchSnapshot();
    });

  });

});