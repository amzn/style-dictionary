import { isColor } from './matcher.mjs';

export const cssVarsPlugin = ({ dictionary }) => {
  const tokens = dictionary.allTokens.filter((token) => isColor(token));
  const vars = tokens.map((token) => `'--${token.name}': '${token.value}'`).join(',\n      ');
  return `import plugin from 'tailwindcss/plugin';

export default plugin(function ({ addBase }) {
  addBase({
    ':root': {
      ${vars}
    }
  });
});`;
};

export const themeColors = ({ dictionary }) => {
  const tokens = dictionary.allTokens.filter((token) => isColor(token));
  const theme = tokens
    .map((token) => `  '${token.name}': 'rgb(var(--${token.name}) / <alpha-value>)'`)
    .join(',\n');
  return `export default {\n${theme}\n};`;
};

export const preset = () => {
  return `import themeColors from './themeColors.js';
import cssVarsPlugin from './cssVarsPlugin.js';

export default {
  theme: {
    extend: {
      colors: {
        ...themeColors,
      },
    },
  },
  plugins: [cssVarsPlugin],
};`;
};
