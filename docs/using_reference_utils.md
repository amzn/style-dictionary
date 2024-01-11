# Using Reference Utilities

The Style Dictionary npm module exposes a `utils` endpoint that contains some helpful functions for finding and resolving references.

## Installation

```bash
$ npm install -D style-dictionary
```

## Usage

### Flatten Tokens

Flatten dictionary tokens object to an array of flattened tokens.

```javascript
import StyleDictionary from 'style-dictionary';
import { flattenTokens } from 'style-dictionary/utils';

const sd = new StyleDictionary({
  tokens: {
    colors: {
      black: {
        value: '#000',
        type: 'color',
        name: 'colors-black',
      },
    },
    spacing: {
      2: {
        value: '2px',
        type: 'dimension',
        name: 'spacing-2',
      },
    },
    border: {
      value: 'solid {spacing.2} {colors.black}',
      name: 'border',
    },
  },
});

const flat = flattenTokens(sd, sd.tokens.border.value);
/**
 * [
 *   { value: '#000', type: 'color', name: 'colors-black' },
 *   { value: '2px', type: 'dimension', name: 'spacing-2' },
 *   { value: 'solid {spacing.2} {colors.black}', name: 'border' }
 * ]
 */
```

### usesReference

Whether or not a token value contains references

```javascript
import StyleDictionary from 'style-dictionary';
import { usesReference } from 'style-dictionary/utils';

usesReference('{foo.bar}'); // true
usesReference('solid {border.width} {border.color}'); // true
usesReference('5px'); // false
usesReference('[foo.bar]', {
  opening_character: '[',
  closing_character: ']',
}); // true
```

### resolveReferences

Takes a token value string value and resolves any reference inside it

```javascript
import StyleDictionary from 'style-dictionary';
import { resolveReferences } from 'style-dictionary/utils';

const sd = new StyleDictionary({
  tokens: {
    colors: {
      black: {
        value: '#000',
        type: 'color',
      },
    },
    spacing: {
      2: {
        value: '2px',
        type: 'dimension',
      },
    },
    border: {
      value: 'solid {spacing.2} {colors.black}',
    },
  },
});
resolveReferences(sd.tokens.border.value, sd.tokens); // "solid 2px #000"
resolveReferences('solid {spacing.2} {colors.black}', sd.tokens); // alternative way, yet identical to line above -> "solid 2px #000"
```

### getReferences

Whether or not a token value contains references

```javascript
import StyleDictionary from 'style-dictionary';
import { getReferences } from 'style-dictionary/utils';

const sd = new StyleDictionary({
  tokens: {
    colors: {
      black: {
        value: '#000',
        type: 'color',
      },
    },
    spacing: {
      2: {
        value: '2px',
        type: 'dimension',
      },
    },
    border: {
      value: 'solid {spacing.2} {colors.black}',
    },
  },
});

getReferences(sd, sd.tokens.border.value);
getReferences(sd, 'solid {spacing.2} {colors.black}'); // alternative way, yet identical to line above
/**
 * [
 *   { value: '2px', type: 'dimension' },
 *   { value: '#000', type: 'color' }
 * ]
 */
```

#### Complicated example

You can use the `getReferences` utility to create your own custom formats that have `outputReferences` capability.

```js
import StyleDictionary from 'style-dictionary';
import { usesReference, getReferences } from 'style-dictionary/utils';

const { fileHeader } = StyleDictionary.formatHelpers;

const sd = new StyleDictionary({
  tokens: {
    colors: {
      black: {
        value: '#000',
        type: 'color',
      },
    },
    spacing: {
      2: {
        value: '2px',
        type: 'dimension',
      },
    },
    zIndex: {
      // number example.. which should stay a number in the output
      aboveFold: {
        value: 1,
        type: 'other',
      },
    },
    semantic: {
      bg: {
        primary: {
          value: '{colors.black}',
          type: 'color',
        },
      },
    },
    border: {
      value: 'solid {spacing.2} {semantic.bg.primary}',
    },
  },
  platforms: {
    es6: {
      transformGroup: 'js',
      files: [
        {
          format: 'es6',
          destination: 'output.js',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
});

// More complex case
// Note that this example format does not account for token values that are arrays or objects
StyleDictionary.registerFormat({
  name: 'es6',
  formatter: (dictionary) => {
    const { allTokens, options, file } = dictionary;
    const isNumeric = (str) => {
      if (typeof str !== 'string') return false;
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      );
    };

    const compileTokenValue = (token) => {
      let value = `${token.value}`;
      const original = `${token.original.value}`;
      const originalIsReferenceExclusively = original.match(/^\{.+\}$/g);
      if (options.outputReferences && usesReference(original)) {
        value = original;
        if (!originalIsReferenceExclusively) {
          // since we're putting references back and value is not exclusively a reference, use template literals
          value = `\`${value}\``;
        }
        const refs = getReferences(dictionary, original);
        refs.forEach((ref) => {
          // check if the ref has a value, path and name property, meaning that a name transform
          // that creates the token name is mandatory for this format to function properly
          if (['value', 'name', 'path'].every((prop) => Object.hasOwn(ref, prop))) {
            value = value.replace(
              // e.g. `{foo.bar.qux}` or `{foo.bar.qux.value}`
              // replaced by `${fooBarQux}`
              new RegExp(`{${ref.path.join('.')}(.value)?}`, 'g'),
              originalIsReferenceExclusively ? ref.name : `\${${ref.name}}`,
            );
          }
        });
        return value;
      }
      return isNumeric(value) ? value : JSON.stringify(value);
    };

    return `${fileHeader({ file })}${allTokens.reduce((acc, token) => {
      return (
        acc +
        `export const ${token.name} = ${compileTokenValue(token)}; ${
          token.comment ? `// ${token.comment}` : ''
        }\n`
      );
    }, '')}`;
  },
});

await sd.buildAllPlatforms();

// output below

/**
 * Do not edit directly
 * Generated on Thu, 07 Dec 2023 14:44:53 GMT
 */

export const ColorsBlack = '#000';
export const Spacing2 = '2px';
export const ZIndexAboveFold = 1;
export const SemanticBgPrimary = ColorsBlack;
export const Border = `solid ${Spacing2} ${SemanticBgPrimary}`;
```
