import { lch, core, gray, hue } from './core.js';
import application from './application/index.js';
import { syntax } from './syntax/index.js';
import { starlight } from './starlight.js';

export const lightTokens = {
  lightness: { $value: '0.51' },
  chroma: { $value: '0.2' },
  hue,
  lch,
  color: {
    $type: 'color',
    ...core,
    gray: {
      ...gray,
      7: { $value: '{color.gray.100}' },
      6: { $value: '{color.gray.200}' },
      5: { $value: '{color.gray.300}' },
      4: { $value: '{color.gray.500}' },
      3: { $value: '{color.gray.600}' },
      2: { $value: '{color.gray.800}' },
      1: { $value: '{color.gray.950}' },
    },
    white: { $value: '{color.gray.950}' },
    black: { $value: '#fff' },
    neutral: {
      1000: { $value: '{color.gray.950}' },
      0: { $value: '#fff' },
    },
    accent: {
      low: { $value: '{color.teal.low}' },
      _: { $value: '{color.teal._}' },
      high: { $value: '{color.teal.high}' },
    },
    background: {
      primary: { $value: '#FFFFFF' },
      secondary: { $value: '{color.gray.50}' },
      tertiary: { $value: '{color.gray.100}' },
      quaternary: { $value: '{color.gray.200}' },

      badge: { $value: '{color.teal.low}' },
      debug: { $value: '{color.purple.low}' },

      danger: { $value: '{color.red.low}' },
      warning: { $value: '{color.orange.low}' },
      success: { $value: '{color.green.low}' },
      info: { $value: '{color.teal.low}' },

      interactive: {
        base: { $value: '{color.pink.high}' },
        hover: { $value: '{color.pink.high}' },
      },

      drop: { $value: '{color.background.selection.secondary.active}' },

      selection: {
        primary: {
          active: { $value: 'oklch({lch.pink} / 0.3)' },
          inactive: { $value: 'oklch({lch.pink} / 0.2)' },
        },
        secondary: {
          active: { $value: '{color.teal._}', modify: { alpha: 0.4 } },
          inactive: { $value: '{color.teal._}', modify: { alpha: 0.2 } },
        },
        tertiary: {
          active: { $value: '{color.purple._}', modify: { alpha: 0.4 } },
          inactive: { $value: '{color.purple._}', modify: { alpha: 0.2 } },
        },
      },

      highlight: {
        primary: {
          active: { $value: '{color.yellow._}', modify: { alpha: 0.4 } },
          inactive: { $value: '{color.yellow._}', modify: { alpha: 0.2 } },
        },
        secondary: {
          active: { $value: '{color.blue._}', modify: { alpha: 0.4 } },
          inactive: { $value: '{color.blue._}', modify: { alpha: 0.2 } },
        },
      },
    },
    border: {
      primary: { $value: '{color.gray.300}' },
      secondary: { $value: '{color.gray.200}' },
      tertiary: { $value: '{color.gray.100}' },
      focus: { $value: '{color.pink._}' },
      active: { $value: '{color.pink._}' },
      success: { $value: '{color.green._}' },
      danger: { $value: '{color.red._}' },
      warning: { $value: '{color.orange._}' },
      info: { $value: '{color.teal._}' },
    },
    font: {
      primary: { $value: '{color.gray.950}' },
      secondary: { $value: '{color.gray.800}' },
      tertiary: { $value: '{color.gray.600}' },
      quaternary: { $value: '{color.gray.500}' },
      ghost: { $value: '{color.gray.400}' },
      inverse: { $value: '{color.background.primary}' },

      active: { $value: '{color.pink.high}' },
      success: { $value: '{color.green.high}' },
      danger: { $value: '{color.red.high}' },
      warning: { $value: '{color.orange.high}' },
      info: { $value: '{color.teal.high}' },

      link: {
        primary: {
          active: { $value: '{color.teal.high}' },
          inactive: { $value: '{color.teal.high}', modify: { alpha: 0.8 } },
        },
        secondary: {
          active: { $value: '{color.pink.high}' },
          inactive: { $value: '{color.pink.high}', modify: { alpha: 0.8 } },
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
    ...starlight,
  },
  syntax,
  ...application,
};
