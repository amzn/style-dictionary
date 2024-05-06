---
'style-dictionary': major
---

Filters, when registered, are put inside the `hooks.filters` property now, as opposed to `filter`.
Note the change from singular to plural form here.

Before:

```js
export default {
  filter: {
    'colors-only': (token) => token.type === 'color,
  },
  platforms: {
    css: {
      files: [{
        format: 'css/variables',
        destination: '_variables.css',
        filter: 'colors-only',
      }],
    },
  },
};
```

After:

```js
export default { 
  hooks: {
    filters: {
      'colors-only': (token) => token.type === 'color,
    },
  },
  platforms: {
    css: {
      files: [{
        format: 'css/variables',
        destination: '_variables.css',
        filter: 'colors-only',
      }],
    },
  },
};
```

In addition, when using [`registerFilter`](/reference/api#registerfilter) method, the name of the filter function is now `filter` instead of `matcher`.

Before:

```js title="build-tokens.js" del={5} ins={6}
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFilter({
  name: 'colors-only',
  matcher: (token) => token.type === 'color',
})
```

After:

```js title="build-tokens.js" del={5} ins={6}
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFilter({
  name: 'colors-only',
  filter: (token) => token.type === 'color',
})
```

> These changes also apply for the `filter` function (previously `matcher`) inside `transforms`.
