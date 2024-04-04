---
'style-dictionary': major
---

BREAKING: Allow specifying a `function` for `outputReferences`, conditionally outputting a ref or not per token. Also exposes `outputReferencesFilter` utility function which will determine whether a token should be outputting refs based on whether those referenced tokens were filtered out or not.

If you are maintaining a custom format that allows `outputReferences` option, you'll need to take into account that it can be a function, and pass the correct options to it.

Before:

```js
StyleDictionary.registerFormat({
  name: 'custom/es6',
  formatter: async (dictionary) => {
    const { allTokens, options, file } = dictionary;
    const { usesDtcg } = options;
    
    const compileTokenValue = (token) => {
      let value = usesDtcg ? token.$value : token.value;
      const originalValue = usesDtcg ? token.original.$value : token.original.value;

      // Look here 👇
      const shouldOutputRefs = outputReferences && usesReferences(originalValue);

      if (shouldOutputRefs) {
        // ... your code for putting back the reference in the output
        value = ...
      }
      return value;
    }
    return `${allTokens.reduce((acc, token) => `${acc}export const ${token.name} = ${compileTokenValue(token)};\n`, '')}`;
  },
});
```

After

```js
StyleDictionary.registerFormat({
  name: 'custom/es6',
  formatter: async (dictionary) => {
    const { allTokens, options, file } = dictionary;
    const { usesDtcg } = options;
    
    const compileTokenValue = (token) => {
      let value = usesDtcg ? token.$value : token.value;
      const originalValue = usesDtcg ? token.original.$value : token.original.value;

      // Look here 👇
      const shouldOutputRef =
        usesReferences(original) &&
        (typeof options.outputReferences === 'function'
          ? outputReferences(token, { dictionary, usesDtcg })
          : options.outputReferences);

      if (shouldOutputRefs) {
        // ... your code for putting back the reference in the output
        value = ...
      }
      return value;
    }
    return `${allTokens.reduce((acc, token) => `${acc}export const ${token.name} = ${compileTokenValue(token)};\n`, '')}`;
  },
});
```
