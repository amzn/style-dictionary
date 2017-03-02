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
    fs = require('fs-extra'),
    helpers = require('../helpers'),
    formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "json"
};

var dictionary = {
  "properties": {
    "color": {
      "red": {"value": "#FF0000"}
    }
  }
};

var formatter = formats['json'].bind(file);

describe('formats', function() {
  describe('javascript/module', function() {
    beforeEach(function() {
      helpers.clearOutput();
    });

    it('should be a valid JSON file', function() {
      fs.writeFileSync('./test/output/output.json', formatter(dictionary) );
      var test = require('../output/output.json');
      assert.equal( test.color.red.value, dictionary.properties.color.red.value );
    });
  });
});
