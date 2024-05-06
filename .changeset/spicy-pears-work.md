---
'style-dictionary': major
---

BREAKING: Transforms, when registered, are put inside the `hooks.transforms` property now, as opposed to `transform`.
The `matcher` property has been renamed to `filter` (to align with the Filter hook change), and the `transformer` handler function has been renamed to `transform` for consistency.

Before:

```js
export default {
  // register it inline or by SD.registerTransform
  transform: {
    'color-transform': {
      type: 'value',
      matcher: (token) => token.type === 'color',
      transformer: (token) => token.value,
    },
  },
  platforms: {
    css: {
      // apply it per platform
      transforms: ['color-transform'],
    },
  },
};
```

After

```js
export default {
  // register it inline or by SD.registerTransform
  hooks: {
    transforms: {
      'color-transform': {
        type: 'value',
        filter: (token) => token.type === 'color',
        transform: (token) => token.value,
      },
    },
  },
  platforms: {
    css: {
      // apply it per platform
      transforms: ['color-transform'],
    },
  },
};
```
