const StyleDictionary = require("style-dictionary");
const { rgbChannels } = require("./config/transformer");
const { cssVarsPlugin, themeColors, preset } = require("./config/formatter");
const { isColor } = require("./config/matcher");

// Split rgb value into space-separated channels
// for opacity modifier syntax
// https://tailwindcss.com/docs/customizing-colors#using-css-variables
StyleDictionary.registerTransform({
  name: "color/rgb-channels",
  type: "value",
  matcher: isColor,
  transformer: rgbChannels,
});

StyleDictionary.registerTransformGroup({
  name: "color/tailwind",
  transforms: ["name/cti/kebab", "color/rgb", "color/rgb-channels"],
});

StyleDictionary.registerFormat({
  name: "tailwind/css-vars-plugin",
  formatter: cssVarsPlugin,
});

StyleDictionary.registerFormat({
  name: "tailwind/theme-colors",
  formatter: themeColors,
});

StyleDictionary.registerFormat({
  name: "tailwind/preset",
  formatter: preset,
});

module.exports = {
  source: ["./tokens/**/*.json"],
  platforms: {
    tailwindPreset: {
      transformGroup: "color/tailwind",
      buildPath: "build/tailwind/",
      files: [
        {
          destination: "cssVarsPlugin.js",
          format: "tailwind/css-vars-plugin",
        },
        {
          destination: "themeColors.js",
          format: "tailwind/theme-colors",
        },
        {
          destination: "preset.js",
          format: "tailwind/preset",
        },
      ],
    },
  },
};
