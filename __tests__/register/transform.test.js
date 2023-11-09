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
import StyleDictionary from 'style-dictionary';

describe('register', () => {
  describe('transform', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if type is not a string', () => {
      expect(() => {
        StyleDictionaryExtended.registerTransform({
          type: 3,
        });
      }).to.throw('type must be a string');
    });

    it('should error if type is not a valid type', () => {
      expect(() => {
        StyleDictionaryExtended.registerTransform({
          type: 'foo',
        });
      }).to.throw('foo type is not one of: name, value, attribute');
    });

    it('should error if name is not a string', () => {
      expect(() => {
        StyleDictionaryExtended.registerTransform({
          type: 'name',
        });
      }).to.throw('name must be a string');
    });

    it('should error if matcher is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerTransform({
          type: 'name',
          name: 'name',
          matcher: 'foo',
        });
      }).to.throw('matcher must be a function');
    });

    it('should error if transformer is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerTransform({
          type: 'name',
          name: 'name',
          matcher: function () {
            return true;
          },
          transformer: 'foo',
        });
      }).to.throw('transformer must be a function');
    });

    it('should work if type, matcher, and transformer are all proper', () => {
      StyleDictionaryExtended.registerTransform({
        type: 'name',
        name: 'foo',
        matcher: function () {
          return true;
        },
        transformer: function () {
          return true;
        },
      });
      expect(typeof StyleDictionaryExtended.transform.foo).to.equal('object');
      expect(StyleDictionaryExtended).to.have.nested.property('transform.foo.type', 'name');
      expect(typeof StyleDictionaryExtended.transform.foo.matcher).to.equal('function');
      expect(typeof StyleDictionaryExtended.transform.foo.transformer).to.equal('function');
    });

    it('should properly pass the registered transform to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.transform.foo).to.equal('object');
      expect(SDE2).to.have.nested.property('transform.foo.type', 'name');
      expect(typeof SDE2.transform.foo.matcher).to.equal('function');
      expect(typeof SDE2.transform.foo.transformer).to.equal('function');
    });
  });
});
