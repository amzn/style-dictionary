const { isColor } = require("./matcher");

module.exports = {
  cssVarsPlugin: ({ dictionary }) => {
    const tokens = dictionary.allTokens.filter((token) => isColor(token));
    const vars = tokens
      .map((token) => `'--${token.name}': '${token.value}'`)
      .join(",\n      ");
    return `const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addBase }) {
  addBase({
    ':root': {
      ${vars}
    }
  });
});`;
  },
  themeColors: ({ dictionary }) => {
    const tokens = dictionary.allTokens.filter((token) => isColor(token));
    const theme = tokens
      .map(
        (token) =>
          `  '${token.name}': 'rgb(var(--${token.name}) / <alpha-value>)'`
      )
      .join(",\n");
    return `module.exports = {\n${theme}\n};`;
  },
  preset: () => {
    return `const themeColors = require('./themeColors');
const cssVarsPlugin = require('./cssVarsPlugin');

module.exports = {
  theme: {
    extend: {
      colors: {
        ...themeColors,
      },
    },
  },
  plugins: [cssVarsPlugin],
};
`;
  },
};
