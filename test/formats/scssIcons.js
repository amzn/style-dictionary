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
    scss    = require('node-sass'),
    formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "scss/icons",
  "name": "foo"
};

var propertyName = "content-icon-email";
var propertyValue = "'\\E001'";
var itemClass = "3d_rotation";

var dictionary = {
  "allProperties": [{
    "name": propertyName,
    "value": propertyValue,
    "original": {
      "value": propertyValue
    },
    "attributes": {
      "category": "content",
      "type": "icon",
      "item": itemClass
    }
  }]
};

var config = {
  prefix: 'sd' // Style-Dictionary Prefix
};


var formatter = formats['scss/icons'].bind(file);

describe('formats', function() {
  describe('scss/icons', function() {
    it('should have a valid scss syntax', function(done) {
      scss.render({
        data: formatter(dictionary, config),
      }, function(err, result) {
        if(err) {
          return done(new Error(err));
        }
        assert.isDefined(result.css);
        return done();
      });
    });
  });
});
