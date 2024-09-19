# Tailwind preset

Builds [Tailwind preset](https://tailwindcss.com/docs/presets#creating-a-preset) from tokens.

## Building the preset

Run `npm run build-tokens` to generate these files in `build/tailwind`:

### cssVarPlugin.js

A [Tailwind plugin](https://tailwindcss.com/docs/plugins) for registering new [base styles](https://tailwindcss.com/docs/plugins#adding-base-styles).

The [rgbChannels](./config/transform.js) transform removes the color space function for compatability with [Tailwind's opacity modifier syntax](https://tailwindcss.com/docs/text-color#changing-the-opacity).

```js
import plugin from 'tailwindcss/plugin.js';

export default plugin(function ({ addBase }) {
	addBase({
		':root': {
			'--sd-text-small': '0.75',
			'--sd-text-base': '46 46 70',
			'--sd-text-secondary': '100 100 115',
			'--sd-text-tertiary': '129 129 142',
			'--sd-text-neutral': '0 0 0 / 0.55',
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

Tailwind theme color values that reference the plugin [css vars](https://tailwindcss.com/docs/customizing-colors#using-css-variables).

```js
export default {
	'sd-text-base': 'rgb(var(--sd-text-base))',
	'sd-text-secondary': 'rgb(var(--sd-text-secondary))',
	'sd-text-tertiary': 'rgb(var(--sd-text-tertiary))',
	'sd-text-neutral': 'rgb(var(--sd-text-neutral))',
	'sd-theme': 'rgb(var(--sd-theme))',
	'sd-theme-light': 'rgb(var(--sd-theme-light))',
	'sd-theme-dark': 'rgb(var(--sd-theme-dark))',
	'sd-theme-secondary': 'rgb(var(--sd-theme-secondary))',
	'sd-theme-secondary-dark': 'rgb(var(--sd-theme-secondary-dark))',
	'sd-theme-secondary-light': 'rgb(var(--sd-theme-secondary-light))',
};
```

### preset.js

[Tailwind preset](https://tailwindcss.com/docs/presets) file that imports the colors and plugin.

```js
import themeColors from './themeColors.js';
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
};
```

## Building the CSS

The [Tailwind preset](https://tailwindcss.com/docs/presets#creating-a-preset) is imported from the build directory in `tailwind.config.js`.

```js
import tailwindPreset from './build/tailwind/preset.js';

/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {},
	},
	presets: [tailwindPreset],
	content: ['./demo/**/*.{html,js}'],
	plugins: [],
};
```

Run `npm run build-css` to watch the `demo/index.html` file for changes -- any Tailwind classes used will be compiled into `demo/output.css`.
