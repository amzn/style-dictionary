const StyleDictionary = require("style-dictionary");
const tokens = require("./tokens");

module.exports = {
  source: ["tokens/**/*.json"],
  platforms: {
    "esm/category": {
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

StyleDictionary.registerFormat({
  name: "custom/cjsmodule",
  formatter: function({ dictionary }) {
    return `module.exports = {${dictionary.allTokens.map(
      (token) => `\n\t${token.name}: "${token.value}"`
    )}\n};`;
  },
});
