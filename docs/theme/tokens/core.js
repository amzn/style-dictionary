const greyHue = 287.73;

export const colorNames = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
];
export const hues = [21.99, 55, 103.94, 124.68, 152.09, 191.23, 249.93, 298, 352.31];
export const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
export const lightness = [0.2, 0.32, 0.41, 0.51, 0.58, 0.64, 0.71, 0.82, 0.88, 0.94, 0.97];
export const chroma = [0.06, 0.13, 0.16, 0.19, 0.22, 0.21, 0.16, 0.1, 0.06, 0.03, 0.01];

export const hue = {
  gray: { $value: '287.73' },

  red: { $value: `10.15` },
  orange: { $value: `27.96` },
  amber: { $value: `39.45` },
  yellow: { $value: `50.09` },
  lime: { $value: `84.45` },
  // green: { $value: `142.09` },
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

export const lch = Object.entries(hue).reduce((acc, [key]) => {
  acc[key] = { $value: `{lightness} {chroma} {hue.${key}}` };
  return acc;
}, {});

export const core = Object.entries(hue).reduce((acc, [key]) => {
  acc[key] = {
    high: { $value: `oklch({lch.${key}} / 0.9)` },
    _: { $value: `oklch({lch.${key}} / 0.5)` },
    low: { $value: `oklch({lch.${key}} / 0.1)` },
  };
  return acc;
}, {});

export const gray = {
  950: { $value: `oklch(18% 0.02 ${greyHue})` },
  900: { $value: `oklch(20% 0.03 ${greyHue})` },
  800: { $value: `oklch(24% 0.03 ${greyHue})` },
  700: { $value: `oklch(30% 0.03 ${greyHue})` },
  600: { $value: `oklch(36% 0.039 ${greyHue})` },
  500: { $value: `oklch(44% 0.032 ${greyHue})` },
  400: { $value: `oklch(55% 0.032 ${greyHue})` },
  300: { $value: `oklch(78.2% 0.005 ${greyHue})` },
  200: { $value: `oklch(90.1% 0.005 ${greyHue})` },
  100: { $value: `oklch(95.6% 0.005 ${greyHue})` },
  50: { $value: `oklch(99.7% 0 ${greyHue})` },
};
