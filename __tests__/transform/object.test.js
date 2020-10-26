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
        return "transformer result";
      }
    }, {
      type: 'value',
      matcher: function(prop) {
        return prop.path[0] === 'spacing';
      },
      transformer: function(val) {
        return val + 'px';
      }
    }
  ]
};

describe('transform', () => {
  describe('object', () => {
    it('does not crash when called without parameters', () => {
      expect(transformObject()).toEqual({});
    })

    it('returns expected result when called with an object without value property', () => {
      const objectToTransform = {
        "color": "#FFFF00"
      };

      const expected = {
        "color": "#FFFF00"
      };

      const actual = transformObject(objectToTransform, options);
      expect(actual).toEqual(expected);
    })

    it('returns expected result when called with an with value leaf', () => {
      const objectToTransform = {
        "font": {
          "base": {
            "value": "16",
            "comment": "the base size of the font"
          }
        }
      };

      const expected = {
        "font": {
          "base": {
            "attributes": {"bar": "foo", "foo": "bar"},
            "comment": "the base size of the font",
            "name": "transformer result",
            "original":
            {
              "comment": "the base size of the font",
              "value": "16"
            },
            "path": ["font", "base"],
            "value": "16"
          }
        }
      };

      const actual = transformObject(objectToTransform, options);
      expect(actual).toEqual(expected);
    });

    it('fills the transformationContext with transformed and deferred transforms', () => {
      const transformedPropRefs = [];
      const deferredPropValueTransforms = [];
      const transformationContext = {
        transformedPropRefs,
        deferredPropValueTransforms
      };

      const objectToTransform = {
        "spacing": {
          "base": {
            "value": "16"
          },
          "medium": {
            "value": "{spacing.base.value}"
          }
        }
      };

      transformObject(objectToTransform, options, transformationContext);

      expect(transformedPropRefs).toEqual(['spacing.base']);
      expect(deferredPropValueTransforms).toEqual(['spacing.medium']);
    })
  });
});
