import StyleDictionary from 'style-dictionary';
import { formats, transforms, transformGroups } from 'style-dictionary/enums';
import tokens from './tokens/index.js';

const { javascriptEs6, scssVariables } = formats;
const { attributeCti, nameCamel, sizePx, colorHex } = transforms;
const { scss } = transformGroups;

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    'esm/category': {
      buildPath: 'build/js/esm/',
      transforms: [attributeCti, nameCamel, sizePx, colorHex],
      files: tokens.map((tokenSet) => ({
        destination: `${tokenSet}.js`,
        format: javascriptEs6,
        filter: {
          attributes: {
            category: tokenSet,
          },
        },
      })),
    },
    'esm/index': {
      buildPath: 'build/js/esm/',
      transforms: [attributeCti, nameCamel, sizePx, colorHex],
      files: [
        {
          destination: `index.js`,
          format: javascriptEs6,
        },
      ],
    },
    'cjs/category': {
      buildPath: 'build/js/cjs/',
      transforms: [attributeCti, nameCamel, sizePx, colorHex],
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
      transforms: [attributeCti, nameCamel, sizePx, colorHex],
      files: [
        {
          destination: `index.js`,
          format: 'custom/cjsmodule',
        },
      ],
    },

    // Web output in scss format
    scss: {
      transformGroup: scss,
      buildPath: `build/scss/`,
      files: [
        {
          destination: `tokens.scss`,
          format: scssVariables,
        },
      ],
    },
    // Web output in scss partialformat
    'scss/category': {
      transformGroup: scss,
      buildPath: `build/scss/`,
      files: tokens.map((tokenSet) => ({
        destination: `_${tokenSet}.scss`,
        format: scssVariables,
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
