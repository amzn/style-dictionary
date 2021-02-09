# Version 3.0!

We have been working hard the past few months on a number of features and improvements we wanted to combine into a major release. Though we intend that 3.0 to be backwards compatible, we thought it was a good idea to move to a new major version because we are changing a core part of how Style Dictionary works. 

If you would like to get a pre-release of 3.0, use the `next` tag to install Style Dictionary:

`npm install --save-dev style-dictionary@next`

If you find any bugs or issues, please file tickets so we can get things fixed before we release it to the wider community. Thanks!

### Transitive transforms

This is the big one that required a big re-architecture of how the Style Dictionary build process works. 

Up until now the build process looked like this: https://amzn.github.io/style-dictionary/#/build_process
After merging all of the token files, it would iterate through the merged object and transform tokens it found, but only do value transforms on tokens that did not reference another token. The original intent here was that a value of any reference should be the same for all references of it, so we only need to do a value transform once. Then after all tokens are transformed, resolve all aliases/references. 

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

Example (WIP): https://github.com/amzn/style-dictionary/pull/487

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
* android/resources
* ios-swift/class.swift
* flutter/class.dart

If you have custom formats you can make use of this feature too! The `dictionary` object that is passed as an argument to the formatter function has 2 new methods on it: `usesReference()` and `getReference()` which you can use to get the reference name. Here is an example of that:

```javascript
StyleDictionary.registerFormat({
  name: `myCustomFormat`,
  formatter: function(dictionary) {
    return dictionary.allProperties.map(token => {
      let value = JSON.stringify(token.value);
      // the `dictionary` object now has `usesReference()` and
      // `getReference()` methods. `usesReference()` will return true if
      // the value has a reference in it. `getReference()` will return
      // the reference to the whole token so that you can access its
      // name or any other attributes.
      if (dictionary.usesReference(token.original.value)) {
        const reference = dictionary.getReference(token.original.value);
        value = reference.name;
      }
      return `export const ${token.name} = ${value};`
    }).join(`\n`)
  }
})
```
### Custom parser support

https://github.com/amzn/style-dictionary/pull/429

We are pretty excited about this. Until now you could only define your design tokens in either JSON, JSON5, or plain Node modules. The addition of custom parser support allows you to define your tokens in any language you like! The most obvious use-case is to use YAML which has a cleaner and less verbose syntax than JSON. Now, the sky is the limit. Your source of truth can be in any file format you like as long as you can parse it into an object that Style Dictionary can understand. You register a custom parser the same way as you register a custom transform or format. A parser consists of a pattern to match against files, similar to the test attribute in a loader in Webpack, and a parse function which gets the file path and its contents and is expected to return an object.

* Example: https://github.com/amzn/style-dictionary/tree/3.0/examples/advanced/custom-parser
* YAML example: https://github.com/amzn/style-dictionary/tree/3.0/examples/advanced/yaml-tokens

TODO: Fix README in example


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

TODO: use filePath in error messages to help with debugging.

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

### Typescript typings

https://github.com/amzn/style-dictionary/pull/410

Added typings for Style Dictionary so you can use it in a TypeScript environment now!

Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)!

### Formats

* [Added 'javascript/module-flat' format](https://github.com/amzn/style-dictionary/pull/457), thanks [@noslouch](https://github.com/noslouch)!
* [Added 'android/resources' format](https://github.com/amzn/style-dictionary/pull/509)

### Transforms

* [Added 'size/pxToRem' transform](https://github.com/amzn/style-dictionary/pull/491), thanks [@jbarreiros](https://github.com/jbarreiros)!
* [Made base pixel size configurable](https://github.com/amzn/style-dictionary/pull/505), thanks [@jbarreiros](https://github.com/jbarreiros)!

### Bug fixes

* [Trailing slash check on windows](https://github.com/amzn/style-dictionary/pull/419), thanks [@JDansercoer](https://github.com/JDansercoer)!
* [Clean config path in CLI](https://github.com/amzn/style-dictionary/pull/454), thanks [@tehkaiyu](https://github.com/tehkaiyu)!
* [Fixing max call stack bug on json/nested format](https://github.com/amzn/style-dictionary/pull/465)
* [Fix transform options type](https://github.com/amzn/style-dictionary/pull/502), thanks [@amalik2](https://github.com/amalik2)!

### Other features

* [Don't generate files if there are no tokens](https://github.com/amzn/style-dictionary/pull/494) thanks [@davidyeiser](https://github.com/davidyeiser)

### Better testing

To have higher confidence in the end-to-end experience of Style Dictionary we have added integration tests that run Style Dictionary as real users would. Integration tests are in **__integration__** and use snapshot testing to ensure the output of Style Dictionary from input, transforms, and formats remains the same and valid output. 

We have also added more unit tests as well for some features we have added and bugs we have found. So far we have added:
* 11 test suites
* 84 tests
* 27 snapshots
### Dropping support for older versions of node

https://github.com/amzn/style-dictionary/pull/441

To be honest, we should have done this way sooner. Those versions of Node are no longer even in long-term support or maintenance. Hopefully this change should not affect anyone as you should all be on more recent versions of Node anyways. 


### To do

* Use ES6 where possible
* Better log levels
* Update documentation
