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
import formats from '../../lib/common/formats.js';
import createDictionary from '../../lib/utils/createDictionary.js';
import createFormatArgs from '../../lib/utils/createFormatArgs.js';

const tokens = {
  size: {
    font: {
      small: {
        value: '12rem',
        original: {
          value: '12px',
        },
        name: 'size-font-small',
        attributes: {
          category: 'size',
          type: 'font',
          item: 'small',
        },
        path: ['size', 'font', 'small'],
      },
      large: {
        value: '18rem',
        original: {
          value: '18px',
        },
        name: 'size-font-large',
        attributes: {
          category: 'size',
          type: 'font',
          item: 'large',
        },
        path: ['size', 'font', 'large'],
      },
    },
  },
  color: {
    base: {
      red: {
        value: '#ff0000',
        comment: 'comment',
        original: {
          value: '#FF0000',
          comment: 'comment',
        },
        name: 'color-base-red',
        attributes: {
          category: 'color',
          type: 'base',
          item: 'red',
        },
        path: ['color', 'base', 'red'],
      },
    },
    white: {
      value: '#ffffff',
      original: {
        value: '#ffffff',
      },
      name: 'color-white',
      attributes: {
        category: 'color',
        type: 'white',
      },
      path: ['color', 'white'],
    },
  },
};

const customTokens = {
  backgroundColor: {
    secondary: {
      name: 'backgroundColorSecondary',
      value: '#F2F3F4',
      attributes: {
        category: 'backgroundColor',
      },
    },
  },
  fontColor: {
    primary: {
      name: 'fontColorPrimary',
      value: '#000000',
      attributes: {
        category: 'fontColor',
      },
    },
  },
};

const format = formats['android/resources'];
const file = {
  destination: '__output/',
  format: 'android/resources',
};

const dictionary = createDictionary({ tokens });
const customDictionary = createDictionary({ tokens: customTokens });

describe('formats', () => {
  describe(`android/resources`, () => {
    it('should match default snapshot', async () => {
      await expect(
        format(
          createFormatArgs({
            dictionary,
            file,
            platform: {},
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });

    it('with resourceType override should match snapshot', async () => {
      const file = { resourceType: 'dimen' };
      await expect(
        format(
          createFormatArgs({
            dictionary,
            file,
            platform: {},
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });

    it('with resourceMap override should match snapshot', async () => {
      const file = {
        resourceMap: {
          color: 'color',
          fontColor: 'color',
          backgroundColor: 'color',
        },
      };
      await expect(
        format(
          createFormatArgs({
            dictionary: customDictionary,
            file,
            platform: {},
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });
  });
});
