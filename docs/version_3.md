# Version 3.0!

Version 3.0 is now publicly released! We have been working hard the past few months on a number of features and improvements we wanted to combine into a major release. Though we intend that 3.0 to be backwards compatible, we thought it was a good idea to move to a new major version because we are changing a core part of how Style Dictionary works. 

If you are starting a new project, you can install Style Dictionary and it will give you the latest version:

`npm install --save-dev style-dictionary`

If you have an existing project, you can upgrade to 3.0 by updating the version in your `package.json` file to `"style-dictionary": "^3.0.0"` and then run `npm install` or you can use the `latest` tag to update both your `package.json` and `package-lock.json` files:

`npm install --save-dev style-dictionary@latest`

[If you find any bugs or issues, please file a ticket](https://github.com/amzn/style-dictionary/issues/new) so we can get things fixed. We have tested and reviewed 3.0 extensively, but there may be things we missed. Thanks!


## What's new in 3.0:

* [Style Properties → Design Tokens](#style-properties-→-design-tokens)
* [Transitive transforms](#transitive-transforms)
* [Output references](#output-references)
* [Custom parser support](#custom-parser-support)
* [Adding filePath and isSource entries on tokens](#adding-filepath-and-issource-entries-on-tokens)
* [Format helpers](#format-helpers)
* [Updated format method arguments](#updated-format-method-arguments)
* [Custom file headers](#custom-file-headers)
* [Typescript support](#typescript-support)
* [More built-ins](#more-built-ins)
* [Bug fixes](#bug-fixes)
* [Other features](#other-features)
* [Better testing](#better-testing)
* [Dropping support for older versions of node](#dropping-support-for-older-versions-of-node)

### Style Properties → Design Tokens

Style Dictionary is moving to the term "design tokens", both in documentation and in code. This has become the industry standard term for a while and it is time we respect that. Until now, Style Dictionary had called these "style properties" or just "properties", with some parts of the documentation also mentioning "design tokens". We want to be consistent with the direction of the community as well as in our documentation and code. We use the terms `properties` and `allProperties` in different APIs in Style Dictionary. To be consistent in documentation as well as code, we will be moving to using `tokens` and `allTokens`.

Don't worry! This change is backwards-compatible; you will still be able to use `properties` and `allProperties` wherever you currently do in your code. If you want, you can update those to tokens and allTokens and everything will work as expected. Moving forward, all examples and documentation will use the term "design tokens" and "tokens" rather than "style properties" and "properties". We do recommend using `tokens` and `allTokens` in new code from here on out!

### Transitive transforms

This is the big one that required a big re-architecture of how the Style Dictionary build process works. 

Up until now the build process would merge all token files, then iterate through the merged object and transform tokens it found, but only do value transforms on tokens that did not reference another token. The original intent here was that a value of any reference should be the same for all references of it, so we only need to do a value transform once. Then after all tokens are transformed, Style Dictionary would resolve all aliases/references. 

However, we heard from the community there were a number of reasons why someone might want to transform the value of an aliased token. 

* https://github.com/amzn/style-dictionary/issues/451
* https://github.com/amzn/style-dictionary/issues/452
* https://github.com/amzn/style-dictionary/issues/208

The new build process is similar, except that it recursively transforms and resolves aliases, only deferring a transform to the next cycle if the token has an unresolved alias. Each pass might reveal tokens that are ready to be transformed in the next pass. Take this example:

```json
{
  "color": {
    "black": { "value": "#000000" },
    "font": {
      "primary": { "value": "{color.black.value}" },
      "input": { "value": "{color.font.primary.value}" }
    }
  }
}
```

The first pass will transform the `color.black` token because it doesn't have a reference. It will defer the transforms of `color.font.primary` and `color.font.input` because they do have references. Then it will resolve references to `color.black.value` because it has been transformed.

The second pass will transform `color.font.primary` because it no longer has a reference. It will then resolve the reference to `color.font.primary.value` because it has been transformed. 

The final pass will transform `color.font.input` because it no longer has a reference. Now the build is complete because there are no more deferred transforms left. 

Use cases this change opens up:

* Having variable references in outputs
* Combining values like using HSL for colors
* Modifying aliases like making a color lighter or darker

Example: https://github.com/amzn/style-dictionary/tree/main/examples/advanced/transitive-transforms

Thanks [@mfal](https://github.com/mfal)!

### Output references

https://github.com/amzn/style-dictionary/pull/504

This is another big one. This has been one of the first issues we made back in 2017, [issue 17](https://github.com/amzn/style-dictionary/issues/17)! This adds support for outputting references in exported files. This is a bit hard to explain, so let's look at an example. Say you have this very basic set of design tokens:

```json5
// tokens.json
{
  "color": {
    "red": { "value": "#ff0000" },
    "danger": { "value": "{color.red.value}" },
    "error": { "value": "{color.danger.value}" }
  }
}
```

With this configuration:

```json5
// config.json
{
  "source": ["tokens.json"]
  "platforms": {
    "css": {
      "transformGroup": "css",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables",
        "options": {
          // Look here 👇
          "outputReferences": true
        }
      }]
    }
  }
}
```

This would be the output:

```css
:root {
  --color-red: #ff0000;
  --color-danger: var(--color-red);
  --color-error: var(--color-danger);
}
```

The css variables file now keeps the references you have in your Style Dictionary! This is useful for outputting themeable and dynamic code.

Without `outputReferences: true` Style Dictionary would resolve all references and the output would be:

```css
:root {
  --color-red: #ff0000;
  --color-danger: #ff0000;
  --color-error: #ff0000;
}
```

Not all formats use the `outputReferences` option because that file format might not support it (like JSON for example). The current list of formats that handle `outputReferences`:

* css/variables
* scss/variables
* less/variables
* compose/object
* android/resources
* ios-swift/class.swift
* ios-swift/enum.swift
* flutter/class.dart

If you have custom formats you can make use of this feature too! The `dictionary` object that is passed as an argument to the formatter function has 2 new methods on it: `usesReference()` and `getReferences()` which you can use to get the reference name. Here is an example of that:

```javascript
StyleDictionary.registerFormat({
  name: `myCustomFormat`,
  formatter: function({ dictionary }) {
    return dictionary.allTokens.map(token => {
      let value = JSON.stringify(token.value);
      // the `dictionary` object now has `usesReference()` and
      // `getReferences()` methods. `usesReference()` will return true if
      // the value has a reference in it. `getReferences()` will return
      // an array of references to the whole tokens so that you can access
      // their names or any other attributes.
      if (dictionary.usesReference(token.original.value)) {
        const refs = dictionary.getReferences(token.original.value);
        refs.forEach(ref => {
          value = value.replace(ref.value, function() {
            return `${ref.name}`;
          });
        });
      }
      return `export const ${token.name} = ${value};`
    }).join(`\n`)
  }
})
```

Example: https://github.com/amzn/style-dictionary/tree/main/examples/advanced/variables-in-outputs

### Custom parser support

https://github.com/amzn/style-dictionary/pull/429

We are pretty excited about this. Until now you could only define your design tokens in either JSON, JSON5, or plain Node modules. The addition of custom parser support allows you to define your tokens in any language you like! The most obvious use-case is to use YAML which has a cleaner and less verbose syntax than JSON. Now, the sky is the limit. Your source of truth can be in any file format you like as long as you can parse it into an object that Style Dictionary can understand. You register a custom parser the same way as you register a custom transform or format. A parser consists of a pattern to match against files, similar to the test attribute in a loader in Webpack, and a parse function which gets the file path and its contents and is expected to return an object.

* Example: https://github.com/amzn/style-dictionary/tree/main/examples/advanced/custom-parser
* YAML example: https://github.com/amzn/style-dictionary/tree/main/examples/advanced/yaml-tokens


### Adding filePath and isSource entries on tokens

https://github.com/amzn/style-dictionary/pull/356

Style Dictionary adds some metadata on each token before any transforms take place in order to give more context for transforming and formatting tokens. For example, this design token: 

```json5
{
  "color": {
    "red": { "value": "#ff0000" }
  }
}
```

Turns into this:

```json5
{
  "color": {
    "red": {
      "value": "#ff0000",
      "name": "red", // adds a default 'name', which is the object key
      "path": ["color","red"], // object path
      "original": {
        "value": "#ff0000"
      } // copies the original object so you always have a clean copy
    }
  }
}
```

We are adding 2 new pieces of metadata to each token:

* **filePath:** A string representing the absolute path of the file that defines the token. This will help with debugging and if you want to output files based on the source files.
* **isSource:** A boolean representing if this file was defined as ‘source’ in the configuration as opposed to ‘include’ (or directly setting the ‘properties’ object). This can also help filtering tokens from output files you don't want to include.

Thanks [@7studio](https://github.com/7studio)!

### Format helpers

Style Dictionary comes with built-in formats to generate basic files like CSS, Sass, and Less variables. We know that we can't build formats to fit everyone's exact needs, so you can write your own formats to output exactly what you want. However, one common ask was to use 90% of a built-in format, but tweak small parts of it. Before 3.0, the only way to do that would be to copy and paste the format source code from Style Dictionary into your own custom format and then make your tweaks.

In 3.0, we have added format helpers. Format helpers are functions that the built-in formats use for things like formatting each token definition line, sorting the tokens, and displaying a file header comment. These functions are now part of the public API, which you can access with StyleDictionary.formatHelpers. Format helpers should make it simple to build custom formats.

```javascript
const StyleDictionary = require('style-dictionary');

const { formattedVariables } = StyleDictionary.formatHelpers;

module.exports = {
  format: {
    myFormat: ({ dictionary, options, file }) => {
      const { outputReferences } = options;
      return formattedVariables({
        dictionary,
        outputReferences,
        formatting: {
          prefix: '$',
          separator: ':',
          suffix: ';'
        }
      });
    }
  }
}
```

Example: https://github.com/amzn/style-dictionary/tree/main/examples/advanced/format-helpers

### Updated format method arguments

https://github.com/amzn/style-dictionary/pull/533

We wanted to make the format method signature easier to work with by not relying on positional arguments and instead used named arguments in the form of an object that can be destructured. But we also didn't want to break anyone's custom formats so we did it in a backwards compatible way. We did this by overloading the first argument sent to the formatter method, which is the dictionary object.

Old way:

```javascript
StyleDictionary.registerFormat({
  name: 'myCustomFormat',
  formatter: (dictionary, platform, file) {
    // ...
  }
});
```

New way:

```javascript
StyleDictionary.registerFormat({
  name: 'myCustomFormat',
  formatter: ({dictionary, platform, file, options}) {
    // ...
  }
});
```

The old way will continue to work, but we recommend changing to the new way at some point. For a full list of the information sent to the formatter function, see: https://github.com/amzn/style-dictionary/blob/3.0/docs/formats.md#creating-formats

You might also notice a new part of the information sent to the formatter method: `options`. This object will a merged version of an `options` object at the platform-level configuration and file-level configuration where the file takes precedence. This allows for a cascading of configuration from the platform to the file and so you don't have to repeat the same options for multiple files like the `showFileHeader` option. 

```json5
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "options": {
        "showFileHeader": false,
        // ouputReferences is a new option added in 3.0!
        "outputReferences": true
      },
      "transformGroup": "css",
      "files": [{
        // this file will inherit the platform options above
        "destination": "variables.css",
        "format": "css/variables"
      },{
        // this file overrides the platform options
        "destination": "variablesWithoutReferences.css",
        "format": "css/variables",
        "options": {
          "showFileHeader": true,
          "outputReferences": false
        }
      }]
    }
  }
}
```

Previously, there wasn't much convention around adding extra configuration at the platform and file-level for transforms, formats, and actions. We want to start correcting that a bit by using an `options` object at the file and platform level. 

### Custom file headers

When we started Style Dictionary, our intention was that the code it generates would not be checked into version control. To make that very apparent we added a code comment at the top of every built-in format that says it is a generated file with a timestamp of when it was generated. Over the years we have seen many different use-cases and patterns emerge from using Style Dictionary. One of those is actually checking in generated files to version control and using a pull request to review and verify the results. Having a time-stamped comment in generated files now becomes a bit of an obstacle. In the principle of extensibility and customization, you can now define your own file header comments for output files! This allows you to remove the timestamp if you want, write a custom message, use the version number of the package, or even use a hash of the source so that it only changes when the source changes.

You can use the custom file headers on any built-in format, or even use them in a custom format with the formatHelper.fileHeader function.

```javascript
module.exports = {
  //...
  fileHeader: {
    myFileHeader: (defaultMessage) => {
      return [
        ...defaultMessage,
        'hello, world!'
      ]
    }
  },

  platforms: {
    css: {
      transformGroup: `css`,
      files: [{
        destination: `variables.css`,
        format: `css/variables`,
        fileHeader: `myFileHeader`
      }]
    }
  }
}
```

Example: https://github.com/amzn/style-dictionary/tree/main/examples/advanced/custom-file-header

### Typescript support

https://github.com/amzn/style-dictionary/pull/410

Style Dictionary has Typescript types now! We have added support both for generating typescript files with the typescript/es6-declarations and typescript/module-declarations formats, as well as type definitions for using the Style Dictionary module in a Typescript environment. The source code of Style Dictionary remains in plain Javascript for now, but many people have been wanting to use Style Dictionary in Typescript so as an interim solution we added just the type definitions. As an added bonus, the type definitions also help Javascript Intellisense in VSCode even if you aren't using Typescript in your project!

Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)!

### More built-ins

We added support for: Jetpack Compose, React Native, and Stylus with built-in transforms, transform groups, and formats. Style Dictionary is built to be customized and extended, so any language or platform can be supported with customization. We do want to offer a core set of generic transforms and formats to get you started so that you don't have to write custom code for everything. If you think we are missing something, please let us know! Here are the formats, transforms, and transformGroups we added in 3.0:

#### Formats

* [`javascript/module-flat`](https://github.com/amzn/style-dictionary/pull/457), thanks [@noslouch](https://github.com/noslouch)!
* [`android/resources`](https://github.com/amzn/style-dictionary/pull/509)
* [`stylus/variables`](https://github.com/amzn/style-dictionary/pull/527), thanks [@klausbayrhammer](https://github.com/klausbayrhammer)
* [`compose/object`](https://github.com/amzn/style-dictionary/pull/599), thanks [@bherbst](https://github.com/bherbst)
* [`typescript/es6-declarations`](https://github.com/amzn/style-dictionary/pull/557), thanks [@Tiamanti](https://github.com/Tiamanti)
* [`typescript/module-declarations`](https://github.com/amzn/style-dictionary/pull/557), thanks [@Tiamanti](https://github.com/Tiamanti)

#### Transforms

* [`size/pxToRem`](https://github.com/amzn/style-dictionary/pull/491), thanks [@jbarreiros](https://github.com/jbarreiros)!
* [`size/object`](https://github.com/amzn/style-dictionary/pull/512), thanks [@levi-pires](https://github.com/levi-pires)
* [`size/compose/remToSP`](https://github.com/amzn/style-dictionary/pull/599), thanks [@bherbst](https://github.com/bherbst)
* [`size/compose/remToDP`](https://github.com/amzn/style-dictionary/pull/599), thanks [@bherbst](https://github.com/bherbst)
* [`size/compose/em`](https://github.com/amzn/style-dictionary/pull/599), thanks [@bherbst](https://github.com/bherbst)
* [`color/composeColor`](https://github.com/amzn/style-dictionary/pull/599), thanks [@bherbst](https://github.com/bherbst)
* [Made base pixel size configurable](https://github.com/amzn/style-dictionary/pull/505), thanks [@jbarreiros](https://github.com/jbarreiros)!

#### Transform Groups

* [`react-native`](https://github.com/amzn/style-dictionary/pull/512), thanks [@levi-pires](https://github.com/levi-pires)
* [`compose`](https://github.com/amzn/style-dictionary/pull/599), thanks [@bherbst](https://github.com/bherbst)

### Bug fixes

* [Trailing slash check on windows](https://github.com/amzn/style-dictionary/pull/419), thanks [@JDansercoer](https://github.com/JDansercoer)!
* [Clean config path in CLI](https://github.com/amzn/style-dictionary/pull/454), thanks [@tehkaiyu](https://github.com/tehkaiyu)!
* [Fixing max call stack bug on json/nested format](https://github.com/amzn/style-dictionary/pull/465)
* [Fix transform options type](https://github.com/amzn/style-dictionary/pull/502), thanks [@amalik2](https://github.com/amalik2)!

### Other features

* [Don't generate files if there are no tokens](https://github.com/amzn/style-dictionary/pull/494) thanks [@davidyeiser](https://github.com/davidyeiser)

### Better testing

To have higher confidence in the end-to-end experience of Style Dictionary we have added integration tests that run Style Dictionary as real users would. Integration tests are in **__integration__** and use snapshot testing to ensure the output of Style Dictionary from input, transforms, and formats remains the same and valid output. 

We have also added more unit tests as well for some features we have added and bugs we have found. We added:

* 28 test suites
* 174 tests
* 69 snapshots

### Dropping support for older versions of node

https://github.com/amzn/style-dictionary/pull/441

To be honest, we should have done this way sooner. Those versions of Node are no longer even in long-term support or maintenance. Hopefully this change should not affect anyone as you should all be on more recent versions of Node anyways. 
