import StyleDictionary from 'style-dictionary';
import { isColor } from './config/filter.js';
import { cssVarsPlugin, preset, themeColors } from './config/format.js';
import { rgbChannels } from './config/transform.js';

StyleDictionary.registerTransform({
	name: 'color/rgb-channels',
	type: 'value',
	filter: isColor,
	transform: rgbChannels,
});

StyleDictionary.registerTransformGroup({
	name: 'tailwind',
	transforms: ['name/kebab', 'color/rgb', 'color/rgb-channels'],
});

StyleDictionary.registerFormat({
	name: 'tailwind/css-vars-plugin',
	format: cssVarsPlugin,
});

StyleDictionary.registerFormat({
	name: 'tailwind/theme-colors',
	format: themeColors,
});

StyleDictionary.registerFormat({
	name: 'tailwind/preset',
	format: preset,
});

export default {
	source: ['./tokens/**/*.json'],
	platforms: {
		tailwindPreset: {
			buildPath: 'build/tailwind/',
			transformGroup: 'tailwind',
			files: [
				{
					destination: 'cssVarsPlugin.js',
					format: 'tailwind/css-vars-plugin',
				},
				{
					destination: 'themeColors.js',
					format: 'tailwind/theme-colors',
				},
				{
					destination: 'preset.js',
					format: 'tailwind/preset',
				},
			],
		},
	},
};
