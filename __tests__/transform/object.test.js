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
import { expect } from 'chai';
import transformObject from '../../lib/transform/object.js';

const config = {
  transforms: [
    {
      type: 'attribute',
      transformer: function () {
        return { foo: 'bar' };
      },
    },
    {
      type: 'attribute',
      // verify async transforms to also work properly
      transformer: async function () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { bar: 'foo' };
      },
    },
    {
      type: 'name',
      filter: function (token) {
        return token.attributes.foo === 'bar';
      },
      // verify async transforms to also work properly
      transformer: async function () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return 'transformer result';
      },
    },
    {
      type: 'value',
      filter: function (token) {
        return token.path[0] === 'spacing';
      },
      transformer: function (val) {
        return val + 'px';
      },
    },
  ],
};

describe('transform', () => {
  describe('object', () => {
    it('does not crash when called without parameters', async () => {
      expect(await transformObject()).to.eql({});
    });

    it('returns expected result when called with an object without value property', async () => {
      const objectToTransform = {
        color: '#FFFF00',
      };

      const expected = {
        color: '#FFFF00',
      };

      const actual = await transformObject(objectToTransform, config, {});
      expect(actual).to.eql(expected);
    });

    it('returns expected result when called with value leaf', async () => {
      const objectToTransform = {
        font: {
          base: {
            value: '16',
            comment: 'the base size of the font',
          },
        },
      };

      const expected = {
        font: {
          base: {
            attributes: { bar: 'foo', foo: 'bar' },
            comment: 'the base size of the font',
            name: 'transformer result',
            original: {
              comment: 'the base size of the font',
              value: '16',
            },
            path: ['font', 'base'],
            value: '16',
          },
        },
      };

      const actual = await transformObject(objectToTransform, config, {});
      expect(actual).to.eql(expected);
    });

    it('fills the transformationContext with transformed and deferred transforms', async () => {
      const transformedPropRefs = [];
      const deferredPropValueTransforms = [];
      const transformationContext = {
        transformedPropRefs,
        deferredPropValueTransforms,
      };

      const objectToTransform = {
        spacing: {
          base: {
            value: '16',
          },
          medium: {
            value: '{spacing.base.value}',
          },
        },
      };

      await transformObject(objectToTransform, config, {}, transformationContext);

      expect(transformedPropRefs).to.eql(['spacing.base']);
      expect(deferredPropValueTransforms).to.eql(['spacing.medium']);
    });
  });
});
