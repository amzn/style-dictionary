import createDictionary from '../../lib/utils/createDictionary.js';

const colorTokenName = 'color-base-red-400';
const colorTokenValue = '#EF5350';

const colorTokens = {
  color: {
    base: {
      red: {
        400: {
          name: colorTokenName,
          value: colorTokenValue,
          original: {
            value: colorTokenValue,
          },
          attributes: {
            category: 'color',
            type: 'base',
            item: 'red',
            subitem: '400',
          },
          path: ['color', 'base', 'red', '400'],
        },
      },
    },
  },
};

const iconTokenName = 'content-icon-email';
const iconTokenValue = "'\\E001'";
const itemClass = '3d_rotation';

const iconTokens = {
  content: {
    icon: {
      email: {
        name: iconTokenName,
        value: iconTokenValue,
        original: {
          value: iconTokenValue,
        },
        attributes: {
          category: 'content',
          type: 'icon',
          item: itemClass,
        },
        path: ['content', 'icon', 'email'],
      },
    },
  },
};

export const colorDictionary = createDictionary(colorTokens);
export const iconDictionary = createDictionary(iconTokens);
