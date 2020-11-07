const StyleDictionary = require("style-dictionary");
const tokens = require("./properties");

module.exports = {
  source: ["properties/**/*.json"],
  platforms: {
    "esm/category": {
      transformGroup: "js",
      buildPath: "build/js/esm/",
      transforms: ["attribute/cti", "name/cti/camel", "size/px", "color/hex"],
      files: tokens.map((tokenCategory) => ({
        destination: `${tokenCategory}.js`,
        format: "javascript/es6",
        filter: {
          attributes: {
            category: tokenCategory,
          },
        },
      })),
    },
    "esm/index": {
      transformGroup: "js",
      buildPath: "build/js/esm/",
      transforms: ["attribute/cti", "name/cti/camel", "size/px", "color/hex"],
      files: [
        {
          destination: `index.js`,
          format: "javascript/es6",
        },
      ],
    },
    "cjs/category": {
      transformGroup: "js",
      buildPath: "build/js/cjs/",
      transforms: ["attribute/cti", "name/cti/camel", "size/px", "color/hex"],
      files: tokens.map((tokenCategory) => ({
        destination: `${tokenCategory}.js`,
        format: "custom/cjsmodule",
        filter: {
          attributes: {
            category: tokenCategory,
          },
        },
      })),
    },
    "cjs/index": {
      transformGroup: "js",
      buildPath: "build/js/cjs/",
      transforms: ["attribute/cti", "name/cti/camel", "size/px", "color/hex"],
      files: [
        {
          destination: `index.js`,
          format: "custom/cjsmodule",
        },
      ],
    },

    // Web output in scss format
    scss: {
      transformGroup: "scss",
      buildPath: `build/scss/`,
      files: [
        {
          destination: `tokens.scss`,
          format: "scss/variables",
        },
      ],
    },
    // Web output in scss partialformat
    "scss/category": {
      transformGroup: "scss",
      buildPath: `build/scss/`,
      files: tokens.map((tokenCategory) => ({
        destination: `_${tokenCategory}.scss`,
        format: "scss/variables",
        filter: {
          attributes: {
            category: tokenCategory,
          },
        },
      })),
    },
  },
};

StyleDictionary.registerTransform({
  name: "size/pxToPt",
  type: "value",
  matcher: function (prop) {
    return prop.value.match(/[\d.]+px/g);
  },
  transformer: function (prop) {
    return prop.value.replace(/px/g, "pt");
  },
});

StyleDictionary.registerTransform({
  name: "size/pxToDp",
  type: "value",
  matcher: function (prop) {
    return prop.value.match(/[\d.]+px/g);
  },
  transformer: function (prop) {
    return prop.value.replace(/px/g, "dp");
  },
});

StyleDictionary.registerFormat({
  name: "custom/cjsmodule",
  formatter: function (dictionary) {
    return `module.exports = {${dictionary.allProperties.map(
      (prop) => `\n\t${prop.name}: "${prop.value}"`
    )}\n};`;
  },
});
