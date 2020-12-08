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
var scss = require('node-sass');
var _ = require('../../lib/utils/es6_');

var file = {
  "destination": "__output/",
  "format": "scss/variables",
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

var formatter = formats['scss/variables'].bind(file);

describe('formats', () => {
  describe('scss/variables', () => {

    it('should have a valid scss syntax', () => {
      const result = scss.renderSync({
        data: formatter(dictionary, {}, file),
      });
      expect(result.css).toBeDefined();
    });

    it('should optionally use !default', () => {
      var themeableDictionary = _.cloneDeep(dictionary),
        formattedScss = formatter(dictionary),
        themeableScss = "";

      expect(formattedScss).not.toMatch("!default");

      themeableDictionary.allProperties[0].themeable = true;
      themeableScss = formatter(themeableDictionary);

      expect(themeableScss).toMatch("#EF5350 !default;");
    });
  });
});
