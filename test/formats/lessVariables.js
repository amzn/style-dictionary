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
    less = require('less'),
    formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "less/variables",
  "name": "foo"
};

var propertyName = "color-base-red-400";
var propertyValue = "#EF5350";

var dictionary = {
  "allProperties": [{
    "name": propertyName,
    "value": propertyValue,
    "original": {
      "value": propertyValue
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

var formatter = formats['less/variables'].bind(file);

describe('formats', function() {
  describe('less/variables', function() {
    it('should have a valid less syntax', function(done) {
      less.render(formatter(dictionary))
        .then(function(output) {
          assert.isDefined(output);
          done();
        })
        .catch(function(err) {
           done(new Error(err))
        });
    });
  });
});
