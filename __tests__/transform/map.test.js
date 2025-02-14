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
import StyleDictionary from '../../lib/StyleDictionary.js';
import { transformMap } from '../../lib/transform/map.js';
import { stripMeta } from '../../lib/utils/stripMeta.js';

const sd = new StyleDictionary({
  tokens: {
    colors: {
      red: {
        500: {
          value: '#ff0000',
          type: 'color',
        },
      },
      foreground: {
        primary: {
          value: '{colors.red.500}',
          type: 'color',
        },
      },
    },
    spacing: {
      0: {
        value: 0,
        type: 'dimension',
      },
      '0p5': {
        value: 2,
        type: 'dimension',
      },
      '0p5-ref': {
        value: '{spacing.0p5}',
        type: 'dimension',
      },
      1: {
        value: 4,
        type: 'dimension',
      },
      2: {
        value: 8,
        type: 'dimension',
      },
    },
    border: {
      value: {
        width: '{spacing.0p5-ref}',
        color: '{colors.foreground.primary}',
      },
      type: 'border',
    },
  },
});

const config = {
  transforms: [
    {
      type: 'attribute',
      filter: function (token) {
        return token.name === '0';
      },
      transform: function () {
        return { foo: 'bar' };
      },
    },
    {
      type: 'attribute',
      filter: function (token) {
        return token.name === '1';
      },
      // verify async transforms to also work properly
      transform: async function () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { bar: 'foo' };
      },
    },
    {
      type: 'value',
      filter: function (token) {
        return token.path[0] === 'spacing';
      },
      transform: function (token) {
        return token.value + 'px';
      },
    },
    {
      type: 'value',
      // transitive because we have an object value with properties
      // so the properties must be resolved before we can transform the object as a whole
      transitive: true,
      filter: function (token) {
        return token.path[0] === 'border';
      },
      transform: function (token) {
        return { ...token.value, width_plus_one: token.value.width + 1 };
      },
    },
    {
      type: 'name',
      filter: function (token) {
        return token.path.includes('foreground');
      },
      // verify async transforms to also work properly
      transform: async function () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return 'transform result';
      },
    },
  ],
};

describe('transform', () => {
  describe('map', () => {
    it('does not crash when called with empty map', async () => {
      const m = new Map();
      await transformMap(m, {}, {});
      expect(m).to.eql(new Map());
    });

    it('correctly transforms tokenMap and defers tokens transforms as needed', async () => {
      const transformedPropRefs = [];
      const deferredPropValueTransforms = [];
      const transformationContext = {
        transformedPropRefs,
        deferredPropValueTransforms,
      };

      await sd.hasInitialized;

      const m = structuredClone(sd.tokenMap);

      await transformMap(m, config, {}, transformationContext);
      expect(transformedPropRefs).to.eql([
        '{colors.red.500}',
        '{spacing.0}',
        '{spacing.1}',
        '{spacing.2}',
        '{spacing.0p5}',
      ]);
      expect(deferredPropValueTransforms).to.eql([
        '{colors.foreground.primary}',
        '{spacing.0p5-ref}',
        '{border}',
      ]);

      // Simulate 1 cycle of reference resolution
      m.set('{colors.foreground.primary}', {
        ...m.get('{colors.foreground.primary}'),
        value: '#ff0000',
      });
      m.set('{spacing.0p5-ref}', {
        ...m.get('{spacing.0p5-ref}'),
        value: 2,
      });
      m.set('{border}', {
        ...m.get('{border}'),
        value: {
          width: '{spacing.0p5}',
          color: '{colors.red.500}',
        },
      });

      await transformMap(m, config, {}, transformationContext);
      expect(transformedPropRefs).to.eql([
        '{colors.red.500}',
        '{spacing.0}',
        '{spacing.1}',
        '{spacing.2}',
        '{spacing.0p5}',
        '{colors.foreground.primary}',
        '{spacing.0p5-ref}',
      ]);
      expect(deferredPropValueTransforms).to.eql(['{border}']);

      // Simulate 2nd cycle of reference resolution
      m.set('{border}', {
        ...m.get('{border}'),
        value: {
          width: 2,
          color: '#ff0000',
        },
      });

      await transformMap(m, config, {}, transformationContext);
      expect(transformedPropRefs).to.eql([
        '{colors.red.500}',
        '{spacing.0}',
        '{spacing.1}',
        '{spacing.2}',
        '{spacing.0p5}',
        '{colors.foreground.primary}',
        '{spacing.0p5-ref}',
        '{border}',
      ]);
      expect(deferredPropValueTransforms).to.eql([]);

      const result = Array.from(m).map(([key, value]) => [
        key,
        stripMeta(value, { keep: ['value', 'name', 'attributes'] }),
      ]);
      await expect(JSON.stringify(result, null, 2)).to.matchSnapshot();
    });
  });
});
