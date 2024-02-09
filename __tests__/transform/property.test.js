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
import token from '../../lib/transform/token.js';

const config = {
  transforms: [
    {
      type: 'attribute',
      transformer: function () {
        return {
          foo: 'bar',
        };
      },
    },
    {
      type: 'attribute',
      transformer: function () {
        return { bar: 'foo' };
      },
    },
    {
      type: 'name',
      matcher: function (prop) {
        return prop.attributes.foo === 'bar';
      },
      transformer: function () {
        return 'hello';
      },
    },
  ],
};

describe('transform', () => {
  describe('token', () => {
    it('transform token and apply transforms', () => {
      const test = token({ attributes: { baz: 'blah' } }, config, {});
      expect(test).to.have.nested.property('attributes.bar', 'foo');
      expect(test).to.have.property('name', 'hello');
    });

    // This allows transformObject utility to then consider this token's transformation undefined and thus "deferred"
    it('returns a token as undefined if transitive transformer dictates that the transformation has to be deferred', () => {
      const result = token(
        {
          value: '16',
          original: {
            value: '16',
          },
        },
        {
          transforms: [
            {
              type: 'value',
              transitive: true,
              transformer: () => {
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
