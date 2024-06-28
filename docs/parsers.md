# Parsers

Starting in version 3.0, you can define custom parsers to parse design token files. This allows you to define your design token files in _any_ language you like as long as you can write a parser for it.

A custom parser matches design token files based on a file path regular expression. It will get the contents of a file as a string and should return an object of the data.

Custom parsers can be used to keep design token files in other languages like YAML, but they can also be used to add extra metadata or modify the design tokens themselves before they get to Style Dictionary. For example, you could modify the token object based on its file path or programmatically generate tokens based on the data in certain files.

---

## Parser structure

A parser has 2 parts: a pattern which is a regular expression to match against a file path, and a parse function which takes the file path and contents of the file and is expected to return a function.

```javascript
const myParser = {
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
    return JSON.parse(contents);
  },
};
```

---

## Using parsers

First you will need to tell Style Dictionary about your parser. You can do this in two ways:

1. Using the `.registerParser` method
1. Inline in the [configuration](config.md)

### .registerParser

```javascript
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
    return JSON.parse(contents);
  },
});
```

### Inline

```javascript
module.exports = {
  parsers: [
    {
      pattern: /\.json$/,
      parse: ({ filePath, contents }) => {
        return JSON.parse(contents);
      },
    },
  ],
  // ... the rest of the configuration
};
```

---

## Parser examples

- [More in-depth custom parser example](https://github.com/amzn/style-dictionary/tree/main/examples/advanced/custom-parser)
- [Using custom parsers to support YAML design token files](https://github.com/amzn/style-dictionary/tree/main/examples/advanced/yaml-tokens)
