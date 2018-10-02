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

var transformObject = require('../../lib/transform/object');

var options = {
  transforms: [
    {
      type: 'attribute',
      transformer: function() {
        return {foo: 'bar'}
      }
    }, {
      type: 'attribute',
      transformer: function() {
        return {bar: 'foo'}
      }
    }, {
      type: 'name',
      matcher: function(prop) {
        return prop.attributes.foo === 'bar';
      },
      transformer: function() {
        return "hello";
      }
    }
  ]
};

describe('transform', () => {
  describe('object', () => {
    it('does not crash when called without parameters', () => {
      expect(transformObject()).toEqual({});
    })

    it('returns expected object', () => {
      const objectToTransform = {
        "size": {
          "font": {
            "base": {
              "value": "16",
              "comment": "the base size of the font"
            },
            "large": {
              "value": "20",
              "comment": "the large size of the font"
            }
          }
        },
        "color": "#FFFF00"
      };

      const options = {
        transforms: [
          {
            type: 'attribute',
            transformer: function() {
              return {foo: 'bar'}
            }
          }, {
            type: 'attribute',
            transformer: function() {
              return {bar: 'foo'}
            }
          }, {
            type: 'name',
            matcher: function(prop) {
              return prop.attributes.foo === 'bar';
            },
            transformer: function() {
              return "hello";
            }
          }
        ]
      };

      const expected = {
        "color": "#FFFF00",
        "size": {
          "font": {
            "base": {
              "attributes": {
                "bar": "foo",
                "foo": "bar"
              },
              "comment": "the base size of the font",
              "name": "hello",
              "original": {
                "comment": "the base size of the font",
                "value": "16"
              },
              "path": [
                "size", "font", "base"
              ],
              "value": "16"
            },
            "large": {
              "attributes": {
                "bar": "foo",
                "foo": "bar"
              },
              "comment": "the large size of the font",
              "name": "hello",
              "original": {
                "comment": "the large size of the font",
                "value": "20"
              },
              "path": [
                "size", "font", "large"
              ],
              "value": "20"
            }
          }
        }
      }

      const actual = transformObject(objectToTransform, options);
      expect(actual).toEqual(expected);
    })

  });
});
