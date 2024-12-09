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
import transformToken from '../../lib/transform/token.js';
import { transformTypes } from '../../lib/enums/index.js';

const { value: transformTypeValue, name, attribute } = transformTypes;

const config = {
  transforms: [
    {
      type: attribute,
      transform: function () {
        return {
          foo: 'bar',
        };
      },
    },
    {
      type: attribute,
      transform: function () {
        return { bar: 'foo' };
      },
    },
    {
      type: name,
      filter: function (prop) {
        return prop.attributes.foo === 'bar';
      },
      transform: function () {
        return 'hello';
      },
    },
  ],
};

describe('transform', () => {
  describe('token', () => {
    it('transform token and apply transforms', async () => {
      const test = await transformToken({ attributes: { baz: 'blah' } }, config, {});
      expect(test).to.have.nested.property('attributes.bar', 'foo');
      expect(test).to.have.property('name', 'hello');
    });

    // This allows transformObject utility to then consider this token's transformation undefined and thus "deferred"
    it('returns a token as undefined if transitive transform dictates that the transformation has to be deferred', async () => {
      const result = await transformToken(
        {
          value: '16',
          original: {
            value: '16',
          },
        },
        {
          transforms: [
            {
              type: transformTypeValue,
              transitive: true,
              transform: () => {
                return undefined;
              },
            },
          ],
        },
        {},
      );

      expect(result).to.be.undefined;
    });

    // Add more tests
  });
});
