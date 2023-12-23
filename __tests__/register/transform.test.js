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
import { registerSuite } from './register.suite.js';
import transform from '../../lib/common/transforms.js';

const transformerPxAppender = {
  name: 'px-appender',
  type: 'value',
  transformer: (token) => `${token.value}px`,
};

const transformerValueIncrementer = {
  name: 'value-incrementer',
  type: 'value',
  matcher: (token) => typeof token.value === 'number',
  transformer: (token) => token.value + 1,
};

registerSuite({
  config: {
    type: 'value',
    transformer: () => {},
  },
  registerMethod: 'registerTransform',
  prop: 'transform',
});

describe('register', () => {
  beforeEach(() => {
    StyleDictionary.transform = transform;
  });
  afterEach(() => {
    StyleDictionary.transform = transform;
  });

  describe('instance vs class registration', () => {
    it('should allow registering on class, affecting all instances', async () => {
      StyleDictionary.registerTransform(transformerPxAppender);

      const baseCfg = {
        platforms: {
          test: {
            transforms: ['px-appender'],
          },
        },
      };

      const sd1 = new StyleDictionary({
        ...baseCfg,
        tokens: {
          size1: {
            value: 1,
            type: 'dimension',
          },
        },
      });
      const sd2 = new StyleDictionary({
        ...baseCfg,
        tokens: {
          size2: {
            value: 2,
            type: 'dimension',
          },
        },
      });
      const sd3 = await sd2.extend({
        ...baseCfg,
        tokens: {
          size3: {
            value: 3,
            type: 'dimension',
          },
        },
      });

      const [sd1After, sd2After, sd3After] = await Promise.all(
        [sd1, sd2, sd3].map((sd) => sd.exportPlatform('test')),
      );

      expect(sd1.transform['px-appender']).to.not.be.undefined;
      expect(sd2.transform['px-appender']).to.not.be.undefined;
      expect(sd3.transform['px-appender']).to.not.be.undefined;

      expect(sd1After.size1.value).to.equal('1px');
      expect(sd2After.size2.value).to.equal('2px');
      expect(sd3After.size2.value).to.equal('2px');
      expect(sd3After.size3.value).to.equal('3px');
    });

    it('should allow registering on instance, affecting only that instance', async () => {
      const sd1 = new StyleDictionary();
      const sd2 = new StyleDictionary();
      const sd3 = await sd2.extend();

      sd2.registerTransform(transformerPxAppender);

      expect(sd1.transform['px-appender']).to.be.undefined;
      expect(sd2.transform['px-appender']).to.not.be.undefined;
      expect(sd3.transform['px-appender']).to.be.undefined;
    });

    it('should combine class and instance registrations on the instance', async () => {
      StyleDictionary.registerTransform(transformerPxAppender);

      const sd1 = new StyleDictionary({
        platforms: {
          test: {
            transforms: ['px-appender'],
          },
        },
        tokens: {
          size1: {
            value: 1,
            type: 'dimension',
          },
        },
      });

      const sd2 = new StyleDictionary({
        platforms: {
          test: {
            transforms: ['value-incrementer', 'px-appender'],
          },
        },
        tokens: {
          size2: {
            value: 2,
            type: 'dimension',
          },
        },
      });
      sd2.registerTransform(transformerValueIncrementer);

      const sd3 = await sd2.extend({
        tokens: {
          size3: {
            value: 3,
            type: 'dimension',
          },
        },
      });

      const [sd1After, sd2After, sd3After] = await Promise.all(
        [sd1, sd2, sd3].map((sd) => sd.exportPlatform('test')),
      );

      expect(sd1.transform['px-appender']).to.not.be.undefined;
      expect(sd2.transform['px-appender']).to.not.be.undefined;
      expect(sd3.transform['px-appender']).to.not.be.undefined;
      // should not be registered on sd1, because we registered only on sd2
      expect(sd1.transform['value-incrementer']).to.be.undefined;
      expect(sd2.transform['value-incrementer']).to.not.be.undefined;
      // should be registered because sd3 extends sd2
      expect(sd3.transform['value-incrementer']).to.not.be.undefined;

      expect(sd1After.size1.value).to.equal('1px');
      expect(sd2After.size2.value).to.equal('3px');
      expect(sd3After.size2.value).to.equal('3px');
      expect(sd3After.size3.value).to.equal('4px');
    });
  });

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
