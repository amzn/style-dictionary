---
title: References
---

These utilities have to do with token references/aliases.

## usesReference

Whether or not a token value contains references

```javascript title="build-tokens.js"
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

## resolveReferences

Takes a token value string value and resolves any reference inside it

```javascript title="build-tokens.js"
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
resolveReferences('solid {spacing.2} {colors.black}', sd.tokens, { usesDtcg: true }); // Assumes DTCG spec format, with $ prefix ($value, $type)
```

:::note
You can pass a third `options` argument where you can pass some configuration options for how references are resolved
Most notable option for public usage is `usesDtcg`, if set to true, the `resolveReferences` utility will assume DTCG syntax (`$value` props).
:::

## getReferences

Whether or not a token value contains references

```javascript title="build-tokens.js"
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

getReferences(sd.tokens.border.value, sd.tokens);
getReferences('solid {spacing.2} {colors.black}', sd.tokens); // alternative way, yet identical to line above
getReferences('solid {spacing.2} {colors.black}', sd.tokens, { usesDtcg: true }); // Assumes DTCG spec format, with $ prefix ($value, $type)
/**
 * [
 *   { value: '2px', type: 'dimension' },
 *   { value: '#000', type: 'color' }
 * ]
 */
```

:::note
You can pass a third `options` argument where you can pass some configuration options for how references are resolved
Most notable option for public usage is `usesDtcg`, if set to true, the `resolveReferences` utility will assume DTCG syntax (`$value` props)
:::

### Complicated example

You can use the `getReferences` utility to create your own custom formats that have `outputReferences` capability.

```js title="build-tokens.js"
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
  formatter: async (dictionary) => {
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

    const header = await fileHeader({ file });

    return `${header}${allTokens.reduce((acc, token) => {
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

:::note
The above example does not support DTCG syntax, but this could be quite easily added,
since you can query `sd.usesDtcg` or inside a formatter functions `dictionary.options.usesDtcg`.
:::
