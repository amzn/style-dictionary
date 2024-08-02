export const hue = {
  gray: { $value: '287.73' },
  red: { $value: `10.15` },
  orange: { $value: `27.96` },
  amber: { $value: `39.45` },
  yellow: { $value: `50.09` },
  lime: { $value: `84.45` },
  green: { $value: `160.09` },
  teal: { $value: `174.23` },
  cyan: { $value: `191.09` },
  sky: { $value: `201.30` },
  blue: { $value: `221.99` },
  indigo: { $value: `243.10` },
  violet: { $value: `262.10` },
  purple: { $value: `278.5` },
  fuschia: { $value: `293.40` },
  pink: { $value: `333.50` },
  rose: { $value: `349.70` },
};

export const lch = Object.keys(hue).reduce((acc, key) => {
  acc[/** @type {keyof hue} */ (key)] = { $value: `{lightness} {chroma} {hue.${key}}` };
  return acc;
}, /** @type {typeof hue} */ ({}));

/**
 * @typedef {Record<keyof hue, Record<'high'|'_'|'low', {$value: string}>>} core
 */
export const core = Object.keys(hue).reduce((acc, key) => {
  acc[/** @type {keyof hue} */ (key)] = {
    high: { $value: `oklch({lch.${key}} / 0.9)` },
    _: { $value: `oklch({lch.${key}} / 0.5)` },
    low: { $value: `oklch({lch.${key}} / 0.1)` },
  };
  return acc;
}, /** @type {core} */ ({}));

export const gray = {
  950: { $value: `oklch(18% 0.02 {hue.gray})` },
  900: { $value: `oklch(20% 0.03 {hue.gray})` },
  800: { $value: `oklch(24% 0.03 {hue.gray})` },
  700: { $value: `oklch(30% 0.03 {hue.gray})` },
  600: { $value: `oklch(36% 0.039 {hue.gray})` },
  500: { $value: `oklch(44% 0.032 {hue.gray})` },
  400: { $value: `oklch(55% 0.032 {hue.gray})` },
  300: { $value: `oklch(78.2% 0.005 {hue.gray})` },
  200: { $value: `oklch(90.1% 0.005 {hue.gray})` },
  100: { $value: `oklch(96.5% 0.005 {hue.gray})` },
  50: { $value: `oklch(99.7% 0 {hue.gray})` },
};

export const fontCodeColors = {
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
};
