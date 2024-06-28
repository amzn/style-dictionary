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
import filterTokens from '../lib/filterTokens.js';
import { clearOutput } from './__helpers.js';
import flattenTokens from '../lib/utils/flattenTokens.js';

const colorRed = {
  value: '#FF0000',
  original: {
    value: '#FF0000',
  },
  name: 'color-red',
  attributes: { type: 'color' },
  path: ['color', 'red'],
};

const colorBlue = {
  value: '#0000FF',
  original: {
    value: '#0000FF',
  },
  name: 'color-blue',
  attributes: { type: 'color' },
  path: ['color', 'blue'],
};

const sizeSmall = {
  value: '2px',
  original: {
    value: '2px',
  },
  name: 'size-small',
  attributes: { category: 'size' },
  path: ['size', 'small'],
};

const sizeLarge = {
  value: '4px',
  original: {
    value: '4px',
  },
  name: 'size-large',
  attributes: { category: 'size' },
  path: ['size', 'large'],
};

const not_kept = {
  value: 0,
  original: {
    value: 0,
  },
  name: 'falsy_values-not_kept',
  attributes: { category: 'falsy_values' },
  path: ['falsy_values', 'not_kept'],
};

const kept = {
  value: 0,
  original: {
    value: 0,
  },
  name: 'falsy_values-kept',
  attributes: { category: 'falsy_values' },
  path: ['falsy_values', 'kept'],
};

const tokens = {
  color: {
    red: colorRed,
    blue: colorBlue,
  },
  size: {
    small: sizeSmall,
    large: sizeLarge,
  },
};

const falsy_values = {
  kept: kept,
  not_kept: not_kept,
};

const dictionary = {
  tokens,
  allTokens: flattenTokens(tokens),
};

const falsy_dictionary = {
  tokens: falsy_values,
  allTokens: flattenTokens(falsy_values),
};

describe('filterTokens', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should return the original dictionary if no filter is provided', () => {
    expect(dictionary).to.eql(filterTokens(dictionary));
  });

  it('should work with a filter function', () => {
    const filter = (property) => property.path.includes('size');
    const filteredDictionary = filterTokens(dictionary, filter);
    filteredDictionary.allTokens.forEach((property) => {
      expect(property).to.not.equal(colorRed);
      expect(property).not.to.not.equal(colorBlue);
    });
    expect(filteredDictionary.allTokens).to.eql([sizeSmall, sizeLarge]);
    expect(filteredDictionary.tokens).to.have.property('size');
    expect(filteredDictionary.tokens).to.not.have.property('color');
  });

  it('should work with falsy values and a filter function', () => {
    const filter = (property) => property.path.includes('kept');

    const filteredDictionary = filterTokens(falsy_dictionary, filter);
    filteredDictionary.allTokens.forEach((property) => {
      expect(property).to.not.equal(not_kept);
    });
    expect(filteredDictionary.allTokens).to.eql([kept]);
    expect(filteredDictionary.tokens).to.have.property('kept');
    expect(filteredDictionary.tokens).to.not.have.property('not_kept');
  });

  describe('should throw if', () => {
    it('filter is a string', () => {
      expect(() => {
        filterTokens(dictionary, 'my_filter');
      }).to.throw(/filter is not a function/);
    });
    it('filter is an object', () => {
      expect(() => {
        filterTokens(dictionary, { attributes: { category: 'size' } });
      }).to.throw(/filter is not a function/);
    });
  });
});
