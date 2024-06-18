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
import filterTokens from '../dist/esm/filterTokens.mjs';
import { clearOutput } from './__helpers.js';
import flattenTokens from '../dist/esm/utils/flattenTokens.mjs';

const colorRed = {
  value: '#FF0000',
  type: 'color',
  original: {
    value: '#FF0000',
  },
  name: 'color-red',
  path: ['color', 'red'],
};

const colorBlue = {
  value: '#0000FF',
  type: 'color',
  original: {
    value: '#0000FF',
  },
  name: 'color-blue',
  path: ['color', 'blue'],
};

const sizeSmall = {
  value: '2px',
  type: 'dimension',
  original: {
    value: '2px',
  },
  name: 'size-small',
  path: ['size', 'small'],
};

const sizeLarge = {
  value: '4px',
  type: 'dimension',
  original: {
    value: '4px',
  },
  name: 'size-large',
  path: ['size', 'large'],
};

const not_kept = {
  value: 0,
  type: 'number',
  original: {
    value: 0,
  },
  name: 'falsy_values-not_kept',
  path: ['falsy_values', 'not_kept'],
};

const kept = {
  value: 0,
  type: 'number',
  original: {
    value: 0,
  },
  name: 'falsy_values-kept',
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

  it('should return the original dictionary if no filter is provided', async () => {
    expect(dictionary).to.eql(await filterTokens(dictionary));
  });

  it('should work with a filter function', async () => {
    const filter = (property) => property.path.includes('size');
    const filteredDictionary = await filterTokens(dictionary, filter);
    filteredDictionary.allTokens.forEach((property) => {
      expect(property).to.not.equal(colorRed);
      expect(property).not.to.not.equal(colorBlue);
    });
    expect(filteredDictionary.allTokens).to.eql([sizeSmall, sizeLarge]);
    expect(filteredDictionary.tokens).to.have.property('size');
    expect(filteredDictionary.tokens).to.not.have.property('color');
  });

  it('should work with falsy values and a filter function', async () => {
    const filter = (property) => property.path.includes('kept');

    const filteredDictionary = await filterTokens(falsy_dictionary, filter);
    filteredDictionary.allTokens.forEach((property) => {
      expect(property).to.not.equal(not_kept);
    });
    expect(filteredDictionary.allTokens).to.eql([kept]);
    expect(filteredDictionary.tokens).to.have.property('kept');
    expect(filteredDictionary.tokens).to.not.have.property('not_kept');
  });

  it('should work with async filters', async () => {
    const filtered = await filterTokens(dictionary, async (token) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return token.path.includes('size');
    });

    expect(filtered.allTokens.map((token) => token.name)).to.eql(['size-small', 'size-large']);
    expect(filtered.tokens).to.eql({
      size: {
        small: {
          value: '2px',
          type: 'dimension',
          original: { value: '2px' },
          name: 'size-small',
          path: ['size', 'small'],
        },
        large: {
          value: '4px',
          type: 'dimension',
          original: {
            value: '4px',
          },
          name: 'size-large',
          path: ['size', 'large'],
        },
      },
    });
  });

  describe('should throw if', () => {
    it('filter is a string', async () => {
      await expect(filterTokens(dictionary, 'my_filter')).to.eventually.rejectedWith(
        /filter is not a function/,
      );
    });

    it('filter is an object', async () => {
      await expect(filterTokens(dictionary, { type: 'dimension' })).to.eventually.rejectedWith(
        /filter is not a function/,
      );
    });
  });
});
