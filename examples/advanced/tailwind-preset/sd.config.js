const StyleDictionary = require("style-dictionary");
const { spaceSeparatedRgb } = require("./src/transformer");
const { cssVarsPlugin, themeColors, preset } = require("./src/formatter");
const { isColor } = require("./src/matcher");

StyleDictionary.registerTransform({
  name: "color/space-separated-rgb",
  type: "value",
  matcher: isColor,
  transformer: spaceSeparatedRgb,
});

StyleDictionary.registerTransformGroup({
  name: "color/tailwind",
  transforms: [
    "attribute/cti",
    "name/cti/kebab",
    "color/rgb",
    "color/space-separated-rgb",
  ],
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
