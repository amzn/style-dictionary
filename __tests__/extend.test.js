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

var assert = require('chai').assert;
var helpers = require('./helpers');
var _ = require('lodash');
var StyleDictionary = require('../index');

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
      var SD = StyleDictionary.extend(__dirname + '/configs/test.json');
      assert.property(SD.platforms, 'web');
    });

    it('should accept an object as options', () => {
      var config = helpers.fileToJSON(__dirname + '/configs/test.json');
      var SD = StyleDictionary.extend(config);
      assert.property(SD.platforms, 'web');
    });

    it('should override attributes', () => {
      var SD = StyleDictionary.extend({
        properties: {
          foo: 'bar'
        }
      });
      assert.equal(SD.properties.foo, 'bar');
    });

    it('should have all same properties', () => {
      var SD = StyleDictionary.extend({});
      _.each(_.keys(StyleDictionary), function(property) {
        assert.property(SD, property)
      });
    });
  });


  describe('includes', () => {
    it('should throw if include isnt an array', () => {
      assert.throws(
        StyleDictionary.extend.bind(null, {
          include: {}
        }),
        Error,
        'include must be an array'
      );
    });

    test(
      'should throw if a path in the includes array doesnt resolve',
      () => {
        assert.throws(
          StyleDictionary.extend.bind(null, {
            include: ['foo']
          }),
          Error,
          "Cannot find module 'foo'"
        );
      }
    );

    it('should update properties if there are includes', () => {
      var SD = StyleDictionary.extend({
        include: [__dirname + '/configs/include.json']
      });
      assert.isObject(SD.properties.size.padding.tiny);
    });

    it('should override existing properties if there are includes', () => {
      var SD = StyleDictionary.extend({
        properties: test_props,
        include: [__dirname + '/configs/include.json']
      });
      assert.equal(SD.properties.size.padding.tiny.value, '3');
    });
  });


  describe('source', () => {
    it('should throw if source isnt an array', () => {
      assert.throws(
        StyleDictionary.extend.bind(null, {
          source: {}
        }),
        Error,
        'source must be an array'
      );
    });

    it('should throw if a path in the source array doesnt resolve', () => {
      assert.throws(
        StyleDictionary.extend.bind(null, {
          include: ['foo']
        }),
        Error,
        "Cannot find module 'foo'"
      );
    });

    it('should build the properties object if a source is given', () => {
      var SD = StyleDictionary.extend({
        "source": [__dirname + "/properties/paddings.json"]
      });
      assert.deepEqual(SD.properties, helpers.fileToJSON(__dirname + "/properties/paddings.json"));
    });

    it('should override existing properties source is given', () => {
      var SD = StyleDictionary.extend({
        properties: test_props,
        source: [__dirname + "/properties/paddings.json"]
      });
      assert.deepEqual(SD.properties, helpers.fileToJSON(__dirname + "/properties/paddings.json"));
    });
  });


  // This is to allow style dictionaries to depend on other style dictionaries and
  // override properties. Useful for skinning
  test(
    'should not throw a collision error if a source file collides with an include',
    () => {
      var SD = StyleDictionary.extend({
        include: [__dirname + "/properties/paddings.json"],
        source: [__dirname + "/properties/paddings.json"],
        log: 'error'
      });
      assert.deepEqual(SD.properties, helpers.fileToJSON(__dirname + "/properties/paddings.json"));
    }
  );

  test(
    'should throw a error if the collision is in source files and log is set to error',
    () => {
      assert.throws(
        StyleDictionary.extend.bind(null, {
          source: [__dirname + "/properties/paddings.json", __dirname + "/properties/paddings.json"],
          log: 'error'
        }),
        Error,
        'Collision detected at:'
      );
    }
  );

  test(
    'should throw a warning if the collision is in source files and log is set to warn',
    () => {
      assert.doesNotThrow(
        StyleDictionary.extend.bind(null, {
          source: [__dirname + "/properties/paddings.json", __dirname + "/properties/paddings.json"],
          log: 'warn'
        })
      );
    }
  );
});
