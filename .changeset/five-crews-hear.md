---
'style-dictionary': major
---

BREAKING: File headers, when registered, are put inside the `hooks.fileHeaders` property now, as opposed to `fileHeader`.
Note the change from singular to plural form here.

Before:

```js
export default {
  fileHeader: {
    foo: (defaultMessages = []) => [
      'Ola, planet!',
      ...defaultMessages,
      'Hello, World!'
    ],
  },
}
```

After:

```js
export default {
  hooks: {
    fileHeaders: {
      foo: (defaultMessages = []) => [
        'Ola, planet!',
        ...defaultMessages,
        'Hello, World!'
      ],
    },
  },
}
```
