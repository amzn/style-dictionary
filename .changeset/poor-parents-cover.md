---
'style-dictionary': major
---

BREAKING: Transform groups, when registered, are put inside the `hooks.transformGroups` property now, as opposed to `transformGroup`.

Before:

```js
export default {
  // register it inline or by SD.registerTransformGroup
  transformGroup: {
    foo: ['foo-transform']
  },
};
```

After:

```js
export default {
  hooks: {
    transformGroups: {
      foo: ['foo-transform']
    },
  },
};
```
