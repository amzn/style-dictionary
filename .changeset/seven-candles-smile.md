---
'style-dictionary': major
---

BREAKING: Formats, when registered, are put inside the `hooks.formats` property now, as opposed to `format`.
The `formatter` handler function has been renamed to `format` for consistency.

The importable type interfaces have also been renamed, `Formatter` is now `FormatFn` and `FormatterArguments` is now `FormatFnArguments`.
Note that you can also use `Format['format']` instead of `FormatFn`, or `Parameters<Format['format']>` instead of `FormatFnArguments`, so these renames may not matter.

Before:

```ts
import StyleDictionary from 'style-dictionary';
import type { Formatter, FormatterArguments } from 'style-dictionary/types';

// register it with register method
StyleDictionary.registerFormat({
  name: 'custom/json',
  formatter: ({ dictionary }) => JSON.stringify(dictionary, null, 2),
})

export default {
  // OR define it inline
  format: {
    'custom/json': ({ dictionary }) => JSON.stringify(dictionary, null, 2),
  },
  platforms: {
    json: {
      files: [{
        destination: 'output.json',
        format: 'custom/json'
      }],
    },
  },
};
```

After:

```ts
import StyleDictionary from 'style-dictionary';
import type { FormatFn, FormatFnArguments } from 'style-dictionary/types';

// register it with register method
StyleDictionary.registerFormat({
  name: 'custom/json',
  format: ({ dictionary }) => JSON.stringify(dictionary, null, 2),
})

export default {
  // OR define it inline
  hooks: {
    formats: {
      'custom/json': ({ dictionary }) => JSON.stringify(dictionary, null, 2),
    },
  },
  platforms: {
    json: {
      files: [{
        destination: 'output.json',
        format: 'custom/json'
      }],
    },
  },
};
```