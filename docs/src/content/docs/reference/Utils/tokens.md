---
title: Tokens
---

These utilities have to do with processing/formatting tokens.

## flattenTokens

:::caution
Deprecated in favor of [`convertTokenData`](/reference/utils/tokens#converttokendata), see below
:::

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
await sd.hasInitialized;

const flat = flattenTokens(sd.tokens);
/**
 * [
 *   { key: '{colors.black}', value: '#000', type: 'color', name: 'colors-black' },
 *   { key: '{spacing.2}', value: '2px', type: 'dimension', name: 'spacing-2' },
 *   { key: '{border}', value: 'solid {spacing.2} {colors.black}', name: 'border' }
 * ]
 */
```

:::note
You can pass a second argument `usesDtcg`, if set to true, the flattenTokens utility will assume DTCG syntax (`$value` props).
:::

The key is added so that it is easy to transform the flattened array back to a nested object if needed later, by using the [convertTokenData](/reference/utils/tokens#converttokendata) utility.

## convertTokenData

Convert tokens from one data structure to another.

Available data structures:

- `Array` (available as `allTokens` on `dictionary`) -> easy to iterate e.g. for outputting flat formats
- `Object` (available as `tokens` on `dictionary`) -> similar to JSON input format e.g. DTCG format, useful for outputting nested / deep formats such as JSON
- `Map` (available as `tokenMap` on `dictionary`) -> easy to iterate & access, optimal for token processing and will be used internally in Style Dictionary in the future

> All 3 structures can be converted to one another

| Param              | Type                            | Description                                                  |
| ------------------ | ------------------------------- | ------------------------------------------------------------ |
| `tokens`           | `Tokens \| Token[] \| TokenMap` | The input tokens data as either `Object`, `Array` or `Map`.  |
| `options`          | `Object`                        | Options object, with multiple properties.                    |
| `options.usesDtcg` | `boolean`                       | Whether the input data uses DTCG syntax, `false` by default. |
| `options.output`   | `'object' \| 'array' \| 'map'`  | Output data format                                           |

We are currently considering making the `Map` structure the de-facto standard in a future v5, making the `Object`/`Array` versions available only through this utility. This is to optimize the library's base functionality.

This utility auto-detects the input data type and allows you to specify the desired output data type.
You can optionally pass `usesDtcg` flag as well if you use DTCG format, this is necessary for converting from Object to `Map`/`Array`, since we need to know whether to use the `$value` or `value` to identify tokens in the `Object`.

```javascript title="build-tokens.js"
import StyleDictionary from 'style-dictionary';
import { convertTokenData } from 'style-dictionary/utils';

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
await sd.hasInitialized;

const flatArray = convertTokenData(sd.tokens, { output: 'array' });
/**
 * [
 *   { key: '{colors.black}', value: '#000', type: 'color', name: 'colors-black' },
 *   { key: '{spacing.2}', value: '2px', type: 'dimension', name: 'spacing-2' },
 *   { key: '{border}', value: 'solid {spacing.2} {colors.black}', name: 'border' }
 * ]
 */

/**
 * Using the flatArray as input here is cheaper than using sd.tokens, since in order for
 * it to convert a tokens Object to a Map, it would first flatten it to an Array.
 *
 * However, you definitely CAN use the sd.tokens as input as well
 */
const map = convertTokenData(flatArray, { output: 'map' });
/**
 * Map(3): {
 *   '{colors.black}' => { value: '#000', type: 'color', name: 'colors-black' },
 *   '{spacing.2}' => { value: '2px', type: 'dimension', name: 'spacing-2' },
 *   '{border}' => { value: 'solid {spacing.2} {colors.black}', name: 'border' }
 * }
 */
const borderToken = map.get('{border}'); // easy to access a token since it's keyed

/**
 * Same as above, you could use `sd.tokens` or `map` as inputs as well
 * `sd.tokens` is cheapest since it's already an object and just returns it, no conversion happens
 * `array` is just slightly cheaper than map since map needs to call .values() Iterator to iterate
 */
const object = convertTokenData(flatArray, { output: 'object' });
/**
 * Same as original tokens input, we basically went full circle
 */
```

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
