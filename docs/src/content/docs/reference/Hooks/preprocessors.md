---
title: Preprocessors
---

Starting in version 4.0, you can define custom preprocessors to process the dictionary object as a whole, after it all token files have been parsed and combined into one.
This is useful if you want to do more complex transformations on the dictionary as a whole, when all other ways are not powerful enough.

You can also tag a preprocessor with a platform option, so it only runs on the dictionary for that specific platform when building said platform.

:::caution
It should be clear that using this feature should be a last resort. Using custom parsers to parse per file or using transforms to do transformations on a per token basis,
gives more granular control and reduces the risks of making mistakes.
:::

That said, preprocessing the full dictionary gives ultimate flexibility when needed.

---

## Preprocessor structure

A preprocessor is an object with two props:

- `name`: the name of the preprocessor
- `preprocessor` a callback function that receives the dictionary as a parameter, and returns the processed dictionary
- `platform`, optional, will only run the preprocessor for that platform when building for said platform, rather than running it globally after the dictionary is first initialized after parsing

```javascript title="my-preprocessor.js"
const myPreprocessor = {
  name: 'strip-third-party-meta',
  platform: 'css',
  preprocessor: (dictionary) => {
    delete dictionary.thirdPartyMetadata;
    return dictionary;
  },
};
```

Asynchronous callback functions are also supported, giving even more flexibility.

```javascript title="my-preprocessor-async.js"
const myPreprocessor = {
  name: 'strip-props',
  preprocessor: async (dictionary) => {
    const propsToDelete = await someAPICall();

    propsToDelete.forEach((propName) => {
      delete dictionary[propName];
    });

    return dictionary;
  },
};
```

---

## Using preprocessors

First you will need to tell Style Dictionary about your parser. You can do this in two ways:

1. Using the [`.registerPreprocessor`](/reference/api#registerpreprocessor) method
1. Inline in the [configuration](/reference/config#attributes)

### .registerPreprocessor

```javascript
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerPreprocessor(myPreprocessor);
```

### Inline

```javascript
export default {
  preprocessors: {
    'strip-props': myPreprocessor,
  },
  // ... the rest of the configuration
};
```

---

## Preprocessor examples

Stripping description property recursively in the entire dictionary object:

```js
StyleDictionary.registerPreprocessor({
  name: 'strip-descriptions',
  preprocessor: (dict) => {
    // recursively traverse token objects and delete description props
    function removeDescription(slice) {
      delete slice.description;
      Object.values(slice).forEach((value) => {
        if (typeof value === 'object') {
          removeDescription(value);
        }
      });
      return slice;
    }
    return removeDescription(dict);
  },
});
```
