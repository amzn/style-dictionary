---
title: Tokens
---

These utilities have to do with processing/formatting tokens object.

## flattenTokens

Flatten dictionary tokens object to an array of flattened tokens.

:::note
Only the "value" / "$value" property is required for this utility to consider a leaf node a "token" to be added to the flattened array output.
:::

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

## stripMeta

Allows you to strip meta data from design tokens, useful if you want to output clean nested formats.

You can define which meta properties to strip or which properties to keep (allowlist / blocklist), in the second `options` parameter.

This utility is also used in the [`'json'` format](/reference/hooks/formats/predefined#json).

```javascript title="build-tokens.js"
import StyleDictionary from 'style-dictionary';
import { stripMeta } from 'style-dictionary/utils';

const sd = new StyleDictionary({
  tokens: {
    colors: {
      black: {
        value: '#000',
        type: 'color',
        name: 'colors-black',
        attributes: { foo: 'bar' },
        path: ['colors', 'black'],
      },
    },
    spacing: {
      2: {
        value: '2px',
        type: 'dimension',
        name: 'spacing-2',
        attributes: { foo: 'bar' },
        path: ['spacing', '2'],
      },
    },
    border: {
      value: 'solid {spacing.2} {colors.black}',
      name: 'border',
      attributes: { foo: 'bar' },
      path: ['border'],
    },
  },
});

const stripped = stripMeta(sd, { keep: ['value'] });
/**
 * {
 *   colors: {
 *     black: {
 *       value: '#000',
 *     },
 *   },
 *   spacing: {
 *     2: {
 *       value: '2px',
 *     },
 *   },
 *   border: {
 *     value: 'solid {spacing.2} {colors.black}',
 *   },
 * }
 */
```

:::note
You can pass `usesDtcg` property in the `options` object parameter, if set to true, the stripMeta utility will assume DTCG syntax (`$value` props).
:::
