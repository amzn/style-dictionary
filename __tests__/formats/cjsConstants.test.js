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
var fs = require('fs-extra');
var helpers = require('../__helpers');
var formats = require('../../lib/common/formats');

var file = {
  "destination": "__output/",
  "format": "javascript/cjs",
  "filter": {
    "attributes": {
      "category": "color"
    }
  }
};

var dictionary = {
  "allProperties": [{
    "name": "red",
    "value": "#EF5350",
    "original": {
      "value": "#EF5350"
    },
    "attributes": {
      "category": "color",
      "type": "base",
      "item": "red",
      "subitem": "400"
    },
    "path": [
      "color",
      "base",
      "red",
      "400"
    ]
  }]
};

var formatter = formats['javascript/cjs'].bind(file);

describe('formats', () => {
  describe('javascript/cjs', () => {
    beforeEach(() => {
      helpers.clearOutput();
    });

    afterEach(() => {
      helpers.clearOutput();
    });

    it('should be a valid JS file', () => {
      fs.writeFileSync('./__tests__/__output/output.js', formatter(dictionary) );
      var test = require('../__output/output.js');
      expect(test.red).toEqual(dictionary.allProperties[0].value);
    });
  });

});
