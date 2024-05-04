---
'style-dictionary': major
---

BREAKING: Parsers, when registered, are put inside the `hooks.parsers` property now, as opposed to `parsers`.
`parsers` property has been repurposed: you will now also need to explicitly apply registered parsers by name in the `parsers` property, they no longer apply by default.
When registering a parser, you must also supply a `name` property just like with all other hooks, and the `parse` function has been renamed to `parser` for consistency.

Before:

```js
export default {
  // register it inline or by SD.registerPreprocessor
  parsers: [
    {
      pattern: /\.json5$/,
      parse: ({ contents, filePath}) => {
        return JSON5.parse(contents);
      },
    }
  ],
};
```

After:

```js
export default {
  hooks: {
    parsers: {
      name: 'json5-parser',
      pattern: /\.json5$/,
      parser: ({ contents, filePath}) => {
        return JSON5.parse(contents);
      },
    }
  },
  // apply it globally by name reference
  parsers: ['json5-parser'],
};
```
