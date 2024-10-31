import { core, gray, lch, hue, fontCodeColors } from './core.js';
import application from './application/index.js';
import { syntax } from './syntax/index.js';
import { starlight } from './starlight.js';

export const darkTokens = {
  lightness: { $value: '0.9' },
  chroma: { $value: '0.2' },
  hue,
  lch,
  color: {
    $type: 'color',
    ...core,
    gray: Object.keys(gray)
      .map((k) => parseFloat(k))
      .reverse()
      .reduce(
        (acc, key, i) => {
          acc[key] = Object.values(gray)[i];
          return acc;
        },
        /** @type {Record<number,{ $value: string }>} */ ({
          7: { $value: '{color.gray.50}' },
          6: { $value: '{color.gray.200}' },
          5: { $value: '{color.gray.400}' },
          4: { $value: '{color.gray.500}' },
          3: { $value: '{color.gray.600}' },
          2: { $value: '{color.gray.800}' },
          1: { $value: '{color.gray.950}' },
        }),
      ),
    white: { $value: '#fff' },
    black: { $value: '{color.gray.50}' },
    neutral: {
      1000: { $value: '#fff' },
      0: { $value: '{color.gray.50}' },
    },
    background: {
      primary: { $value: '{color.gray.50}' },
      secondary: { $value: '{color.gray.100}' },
      tertiary: { $value: '{color.gray.200}' },
      quaternary: { $value: '{color.gray.400}' },

      badge: { $value: '{color.teal.low}' },
      debug: { $value: '{color.purple.low}' },

      danger: { $value: '{color.red.low}' },
      warning: { $value: '{color.orange.low}' },
      success: { $value: '{color.green.low}' },
      info: { $value: '{color.teal.low}' },

      interactive: {
        base: { $value: '{color.pink._}' },
        hover: { $value: '{color.pink._}' },
      },

      drop: { $value: '{color.background.selection.secondary.active}' },

      selection: {
        primary: {
          active: { $value: '{color.pink.low}' },
          inactive: { $value: '{color.pink.low}' },
        },
        secondary: {
          active: { $value: '{color.teal.low}' },
          inactive: { $value: '{color.teal.low}' },
        },
        tertiary: {
          active: { $value: '{color.purple.low}' },
          inactive: { $value: '{color.purple.low}' },
        },
      },

      highlight: {
        primary: {
          active: { $value: '{color.yellow.low}' },
          inactive: { $value: '{color.yellow.low}' },
        },
        secondary: {
          active: { $value: '{color.blue.low}' },
          inactive: { $value: '{color.blue.low}' },
        },
      },
    },
    border: {
      primary: { $value: '{color.gray.500}' },
      secondary: { $value: '{color.gray.400}' },
      tertiary: { $value: '{color.gray.300}' },
      focus: { $value: '{color.pink.low}' },
      active: { $value: '{color.pink.low}' },
      success: { $value: '{color.green.low}' },
      danger: { $value: '{color.red.low}' },
      warning: { $value: '{color.orange.low}' },
      info: { $value: '{color.teal.low}' },
    },
    font: {
      primary: { $value: '#FFFFFFEE' },
      secondary: { $value: '#FFFFFFBB' },
      tertiary: { $value: '#FFFFFF99' },
      quaternary: { $value: '#FFFFFF66' },
      ghost: { $value: '#FFFFFF44' },
      inverse: { $value: '{color.background.primary}' },

      active: { $value: '{color.pink.low}' },
      success: { $value: '{color.green.low}' },
      danger: { $value: '{color.red.low}' },
      warning: { $value: '{color.orange.low}' },
      info: { $value: '{color.teal.low}' },

      link: {
        primary: {
          active: { $value: '{color.teal.low}' },
          inactive: { $value: '{color.teal.low}' },
        },
        secondary: {
          active: { $value: '{color.pink.low}' },
          inactive: { $value: '{color.pink.low}' },
        },
      },

      code: fontCodeColors,
    },
    ...starlight,
  },
  syntax,
  ...application,
};
