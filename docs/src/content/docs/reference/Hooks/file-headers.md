---
title: File Headers
---

File headers is a hook that provides a way to configure the header of output files.

```css title="_variables.css"
/**
 * This is a file header!
 */
:root {
  --foo-bar: 4px;
}
```

---

## File header structure

A file header is an object with two props:

- `name`: the name of the file header
- `fileHeader`: a callback function that receives the default message array of strings, usually set by the format, and returns an array of strings (message lines) or a Promise with an array of strings.

The array of strings will be concatenated using newline separator.

```javascript title="my-fileheader.js"
const myFileHeader = {
  name: 'my-file-header',
  // async is optional
  fileHeader: async (defaultMessages = []) => {
    return [...defaultMessages, 'Do not edit please', 'Auto-generated on...'];
  },
};
```

---

## Using file headers

First you will need to tell Style Dictionary about your file header. You can do this in two ways:

1. Using the [`.registerFileHeader`](/reference/api#registerfileheader) method
1. Inline in the [configuration](/reference/config#properties) `hooks.fileHeaders` property

### .registerFileHeader

```javascript
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFileHeader(myFileHeader);
```

### Inline

```javascript
export default {
  hooks: {
    fileHeaders: {
      'my-file-header': myFileHeader,
    },
  },
  // ... the rest of the configuration
};
```

### Applying it in config

File-specific:

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
          "options": {
            "fileHeader": "my-file-header"
          }
        }
      ]
    }
  }
}
```

or platform-specific:

```json
{
  "source": ["**/*.tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "options": {
        "fileHeader": "my-file-header"
      },
      "files": [
        {
          "format": "css/variables",
          "destination": "_variables.css"
        }
      ]
    }
  }
}
```

---

### Example

~ sd-playground

```js config
import { transformGroups } from 'style-dictionary/enums';

export default {
  hooks: {
    fileHeaders: {
      'my-file-header': (defaultMessages = []) => [
        'Ola, planet!',
        ...defaultMessages,
        'Hello, World!',
      ],
    },
  },
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      options: {
        fileHeader: 'my-file-header',
      },
      files: [
        {
          format: formats.cssVariables,
          destination: '_variables.css',
        },
      ],
    },
  },
};
```
