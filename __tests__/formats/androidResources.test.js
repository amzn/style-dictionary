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
import createFormatArgs from '../../lib/utils/createFormatArgs.js';
import flattenTokens from '../../lib/utils/flattenTokens.js';

const tokens = {
  size: {
    font: {
      small: {
        value: '12rem',
        type: 'fontSize',
        original: {
          value: '12px',
        },
        name: 'size-font-small',
        path: ['size', 'font', 'small'],
      },
      large: {
        value: '18rem',
        type: 'fontSize',
        original: {
          value: '18px',
        },
        name: 'size-font-large',
        path: ['size', 'font', 'large'],
      },
    },
  },
  color: {
    base: {
      red: {
        value: '#ff0000',
        type: 'color',
        comment: 'comment',
        original: {
          value: '#FF0000',
          comment: 'comment',
        },
        name: 'color-base-red',
        path: ['color', 'base', 'red'],
      },
    },
    white: {
      value: '#ffffff',
      type: 'color',
      original: {
        value: '#ffffff',
      },
      name: 'color-white',
      path: ['color', 'white'],
    },
  },
};

const customTokens = {
  backgroundColor: {
    secondary: {
      name: 'backgroundColorSecondary',
      value: '#F2F3F4',
      type: 'color',
      original: {
        value: '#F2F3F4',
        type: 'color',
      },
    },
  },
  fontColor: {
    primary: {
      name: 'fontColorPrimary',
      value: '#000000',
      type: 'color',
      original: {
        value: '#000000',
        type: 'color',
      },
    },
  },
};

const fontAndTextCaseTokens = {
  typo: {
    headline: {
      name: 'headline-font',
      value: '@font/comic_sans_bold',
      type: 'fontFamily',
      original: {
        value: '@font/comic_sans_bold',
        type: 'fontFamily',
      },
    },
    copytext: {
      name: 'copytext-font',
      value: '@font/comic_sans',
      type: 'fontFamily',
      original: {
        value: '@font/comic_sans',
        type: 'fontFamily',
      },
    },
  },
  textCase: {
    headline: {
      name: 'headline-text-case',
      value: 'true',
      type: 'textCase',
      original: {
        value: 'true',
        type: 'textCase',
      },
    },
    copytext: {
      name: 'copytext-text-case',
      value: 'false',
      type: 'textCase',
      original: {
        value: 'none',
        type: 'textCase',
      },
    },
  },
};

const format = formats['android/resources'];
const file = {
  destination: '__output/',
  format: 'android/resources',
};

describe('formats', () => {
  describe(`android/resources`, () => {
    it('should match default snapshot', async () => {
      const f = await format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      await expect(f).to.matchSnapshot();
    });

    it('with resourceType override should match snapshot', async () => {
      const file = { options: { resourceType: 'dimen' } };
      const f = await format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      await expect(f).to.matchSnapshot();
    });

    it('with resourceMap override should match snapshot', async () => {
      const file = {
        options: {
          resourceMap: {
            color: 'color',
            fontColor: 'color',
            backgroundColor: 'color',
          },
        },
      };
      const f = await format(
        createFormatArgs({
          dictionary: { tokens: customTokens, allTokens: flattenTokens(customTokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      await expect(f).to.matchSnapshot();
    });

    it('with type & textCase should match snapshot', async () => {
      const f = await format(
        createFormatArgs({
          dictionary: { fontAndTextCaseTokens, allTokens: flattenTokens(fontAndTextCaseTokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      await expect(f).to.matchSnapshot();
    });
  });
});
