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

var assert  = require('chai').assert,
    formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "javascript/es6",
  "filter": {
    "attributes": {
      "category": "color"
    }
  }
};

var dictionary = {
  "allProperties": [{
    "name": "TEST",
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

var formatter = formats['javascript/es6'].bind(file);

describe('formats', function() {
  describe('es6Constants', function() {
    it('should be a valid JS file', function() {
      // TODO: add tests here,
      // Because this is a normal JS module we can't
      // test outputting an ES6 JS file by importing it.
    });
  });
});
