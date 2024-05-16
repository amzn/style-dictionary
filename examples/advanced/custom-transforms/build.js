import StyleDictionary from 'style-dictionary';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Build started...');
console.log('\n==============================================');

// REGISTER THE CUSTOM TRANSFORMS

StyleDictionary.registerTransform({
  name: 'size/px', // notice: the name is an override of an existing predefined method (yes, you can do it)
  type: 'value',
  filter: function (token) {
    // this is an example of a possible filter (based on the "cti" values) to show how a "filter" works
    return token.type === 'fontSize' || token.type === 'dimension';
  },
  transform: function (token) {
    return `${token.value}px`;
  },
});

StyleDictionary.registerTransform({
  name: 'ratio/%',
  type: 'value',
  filter: function (token) {
    // here we are using a custom attribute, declared in the token, to match the values where apply the transform
    return token.type === 'ratio';
  },
  transform: function (token) {
    return `${Math.floor(100 * token.value)}%`;
  },
});

StyleDictionary.registerTransform({
  name: 'hexRGB/hexARGB',
  type: 'value',
  filter: function (token) {
    return token.type === 'color';
  },
  transform: function (token) {
    // for sake of simplicity, in this example we assume colors are always in the format #xxxxxx
    return token.value.replace(/^#/, '#FF');
  },
});

StyleDictionary.registerTransform({
  name: 'unitless/sp',
  type: 'value',
  filter: function (token) {
    return token.type === 'fontSize';
  },
  transform: function (token) {
    // in Android font sizes are expressed in "sp" units
    return `${token.value}sp`;
  },
});

StyleDictionary.registerTransform({
  // this is a silly example, to show how you can apply transform to names
  name: 'name/squiggle',
  type: 'name',
  // notice: if you don't specify a filter, the transformation will be applied to all the tokens
  transform: function (token) {
    return token.path.join('~');
  },
});

// REGISTER THE CUSTOM TRANSFORM GROUPS

// if you want to see what a pre-defined group contains, uncomment the next line:
// console.log(StyleDictionary.transformGroup['group_name']);

StyleDictionary.registerTransformGroup({
  name: 'custom/web',
  // notice: here the "size/px" transform is not the pre-defined one, but the custom one we have declared above
  transforms: ['attribute/cti', 'name/constant', 'size/px', 'color/css', 'time/seconds', 'ratio/%'],
});

StyleDictionary.registerTransformGroup({
  name: 'custom/scss',
  // this is to show one possibility for adding a few transforms to a pre-defined group
  // (however, we suggest to use the previous approach, which is more explicit and clear)
  transforms: StyleDictionary.transformGroup['scss'].concat(['size/px', 'ratio/%']),
});

StyleDictionary.registerTransformGroup({
  name: 'custom/android',
  // as you can see, here we are completely ignoring the "attribute/cti" transform (it's totally possible),
  // because we are relying on custom attributes for the filters and the custom format for the output
  transforms: ['name/squiggle', 'hexRGB/hexARGB', 'unitless/dp-sp'],
});

// REGISTER A CUSTOM FORMAT (to be used for this specific example)

StyleDictionary.registerFormat({
  name: 'custom/android/xml',
  format: function ({ dictionary }) {
    return dictionary.allTokens
      .map(function (token) {
        return `<item name="${token.name}">${token.value}</item>`;
      })
      .join('\n');
  },
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const sd = new StyleDictionary(__dirname + '/config.json');

// FINALLY, BUILD ALL THE PLATFORMS
await sd.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
