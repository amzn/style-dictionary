import StyleDictionary from 'style-dictionary';
import { cssVarsPlugin, preset, themeColors } from './config/formatter.js';
import { isColor } from './config/matcher.js';
import { rgbChannels } from './config/transformer.js';

// Register custom transform
StyleDictionary.registerTransform({
  name: 'color/rgb-channels',
  type: 'value',
  matcher: isColor,
  transformer: rgbChannels,
});

// Register transform group using the custom transform
StyleDictionary.registerTransformGroup({
  name: 'color/tailwind',
  transforms: ['name/kebab', 'color/rgb', 'color/rgb-channels'],
});

// Register formats
StyleDictionary.registerFormat({
  name: 'tailwind/css-vars-plugin',
  formatter: cssVarsPlugin,
});

StyleDictionary.registerFormat({
  name: 'tailwind/theme-colors',
  formatter: themeColors,
});

StyleDictionary.registerFormat({
  name: 'tailwind/preset',
  formatter: preset,
});

export default {
  source: ['./tokens/**/*.json'],
  platforms: {
    tailwindPreset: {
      transformGroup: 'color/tailwind',
      buildPath: 'build/tailwind/',
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
