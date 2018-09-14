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

var expect = require('chai').expect;
var helpers = require('./__helpers');
var flattenProperties = require("../lib/utils/flattenProperties");
var filterProperties = require('../lib/filterProperties');

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

var dictionary = {
  "properties": properties,
  "allProperties": flattenProperties(properties)
}

describe('filterProperties', () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  test(
    'should return the original dictionary if no filter is provided',
    () => {
      expect(dictionary).equal(filterProperties(dictionary))
    }
  );

  it('should work with a filter function', () => {
    var filter = function(property) {
      return property.path.includes("size")
    }
    var filteredDictionary = filterProperties(dictionary, filter)
    expect(filteredDictionary.allProperties).to.not.have.any.members([colorRed, colorBlue])
    expect(filteredDictionary.allProperties).to.have.all.members([sizeSmall, sizeLarge])
    expect(filteredDictionary.properties).to.not.have.any.keys("color")
    expect(filteredDictionary.properties).to.have.all.keys("size")
  });

  it('should work with a filter object', () => {
    var filter = { "attributes": { "category": "size" } }
    var filteredDictionary = filterProperties(dictionary, filter)
    expect(filteredDictionary.allProperties).to.not.have.any.members([colorRed, colorBlue])
    expect(filteredDictionary.allProperties).to.have.all.members([sizeSmall, sizeLarge])
    expect(filteredDictionary.properties).to.not.have.any.keys("color")
    expect(filteredDictionary.properties).to.have.all.keys("size")
  });
});
