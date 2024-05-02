---
title: Filters
---

Filters is a hook that provides a way to filter your tokens prior to formatting them to the final output.

Common use cases for filtering are:

- Not outputting your primitive/option tokens such as a color palette
- Splitting component tokens into separate files for each component

---

## Filter structure

A filter is an object with two props:

- `name`: the name of the filter
- `filter`: a callback function that receives the `token` as argument and returns a boolean, `true` to include the token, `false` to exclude/filter it out. Can also be an async function.

```javascript title="my-filter.js"
const myFilter = {
  name: 'my-filter',
  // async is optional
  filter: async (token) => {
    return !token.filePath.endsWith('core.json');
  },
};
```

---

## Using filters

First you will need to tell Style Dictionary about your filter. You can do this in two ways:

1. Using the [`.registerFilter`](/reference/api#registerfilter) method
1. Inline in the [configuration](/reference/config#properties) `hooks.filters` property

### .registerFilter

```javascript
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFilter(myFilter);
```

### Inline

```javascript
export default {
  hooks: {
    filters: {
      'my-filter': myFilter,
    },
  },
  // ... the rest of the configuration
};
```

### Applying it in config

```json
{
  "source": ["**/*.tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "files": [
        {
          "format": "css/variables",
          "destination": "_variables.css",
          "filter": "my-filter"
        }
      ]
    }
  }
}
```

---

### Example

~ sd-playground

```json tokens
{
  "colors": {
    "red": {
      "type": "color",
      "value": "#ff0000"
    },
    "blue": {
      "type": "color",
      "value": "#0000ff"
    }
  },
  "spacing": {
    "0": {
      "type": "dimension",
      "value": "0px"
    },
    "1": {
      "type": "dimension",
      "value": "4px"
    },
    "2": {
      "type": "dimension",
      "value": "8px"
    }
  }
}
```

```js config
export default {
  hooks: {
    filters: {
      'no-colors': (token) => {
        return token.type !== 'color';
      },
    },
  },
  platforms: {
    css: {
      transformGroup: 'css',
      files: [
        {
          format: 'css/variables',
          destination: '_variables.css',
          filter: 'no-colors',
        },
      ],
    },
  },
};
```
