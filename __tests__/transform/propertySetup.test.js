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

var propertySetup = require('../../lib/transform/propertySetup');

describe('transform', () => {
  describe('propertySetup', () => {

    it('should error if property is not an object', () => {
      expect(
        propertySetup.bind(null, null, 'foo', [])
      ).toThrow('Property object must be an object');
    });

    it('should error if name in not a string', () => {
      expect(
        propertySetup.bind(null, {}, null, [])
      ).toThrow('Name must be a string');
    });

    it('should error path is not an array', () => {
      expect(
        propertySetup.bind(null, {}, 'name', null)
      ).toThrow('Path must be an array');
    });


    it('should work if all the args are proper', () => {
      var test = propertySetup(
        {value: "#fff"},
        "white",
        ["color","base"]
      );
      expect(typeof test).toBe('object');
      expect(test).toHaveProperty('value');
      expect(test).toHaveProperty('original');
      expect(test).toHaveProperty('attributes');
      expect(test).toHaveProperty('path');
    });


    it('should not do anything and return the property if it has been setup previously', () => {
      var original = {value: "#fff", original:{}};
      var test = propertySetup(
        original,
        "white",
        ["color","base"]
      );
      expect(test).toMatchObject(original);
    });

    it('should use attributes if already set', () => {
      var attributes = {"foo":"bar"};
      var test = propertySetup(
        {value:"#fff", attributes:attributes},
        "white",
        ["color","base"]
      );
      expect(test.attributes).toMatchObject(attributes);
    });

    it('should use the name on the property if set', () => {
      var name = "name";
      var test = propertySetup(
        {value:"#fff", name:name},
        'white',
        ["color","base"]
      );
      expect(test).toHaveProperty('name', name);
    });

    it('should use the name passed in if not set on the property', () => {
      var test = propertySetup(
        {value:"#fff"},
        'white',
        ["color","base"]
      );
      expect(test).toHaveProperty('name', 'white');
    });

    it('should handle objects', () => {
      const test = propertySetup({
        value: {
          h: 20, s: 50, l: 50
        }
      }, 'red', ['color','red']);
      expect(test).toHaveProperty('value.h', 20);
      expect(test).toHaveProperty('original.value.h', 20);
    })

  });
});
