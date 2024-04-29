---
'style-dictionary': major
---

BREAKING: preprocessors must now also be explicitly applied on global or platform level, rather than only registering it. This is more consistent with how the other hooks work and allows applying it on a platform level rather than only on the global level.

`preprocessors` property that contains the registered preprocessors has been moved under a wrapping property called `hooks`.

Before:

```js
export default {
  // register it inline or by SD.registerPreprocessor
  // applies automatically, globally
  preprocessors: {
    foo: (dictionary) => {
      // preprocess it
      return dictionary;
    }
  }
}
```

After:

```js
export default {
  // register it inline or by SD.registerPreprocessor
  hooks: {
    preprocessors: {
      foo: (dictionary) => {
        // preprocess it
        return dictionary;
      }
    }
  },
  // apply it globally
  preprocessors: ['foo'],
  platforms: {
    css: {
      // or apply is per platform
      preprocessors: ['foo']
    }
  }
}
```
