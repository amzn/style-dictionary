# Tailwind preset

Builds [Tailwind preset](https://tailwindcss.com/docs/presets#creating-a-preset) from tokens.

## Building the preset

Run `npm run build-tokens` to generate files in `build/tailwind/`.

### cssVarPlugin.js

A [Tailwind plugin](https://tailwindcss.com/docs/plugins) for registering new base styles.

Token values are transformed into space-separated RGB values for compatability with [Tailwind's opacity modifier syntax](https://tailwindcss.com/docs/customizing-colors#using-css-variables).

```js
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addBase }) {
  addBase({
    ':root': {
      '--sd-text-base': '46 46 70',
      '--sd-text-secondary': '100 100 115',
      '--sd-text-tertiary': '129 129 142',
      '--sd-theme': '31 197 191',
      '--sd-theme-light': '153 235 226',
      '--sd-theme-dark': '0 179 172',
      '--sd-theme-secondary': '106 80 150',
      '--sd-theme-secondary-dark': '63 28 119',
      '--sd-theme-secondary-light': '196 178 225',
    },
  });
});
```

### themeColors.js

Tailwind theme color values that reference the plugin css vars.

```js
module.exports = {
  'sd-text-base': 'rgb(var(--sd-text-base) / <alpha-value>)',
  'sd-text-secondary': 'rgb(var(--sd-text-secondary) / <alpha-value>)',
  'sd-text-tertiary': 'rgb(var(--sd-text-tertiary) / <alpha-value>)',
  'sd-theme': 'rgb(var(--sd-theme) / <alpha-value>)',
  'sd-theme-light': 'rgb(var(--sd-theme-light) / <alpha-value>)',
  'sd-theme-dark': 'rgb(var(--sd-theme-dark) / <alpha-value>)',
  'sd-theme-secondary': 'rgb(var(--sd-theme-secondary) / <alpha-value>)',
  'sd-theme-secondary-dark': 'rgb(var(--sd-theme-secondary-dark) / <alpha-value>)',
  'sd-theme-secondary-light': 'rgb(var(--sd-theme-secondary-light) / <alpha-value>)',
};
```

### preset.js

[Tailwind preset](https://tailwindcss.com/docs/presets) file that imports the colors and plugin.

```js
const themeColors = require('./themeColors');
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
```

## Building the CSS

The [Tailwind preset](https://tailwindcss.com/docs/presets#creating-a-preset) is imported from the build directory in `tailwind.config.js`.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./build/tailwind/preset')], // <-- preset imported here
  content: ['./demo/**/*.{html,js}'], // <-- files to watch
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Run `npm run build-css` to watch the `demo/index.html` file for changes -- any Tailwind classes used will be compiled into `demo/output.css`.
