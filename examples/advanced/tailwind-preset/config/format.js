import { isColor } from './filter.js';

/**
 * Exports tailwind plugin for declaring root CSS vars
 * @see https://tailwindcss.com/docs/plugins#overview
 */
export const cssVarsPlugin = ({ dictionary, options }) => {
  const vars = dictionary.allTokens
    .map((token) => {
      const value = options.usesDtcg ? token.$value : token.value;
      return `'--${token.name}': '${value}'`;
    })
    .join(',\n      ');

  return `import plugin from 'tailwindcss/plugin';

export default plugin(function ({ addBase }) {
  addBase({
    ':root': {
      ${vars},
    },
  });
});\n`;
};

/**
 * Exports colors as space-separated RGB channels
 */
export const themeColors = ({ dictionary, options }) => {
  const tokens = dictionary.allTokens.filter((token) => isColor(token, options));

  const theme = tokens
    .map((token) => `  '${token.name}': 'rgb(var(--${token.name}) / <alpha-value>)'`)
    .join(',\n');
  return `export default {\n${theme},\n};\n`;
};

/**
 * Exports tailwind preset
 * @see https://tailwindcss.com/docs/presets
 */
export const preset = () => {
  return `import themeColors from './themeColors.js';
import cssVarsPlugin from './cssVarsPlugin.js';

export default {
  theme: {
    extend: {
      colors: {
        ...themeColors, // <-- theme colors defined here
      },
    },
  },
  plugins: [cssVarsPlugin], // <-- plugin imported here
};\n`;
};
