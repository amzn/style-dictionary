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

var helpers = require('./__helpers');
var StyleDictionary = require('../index');
var _ = require('../lib/utils/es6_');

function traverseObj(obj, fn) {
  for (let key in obj) {
    fn.apply(this, [obj, key, obj[key]]);
    if (obj[key] && typeof obj[key] === 'object') {
      traverseObj(obj[key], fn);
    }
  }
}

var test_props = {
  size: {
    padding: {
      tiny: {value:'0'}
    }
  }
};

describe('extend', () => {
  describe('method signature', () => {
    it('should accept a string as a path to a JSON file', () => {
      var StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/__configs/test.json');
      expect(StyleDictionaryExtended).toHaveProperty('platforms.web');
    });

    it('should accept an object as options', () => {
      var config = helpers.fileToJSON(__dirname + '/__configs/test.json');
      var StyleDictionaryExtended = StyleDictionary.extend(config);
      expect(StyleDictionaryExtended).toHaveProperty('platforms.web');
    });

    it('should override attributes', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        properties: {
          foo: 'bar'
        }
      });
      expect(StyleDictionaryExtended).toHaveProperty('properties.foo', 'bar');
    });

    it('should have all same properties', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({});
      _.each(_.keys(StyleDictionaryExtended), function(property) {
        expect(StyleDictionaryExtended).toHaveProperty(property);
      });
    });
  });

  describe('includes', () => {
    it('should throw if include isnt an array', () => {
      expect(
        StyleDictionary.extend.bind(null, {include: {}})
      ).toThrow('include must be an array');
    });

    it('should not update properties if include glob paths dont resolve to anything', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        include: ['foo']
      });
      expect(typeof StyleDictionaryExtended.properties.size).toBe('undefined');
    });

    it('should properly glob paths', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        include: [__dirname + '/__properties/*.json']
      });
      expect(typeof StyleDictionaryExtended.properties.size.padding.tiny).toBe('object');
    });

    it('should build the properties object if an include is given', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        include: [__dirname + "/__properties/paddings.json"]
      });
      var output = helpers.fileToJSON(__dirname + "/__properties/paddings.json");
      traverseObj(output, (obj) => {
        if (obj.hasOwnProperty('value') && !obj.filePath) {
          obj.filePath = __dirname + "/__properties/paddings.json";
          obj.isSource = false;
        }
      });
      expect(StyleDictionaryExtended.properties).toEqual(output);
    });

    it('should override existing properties if include is given', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        properties: test_props,
        "include": [__dirname + "/__properties/paddings.json"]
      });
      var output = helpers.fileToJSON(__dirname + "/__properties/paddings.json");
      traverseObj(output, (obj) => {
        if (obj.hasOwnProperty('value') && !obj.filePath) {
          obj.filePath = __dirname + "/__properties/paddings.json";
          obj.isSource = false;
        }
      });
      expect(StyleDictionaryExtended.properties).toEqual(output);
    });

    it('should update properties if there are includes', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        include: [__dirname + '/__configs/include.json']
      });
      expect(typeof StyleDictionaryExtended.properties.size.padding.tiny).toBe('object');
    });

    it('should override existing properties if there are includes', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        properties: test_props,
        include: [__dirname + '/__configs/include.json']
      });
      expect(StyleDictionaryExtended).toHaveProperty('properties.size.padding.tiny.value', '3');
    });
  });

  describe('source', () => {
    it('should throw if source isnt an array', () => {
      expect(
        StyleDictionary.extend.bind(null, {source: {}})
      ).toThrow('source must be an array');
    });

    it('should not update properties if source glob paths don\'t resolve to anything', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        source: ['foo']
      });
      expect(typeof StyleDictionaryExtended.properties.size).toBe('undefined');
    });

    it('should build the properties object if a source is given', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        "source": [__dirname + "/__properties/paddings.json"]
      });
      var output = helpers.fileToJSON(__dirname + "/__properties/paddings.json");
      traverseObj(output, (obj) => {
        if (obj.hasOwnProperty('value') && !obj.filePath) {
          obj.filePath = __dirname + "/__properties/paddings.json";
          obj.isSource = true;
        }
      });
      expect(StyleDictionaryExtended.properties).toEqual(output);
    });

    it('should use relative filePaths for the filePath property', () => {
      var filePath = "__tests__/__properties/paddings.json";
      var StyleDictionaryExtended = StyleDictionary.extend({
        "source": [filePath]
      });
      var output = helpers.fileToJSON(__dirname + "/__properties/paddings.json");
      traverseObj(output, (obj) => {
        if (obj.hasOwnProperty('value') && !obj.filePath) {
          obj.filePath = filePath;
          obj.isSource = true;
        }
      });
      expect(StyleDictionaryExtended.properties).toEqual(output);
    });

    it('should override existing properties source is given', () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        properties: test_props,
        source: [__dirname + "/__properties/paddings.json"]
      });
      var output = helpers.fileToJSON(__dirname + "/__properties/paddings.json");
      traverseObj(output, (obj) => {
        if (obj.hasOwnProperty('value') && !obj.filePath) {
          obj.filePath = __dirname + "/__properties/paddings.json";
          obj.isSource = true;
        }
      });
      expect(StyleDictionaryExtended.properties).toEqual(output);
    });
  });

  // This is to allow style dictionaries to depend on other style dictionaries and
  // override properties. Useful for skinning
  it('should not throw a collision error if a source file collides with an include', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      include: [__dirname + "/__properties/paddings.1.json"],
      source: [__dirname + "/__properties/paddings.json"],
      log: 'error'
    });
    var output = helpers.fileToJSON(__dirname + "/__properties/paddings.json");
    traverseObj(output, (obj) => {
      if (obj.hasOwnProperty('value') && !obj.filePath) {
        obj.filePath = __dirname + "/__properties/paddings.json";
        obj.isSource = true;
      }
    });
    expect(StyleDictionaryExtended.properties).toEqual(output);
  });

  it('should throw a error if the collision is in source files and log is set to error', () => {
    expect(
      StyleDictionary.extend.bind(null, {
        source: [__dirname + "/__properties/paddings.1.json", __dirname + "/__properties/paddings.json"],
        log: 'error'
      })
    ).toThrow('Collisions detected');
  });

  it('should throw a warning if the collision is in source files and log is set to warn', () => {
    expect(
      StyleDictionary.extend.bind(null, {
        source: [__dirname + "/__properties/paddings.json", __dirname + "/__properties/paddings.json"],
        log: 'warn'
      })
    ).not.toThrow();
  });

  it('should accept a string as a path to a JSON5 file', function() {
    var StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/__configs/test.json5');
    expect(StyleDictionaryExtended).toHaveProperty('platforms.web');
  });

  it('should accept a string as a path to a JSONC file', function() {
    var StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/__configs/test.jsonc');
    expect(StyleDictionaryExtended).toHaveProperty('platforms.web');
  });

  it('should allow for chained extends and not mutate the original', function() {
    var StyleDictionary1 = StyleDictionary.extend({
      foo: 'bar'
    });
    var StyleDictionary2 = StyleDictionary1.extend({
      foo: 'baz'
    });
    var StyleDictionary3 = StyleDictionary.extend({
      foo: 'bar'
    }).extend({
      foo: 'boo'
    });
    expect(StyleDictionary1.foo).toBe('bar');
    expect(StyleDictionary2.foo).toBe('baz');
    expect(StyleDictionary3.foo).toBe('boo');
    expect(StyleDictionary).not.toHaveProperty('foo');
  });

  it(`should not pollute the prototype`, () => {
    const obj = {};
    let opts = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    console.log("Before : " + obj.polluted);
    StyleDictionary.extend(opts);
    console.log("After : " + obj.polluted);
    expect(obj.polluted).toBeUndefined();
  });
});
