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

var filterProperties = require('../lib/filterProperties');
var helpers = require('./__helpers');
var flattenProperties = require("../lib/utils/flattenProperties");
var _ = require('../lib/utils/es6_');

var colorRed = {
  "value": "#FF0000",
  "original": {
    "value": "#FF0000",
  },
  "name": "color-red",
  "attributes": { type: "color" },
  "path": [
    "color",
    "red"
  ]
}

var colorBlue = {
  "value": "#0000FF",
  "original": {
    "value": "#0000FF",
  },
  "name": "color-blue",
  "attributes": { type: "color" },
  "path": [
    "color",
    "blue"
  ]
}

var sizeSmall = {
  "value": "2px",
  "original": {
    "value": "2px",
  },
  "name": "size-small",
  "attributes": { category: "size" },
  "path": [
    "size",
    "small"
  ]
}

var sizeLarge = {
  "value": "4px",
  "original": {
    "value": "4px",
  },
  "name": "size-large",
  "attributes": { category: "size" },
  "path": [
    "size",
    "large"
  ]
}

var not_kept = {
  "value": 0,
  "original": {
    "value": 0,
  },
  "name": "falsy_values-not_kept",
  "attributes": { category: "falsy_values" },
  "path": [
    "falsy_values",
    "not_kept"
  ]
}

var kept = {
  "value": 0,
  "original": {
    "value": 0,
  },
  "name": "falsy_values-kept",
  "attributes": { category: "falsy_values" },
  "path": [
    "falsy_values",
    "kept"
  ]
}

var properties = {
  "color": {
    "red": colorRed,
    "blue": colorBlue,
  },
  "size": {
    "small": sizeSmall,
    "large": sizeLarge,
  }
};

var falsy_values = {
  "kept": kept,
  "not_kept": not_kept,
};

var dictionary = {
  "properties": properties,
  "allProperties": flattenProperties(properties)
}

var falsy_dictionary = {
  "properties": falsy_values,
  "allProperties": flattenProperties(falsy_values)
}

describe('filterProperties', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should return the original dictionary if no filter is provided', () => {
    expect(dictionary).toMatchObject(filterProperties(dictionary));
  });

  it('should work with a filter function', () => {
    var filter = function(property) {
      return property.path.includes("size");
    }
    var filteredDictionary = filterProperties(dictionary, filter);
    _.each(filteredDictionary.allProperties, function(property) {
      expect(property).not.toBe(colorRed);
      expect(property).not.toBe(colorBlue);
    });
    expect(filteredDictionary.allProperties).toEqual([sizeSmall, sizeLarge]);
    expect(filteredDictionary.properties).toHaveProperty('size');
    expect(filteredDictionary.properties).not.toHaveProperty('color');
  });

  it('should work with falsy values and a filter function', () => {
    var filter = function(property) {
      return property.path.includes("kept");
    }

    var filteredDictionary = filterProperties(falsy_dictionary, filter);
    _.each(filteredDictionary.allProperties, function(property) {
      expect(property).not.toBe(not_kept);
    });
    expect(filteredDictionary.allProperties).toEqual([kept]);
    expect(filteredDictionary.properties).toHaveProperty('kept');
    expect(filteredDictionary.properties).not.toHaveProperty('not_kept');
  });

  describe('should throw if', () => {
    it('filter is a string', () => {
      expect(
        function(){
          filterProperties(dictionary, 'my_filter')
        }
      ).toThrow(/filter is not a function/);
    });
    it('filter is an object', () => {
      expect(
        function(){
          filterProperties(dictionary, { "attributes": { "category": "size" } })
        }
      ).toThrow(/filter is not a function/);
    });
  });

});
