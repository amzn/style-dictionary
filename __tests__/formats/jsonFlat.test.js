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

var formats = require('../../lib/common/formats');
var fs = require('fs-extra');
var helpers = require('../__helpers');

var file = {
  "destination": "__output/",
  "format": "json/flat"
};

var dictionary = {
  "allProperties": [{
    "name": "color-base-red",
    "value": "#EF5350",
    "original": {
      "value": "#EF5350"
    },
    "attributes": {
      "category": "color",
      "type": "base",
      "item": "red"
    },
    "path": [
      "color",
      "base",
      "red"
    ]
  }]
};

var formatter = formats['json/flat'].bind(file);

describe('formats', () => {
  describe('json/flat', () => {

    beforeEach(() => {
      helpers.clearOutput();
    });

    afterEach(() => {
      helpers.clearOutput();
    });

    it('should be a valid JSON file', () => {
      fs.writeFileSync('./__tests__/__output/output.flat.json', formatter(dictionary) );
      var test = require('../__output/output.flat.json');
      expect(test['color-base-red']).toEqual(dictionary.allProperties[0].value);
    });
  });

});
