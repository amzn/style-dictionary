---
'style-dictionary': major
---

BREAKING: All of our hooks, parsers, preprocessors, transforms, formats, actions, fileHeaders and filters, support async functions as well now. This means that the formatHelpers -> fileHeader helper method is now asynchronous, to support async fileheader functions.

```js
import StyleDictionary from 'style-dictionary';

const { fileHeader } = StyleDictionary.formatHelpers;

StyleDictionary.registerFormat({
  name: 'custom/css',
  // this can be async now, usually it is if you use fileHeader format helper, since that now always returns a Promise
  formatter: async function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return (
      // this helper is now async! because the user-passed file.fileHeader might be an async function
      (await fileHeader({ file })) +
      ':root {\n' +
      formattedVariables({ format: 'css', dictionary, outputReferences }) +
      '\n}\n'
    );
  },
});
```
