import { isColor } from './filter.js';

/**
 * Exports tailwind plugin for declaring root CSS vars
 * @see https://tailwindcss.com/docs/plugins#overview
 */
export function cssVarsPlugin({ dictionary }) {
	const vars = dictionary.allTokens
		.map((token) => {
			const value = token?.$value || token?.value;
			return `'--${token.name}': '${value}'`;
		})
		.join(',\n\t\t\t');

	return `import plugin from 'tailwindcss/plugin.js';

export default plugin(function ({ addBase }) {
\taddBase({
\t\t':root': {
\t\t\t${vars},
\t\t},
\t});
});\n`;
}

/**
 * Exports theme color definitions
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
export function themeColors({ dictionary, options }) {
	const tokens = dictionary.allTokens.filter((token) => isColor(token, options));

	const theme = tokens
		.map((token) => {
			return `\t'${token.name}': 'rgb(var(--${token.name}))'`;
		})
		.join(',\n');

	return `export default {\n${theme},\n};\n`;
}

/**
 * Exports tailwind preset
 * @see https://tailwindcss.com/docs/presets
 */
export function preset() {
	return `import themeColors from './themeColors.js';
import cssVarsPlugin from './cssVarsPlugin.js';

export default {
\ttheme: {
\t\textend: {
\t\t\tcolors: {
\t\t\t\t...themeColors, // <-- theme colors defined here
\t\t\t},
\t\t},
\t},
\tplugins: [cssVarsPlugin], // <-- plugin imported here
};\n`;
}
