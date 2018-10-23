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

const filterProperties = require('../lib/filterProperties');
const helpers = require('./__helpers');
const flattenProperties = require("../lib/utils/flattenProperties");
const _ = require('lodash');

const colorRed = {
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
};

const colorBlue = {
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
};

const sizeSmall = {
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
};

const sizeLarge = {
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
};

const properties = {
  "color": {
    "red": colorRed,
    "blue": colorBlue,
  },
  "size": {
    "small": sizeSmall,
    "large": sizeLarge,
  }
};

const dictionary = {
  "properties": properties,
  "allProperties": flattenProperties(properties)
};

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
    const filter = ({path}) => path.includes("size");
    const filteredDictionary = filterProperties(dictionary, filter);
    _.each(filteredDictionary.allProperties, property => {
      expect(property).not.toBe(colorRed);
      expect(property).not.toBe(colorBlue);
    });
    expect(filteredDictionary.allProperties).toEqual([sizeSmall, sizeLarge]);
    expect(filteredDictionary.properties).toHaveProperty('size');
    expect(filteredDictionary.properties).not.toHaveProperty('color');
  });

  it('should work with a filter object', () => {
    const filter = { "attributes": { "category": "size" } };
    const filteredDictionary = filterProperties(dictionary, filter);
    _.each(filteredDictionary.allProperties, property => {
      expect(property).not.toBe(colorRed);
      expect(property).not.toBe(colorBlue);
    });
    expect(filteredDictionary.allProperties).toEqual([sizeSmall, sizeLarge]);
    expect(filteredDictionary.properties).toHaveProperty('size');
    expect(filteredDictionary.properties).not.toHaveProperty('color');

  });
});
