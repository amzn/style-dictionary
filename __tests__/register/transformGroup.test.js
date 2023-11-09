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

const dummyTransformName = 'transformGroup.test.js';

describe('register/transformGroup', async () => {
  const StyleDictionaryExtended = new StyleDictionary({});

  it('should error if name is not a string', () => {
    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        transforms: [dummyTransformName],
      });
    }).to.throw('transform name must be a string');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: 1,
        transforms: [dummyTransformName],
      });
    }).to.throw('transform name must be a string');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: [],
        transforms: [dummyTransformName],
      });
    }).to.throw('transform name must be a string');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: {},
        transforms: [dummyTransformName],
      });
    }).to.throw('transform name must be a string');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: function () {},
        transforms: [dummyTransformName],
      });
    }).to.throw('transform name must be a string');
  });

  it("should error if transforms isn't an array", () => {
    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: 'foo',
      });
    }).to.throw('transforms must be an array of registered value transforms');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: 'foo',
        transforms: dummyTransformName,
      });
    }).to.throw('transforms must be an array of registered value transforms');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: 'foo',
        transforms: {},
      });
    }).to.throw('transforms must be an array of registered value transforms');

    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: 'foo',
        transforms: function () {},
      });
    }).to.throw('transforms must be an array of registered value transforms');
  });

  it('should error if transforms arent registered', () => {
    expect(() => {
      StyleDictionaryExtended.registerTransformGroup({
        name: 'foo',
        transforms: [dummyTransformName],
      });
    }).to.throw('transforms must be an array of registered value transforms');
  });

  it('should work if everything is good', () => {
    StyleDictionaryExtended.registerTransformGroup({
      name: 'foo',
      transforms: ['size/px'],
    });
    expect(Array.isArray(StyleDictionaryExtended.transformGroup.foo)).to.be.true;
    expect(typeof StyleDictionaryExtended.transformGroup.foo[0]).to.equal('string');
    expect(StyleDictionaryExtended.transformGroup.foo[0]).to.equal('size/px');
  });

  it('should properly pass the registered format to instances', async () => {
    const SDE2 = await StyleDictionaryExtended.extend({});
    expect(Array.isArray(SDE2.transformGroup.foo)).to.be.true;
    expect(typeof SDE2.transformGroup.foo[0]).to.equal('string');
    expect(SDE2.transformGroup.foo[0]).to.equal('size/px');
  });
});
