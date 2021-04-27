## Custom Parsers

Style Dictionary 3.0 added the ability to define custom parsers for source files. Before 3.0, the source files for Style Dictionary had to be JSON, JSON5, or Node modules (unless you wanted to read and merge the data yourself outside of Style Dictionary). Now you can define custom parsers that run on certain files based on a file path pattern regular expression (similar to how Webpack loaders work). 

Use cases include:

- Using YAML instead of JSON, JSON5, or Node modules as the source language for Style Dictionary files
- Adding custom metadata when source files are parsed


#### Running the example

First of all, set up the required dependencies running the command `npm ci` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, you can run `npm run build`. This command will generate output files in the `build` folder. Just to show how custom parsers work, this example only has 2 design tokens and outputs a single CSS variables file. 

#### How does it work

You can define custom parsers in 2 ways:
1. With the `.registerParser` method
1. Adding a `parsers` array to the Style Dictionary configuration

A parser is an object with a `pattern` attribute that is a regular expression, and a `parse` attribute that is a function. The `parse` function accepts `contents` and `filePath` as named arguments and should return a plain Javascript object.

```javascript
{
  pattern: /\.json$/,
  parse: ({contents, filePath}) => {
    return JSON.parse(contents);
  }
}
```

Because parsers work on the source files for Style Dictionary, they need to be defined at or before the configuration is passed to Style Dictionary through the `.extend` method. 

```javascript
const StyleDictionary = require('style-dictionary');

const styleDictionary = StyleDictionary.extend({
  source: [`tokens/**/*.json`],
  //..
});

// This won't work because Style Dictionary has already parsed the source files
// in the .extend method
styleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({contents, filePath}) => {
    return JSON.parse(contents);
  }
})
```

#### What to look at

* **sd.config.js** Has everything you need