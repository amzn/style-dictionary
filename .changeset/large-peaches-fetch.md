---
'style-dictionary': major
---

BREAKING: Actions, when registered, are put inside the `hooks.actions` property now, as opposed to `action`.
Note the change from singular to plural form here.

Before:

```js
export default {
  action: {
    'copy-assets': {
      do: () => {}
      undo: () => {}
    }
  },
};
```

After:

```js
export default {
  hooks: {
    actions: {
      'copy-assets': {
        do: () => {}
        undo: () => {}
      }
    },
  },
};
```
