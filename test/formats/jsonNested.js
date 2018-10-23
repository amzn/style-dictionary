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

var assert = require('chai').assert,
  fs = require('fs-extra'),
  helpers = require('../helpers'),
  formats = require('../../lib/common/formats');

var file = {
  destination: 'output/',
  format: 'json/nested',
};

var dictionary = {
  properties: {
    color: {
      base: {
        red: {
          primary: { value: '#611D1C' },
          secondary: {
            inverse: { value: '#000000' },
          },
        },
      },
    },
  },
};

var formatter = formats['json/nested'].bind(file);

describe('formats', function() {
  describe('json/nested', function() {
    beforeEach(function() {
      helpers.clearOutput();
    });

    it('should be a valid JSON file', function() {
      fs.writeFileSync('./test/output/json-nested.json', formatter(dictionary));
      var test = require('../output/json-nested.json');
      assert.equal(
        test.color.base.red.primary,
        dictionary.properties.color.base.red.primary.value
      );
      assert.equal(
        test.color.base.red.secondary.inverse,
        dictionary.properties.color.base.red.secondary.inverse.value
      );
    });
  });
});
