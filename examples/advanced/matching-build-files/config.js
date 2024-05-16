import StyleDictionary from 'style-dictionary';
import tokens from './tokens/index.js';

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    'esm/category': {
      buildPath: 'build/js/esm/',
      transforms: ['attribute/cti', 'name/camel', 'size/px', 'color/hex'],
      files: tokens.map((tokenSet) => ({
        destination: `${tokenSet}.js`,
        format: 'javascript/es6',
        filter: {
          attributes: {
            category: tokenSet,
          },
        },
      })),
    },
    'esm/index': {
      buildPath: 'build/js/esm/',
      transforms: ['attribute/cti', 'name/camel', 'size/px', 'color/hex'],
      files: [
        {
          destination: `index.js`,
          format: 'javascript/es6',
        },
      ],
    },
    'cjs/category': {
      buildPath: 'build/js/cjs/',
      transforms: ['attribute/cti', 'name/camel', 'size/px', 'color/hex'],
      files: tokens.map((tokenSet) => ({
        destination: `${tokenSet}.js`,
        format: 'custom/cjsmodule',
        filter: {
          attributes: {
            category: tokenSet,
          },
        },
      })),
    },
    'cjs/index': {
      buildPath: 'build/js/cjs/',
      transforms: ['attribute/cti', 'name/camel', 'size/px', 'color/hex'],
      files: [
        {
          destination: `index.js`,
          format: 'custom/cjsmodule',
        },
      ],
    },

    // Web output in scss format
    scss: {
      transformGroup: 'scss',
      buildPath: `build/scss/`,
      files: [
        {
          destination: `tokens.scss`,
          format: 'scss/variables',
        },
      ],
    },
    // Web output in scss partialformat
    'scss/category': {
      transformGroup: 'scss',
      buildPath: `build/scss/`,
      files: tokens.map((tokenSet) => ({
        destination: `_${tokenSet}.scss`,
        format: 'scss/variables',
        filter: {
          attributes: {
            category: tokenSet,
          },
        },
      })),
    },
  },
};

StyleDictionary.registerFormat({
  name: 'custom/cjsmodule',
  format: function ({ dictionary }) {
    return `module.exports = {${dictionary.allTokens.map(
      (token) => `\n\t${token.name}: "${token.value}"`,
    )}\n};`;
  },
});
