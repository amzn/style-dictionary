import StyleDictionary from 'style-dictionary';
import { usesReferences } from 'style-dictionary/utils';
import chroma from 'chroma-js';

const colorTransform = (token) => {
  const { value, modify = [] } = token;
  let color = chroma(value);

  // defer until reference is resolved
  if (typeof modify === 'string' && usesReferences(modify)) {
    return undefined;
  }

  // iterate over the modify array (see tokens/color.json)
  // and apply each modification in order
  modify.forEach(({ type, amount }) => {
    // defer until reference is resolved
    if (usesReferences(type) || usesReferences(amount)) {
      return undefined;
    }
    // modifier type must match a method name in chromajs
    // https://gka.github.io/chroma.js/
    // chroma methods can be chained, so each time we override the color variable
    // we can still call other chroma methods, similar to
    // chroma(value).brighten(1).darken(1).hex();
    color = color[type](amount);
  });

  return color.hex();
};

export default {
  // This will match any files ending in json or json5
  // I am using json5 here so I can add comments in the token files for reference
  source: [`tokens/**/*.@(json|json5)`],

  // I am directly defining transforms here
  // This would work if you were to call StyleDictionary.registerTransform() as well
  transform: {
    colorTransform: {
      type: `value`,
      // only transforms that have transitive: true will be applied to tokens
      // that alias/reference other tokens
      transitive: true,
      filter: (token) => token.attributes.category === 'color' && token.modify,
      transform: colorTransform,
    },

    // For backwards compatibility, all built-in transforms are not transitive
    // by default. This will make the 'color/css' transform transitive
    'color/css': Object.assign({}, StyleDictionary.transform[`color/css`], {
      transitive: true,
    }),
  },

  platforms: {
    css: {
      transforms: [`attribute/cti`, `name/kebab`, `colorTransform`, `color/css`],
      buildPath: `build/`,
      files: [
        {
          destination: `variables.css`,
          format: `css/variables`,
        },
      ],
    },
  },
};
