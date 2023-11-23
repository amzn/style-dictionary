---
'style-dictionary': major
---

BREAKING: StyleDictionary to be initialized with a new API and have async methods. Use:

```js
import StyleDictionary from 'style-dictionary';

/**
 * old: 
 *   const sd = StyleDictionary.extend({ source: ['tokens.json'], platforms: {} });
 *   sd.buildAllPlatforms();
 */ 
const sd = new StyleDictionary({ source: ['tokens.json'], platforms: {} });
await sd.buildAllPlatforms();
```

You can still extend a dictionary instance with an extended config, but `.extend()` is only used for this, it is no longer used to initialize the first instance:

```js
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({ source: ['tokens.json'], platforms: {} });
const extended = await sd.extend({ 
  fileHeader: {
    myFileHeader: (defaultMessage) => {
      return [...defaultMessage, 'hello, world!'];
    }
  }
});
```

To ensure your initialized StyleDictionary instance is fully ready and has imported all your tokens, you can await `hasInitialized`:

```js
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({ source: ['tokens.json'], platforms: {} });
await sd.hasInitialized;
console.log(sd.allTokens);
```

For error handling and testing purposes, you can also manually initialize the style-dictionary config:

```js
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({ source: ['tokens.js'], platforms: {} }, { init: false });
try {
  await sd.init();
} catch(e) {
  // handle error, e.g. when tokens.js file has syntax errors and cannot be imported
}
console.log(sd.allTokens);
```

The main reason for an initialize step after class instantiation is that async constructors are not a thing in JavaScript, and if you return a promise from a constructor to "hack it", TypeScript will eventually trip over it.

Due to being able to dynamically (asynchronously) import ES Modules rather than synchronously require CommonJS modules, we had to make the APIs asynchronous, so the following methods are now async:

- extend
- exportPlatform
- buildAllPlatforms & buildPlatform
- cleanAllPlatforms & cleanPlatform

In a future release, most other methods will be made async or support async as well, such as parsers, transforms, formats etc.
