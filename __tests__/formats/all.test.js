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
var helpers = require('../__helpers');
var _ = require('lodash');

var file = {
  "destination": "__output/",
  "format": "javascript/es6",
  "filter": {
    "attributes": {
      "category": "color"
    }
  }
};

var dictionary = {
  "properties": {
    "color": {
      "red": {"value": "#FF0000"}
    }
  }
};

describe('formats', () => {

  const constantDate = new Date('2000-01-01');
  const globalDate = global.Date;

  beforeAll(() => {
    global.Date = function() { return constantDate };
  });

  afterAll(() => {
    global.Date = globalDate;
  });

  describe('all', () => {
    _.each(_.keys(formats), function(key) {
      it('should return ' + key + ' as a string', () => {
        var formatter = formats[key].bind(file);
        var output = formatter(dictionary, file);
        expect(typeof output).toBe('string');
        expect(output).toMatchSnapshot();
      });
    });
  });

});
