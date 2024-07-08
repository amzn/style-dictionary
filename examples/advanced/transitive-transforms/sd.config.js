import StyleDictionary from 'style-dictionary';
import { usesReferences } from 'style-dictionary/utils';
import Color from 'colorjs.io';

const colorTransform = (token) => {
  const { value, modify = [] } = token;

  // This assumes "hex" format, if you want to support { h, s, l } format you have to do
  // `new Color('hsl', [value.h, value.s, value.l]);`
  const color = new Color(value);

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

    switch (type) {
      case 'lighten': {
        const lightness = color.hsl.l;
        const difference = 100 - lightness;
        const newLightness = Math.min(100, lightness + difference * amount);
        color.set('hsl.l', newLightness);
        break;
      }
      case 'transparentize':
        color.alpha = Math.max(0, Math.min(1, Number(amount)));
        break;
    }
  });

  return color.to('srgb').toString({ format: 'hex' });
};

export default {
  // This will match any files ending in json or json5
  // I am using json5 here so I can add comments in the token files for reference
  source: [`tokens/**/*.@(json|json5)`],

  // I am directly defining transforms here
  // This would work if you were to call StyleDictionary.registerTransform() as well
  hooks: {
    transforms: {
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
      'color/css': {
        ...StyleDictionary.hooks.transforms[`color/css`],
        transitive: true,
      },
    },
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
