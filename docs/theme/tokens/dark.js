import { core, gray, lch, hue } from './core.js';
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
    accent: {
      low: { $value: '{color.teal.low}' },
      _: { $value: '{color.teal._}' },
      high: { $value: '{color.teal.high}' },
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
          active: { $value: '{color.yellow.low}', modify: { alpha: 0.4 } },
          inactive: { $value: '{color.yellow.low}', modify: { alpha: 0.2 } },
        },
        secondary: {
          active: { $value: '{color.blue.low}', modify: { alpha: 0.4 } },
          inactive: { $value: '{color.blue.low}', modify: { alpha: 0.2 } },
        },
      },
    },
    border: {
      primary: { $value: '{color.gray.500}' },
      secondary: { $value: '{color.gray.400}' },
      tertiary: { $value: '{color.gray.300}' },
      focus: { $value: '{color.pink.low}', modify: { alpha: 0.4 } },
      active: { $value: '{color.pink.low}', modify: { alpha: 0.8 } },
      success: { $value: '{color.green.low}', modify: { alpha: 0.8 } },
      danger: { $value: '{color.red.low}', modify: { alpha: 0.8 } },
      warning: { $value: '{color.orange.low}', modify: { alpha: 0.8 } },
      info: { $value: '{color.teal.low}', modify: { alpha: 0.8 } },
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
          inactive: { $value: '{color.teal.low}', modify: { alpha: 0.8 } },
        },
        secondary: {
          active: { $value: '{color.pink.low}' },
          inactive: { $value: '{color.pink.low}', modify: { alpha: 0.8 } },
        },
      },

      code: {
        1: { $value: '{color.red.high}' },
        2: { $value: '{color.orange.high}' },
        3: { $value: '{color.yellow.high}' },
        4: { $value: '{color.lime.high}' },
        5: { $value: '{color.green.high}' },
        6: { $value: '{color.teal.high}' },
        7: { $value: '{color.blue.high}' },
        8: { $value: '{color.purple.high}' },
        9: { $value: '{color.pink.high}' },

        21: { $value: '{color.amber.high}' },
        22: { $value: '{color.cyan.high}' },
        23: { $value: '{color.sky.high}' },
        24: { $value: '{color.green.high}' },
        25: { $value: '{color.indigo.high}' },
        26: { $value: '{color.fuschia.high}' },
        27: { $value: '{color.violet.high}' },
        28: { $value: '{color.rose.high}' },
        29: { $value: '{color.teal.high}' },
      },
    },
    // text: {
    //   accent: { $value: '{color.accent._}' },
    // },
    ...starlight,
  },
  syntax,
  ...application,
};
