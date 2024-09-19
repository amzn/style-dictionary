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
