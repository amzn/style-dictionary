---
title: Tokens
---

These utilities have to do with processing/formatting tokens object.

## flattenTokens

Flatten dictionary tokens object to an array of flattened tokens.

```javascript title="build-tokens.js"
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

const flat = flattenTokens(sd);
/**
 * [
 *   { value: '#000', type: 'color', name: 'colors-black' },
 *   { value: '2px', type: 'dimension', name: 'spacing-2' },
 *   { value: 'solid {spacing.2} {colors.black}', name: 'border' }
 * ]
 */
```

:::note
You can pass a second argument `usesDtcg`, if set to true, the flattenTokens utility will assume DTCG syntax (`$value` props).
:::
