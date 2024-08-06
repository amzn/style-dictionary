import { lch, core, gray, hue, fontCodeColors } from './core.js';
import application from './application/index.js';
import { syntax } from './syntax/index.js';
import { starlight } from './starlight.js';

export const lightTokens = {
  lightness: { $value: '0.35' },
  chroma: { $value: '0.35' },
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
          active: { $value: '{color.teal._}' },
          inactive: { $value: '{color.teal._}' },
        },
        tertiary: {
          active: { $value: '{color.purple._}' },
          inactive: { $value: '{color.purple._}' },
        },
      },

      highlight: {
        primary: {
          active: { $value: '{color.yellow._}' },
          inactive: { $value: '{color.yellow._}' },
        },
        secondary: {
          active: { $value: '{color.blue._}' },
          inactive: { $value: '{color.blue._}' },
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
          inactive: { $value: '{color.teal.high}' },
        },
        secondary: {
          active: { $value: '{color.pink.high}' },
          inactive: { $value: '{color.pink.high}' },
        },
      },

      code: fontCodeColors,
    },
    ...starlight,
  },
  syntax,
  ...application,
};
