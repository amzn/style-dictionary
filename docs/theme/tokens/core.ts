const greyHue = 287.73;
const redHue = 21.99;
const orangeHue = 60.12;
const yellowHue = 103.94;
const limeHue = 124.68;
const greenHue = 152.09;
const tealHue = 191.23;
const blueHue = 249.93;
const purpleHue = 298.45;
const pinkHue = 352.31;

const lightness = [0.4, 0.5, 0.82, 0.9];

const chroma = [0.08, 0.16, 0.16, 0.08];

export const core = {
  grey: {
    '100': { $value: `oklch(18% 0.03 ${greyHue})` },
    '90': { $value: `oklch(20% 0.03 ${greyHue})` },
    '80': { $value: `oklch(26% 0.039 ${greyHue})` },
    '60': { $value: `oklch(30% 0.032 ${greyHue})` },
    '40': { $value: `oklch(41% 0.032 ${greyHue})` },
    '20': { $value: `oklch(88.2% 0.005 ${greyHue})` },
    '10': { $value: `oklch(92.1% 0.005 ${greyHue})` },
    '5': { $value: `oklch(95.6% 0.005 ${greyHue})` },
    '0': { $value: `oklch(99.7% 0 ${greyHue})` },
  },

  red: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${redHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${redHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${redHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${redHue})` },
  },

  orange: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${orangeHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${orangeHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${orangeHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${orangeHue})` },
  },

  yellow: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${yellowHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${yellowHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${yellowHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${yellowHue})` },
  },

  lime: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${limeHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${limeHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${limeHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${limeHue})` },
  },

  green: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${greenHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${greenHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${greenHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${greenHue})` },
  },

  teal: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${tealHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${tealHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${tealHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${tealHue})` },
  },

  blue: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${blueHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${blueHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${blueHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${blueHue})` },
  },

  purple: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${purpleHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${purpleHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${purpleHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${purpleHue})` },
  },

  pink: {
    darker: { $value: `oklch(${lightness[0]} ${chroma[0]} ${pinkHue})` },
    dark: { $value: `oklch(${lightness[1]} ${chroma[1]} ${pinkHue})` },
    light: { $value: `oklch(${lightness[2]} ${chroma[2]} ${pinkHue})` },
    lighter: { $value: `oklch(${lightness[3]} ${chroma[3]} ${pinkHue})` },
  },
};
