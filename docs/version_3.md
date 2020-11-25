# Version 3.0!

We have been working hard the past few months on a number of features and improvements we wanted to combine into a major release. Our aim is that is next version is backwards compatible, we thought it was a good idea to move to a new major version because we are changing a core part of how Style Dictionary works. 

If you would like to get a pre-release of 3.0, use the `next` tag to install Style Dictionary:

`npm install --save-dev style-dictionary@next`

If you find any bugs or issues, please file tickets so we can get things fixed before we release it to the wider community. Thanks!

### Transitive transforms

This is the big one that required a big re-architecture of how the Style Dictionary build process works. 

Up until now the build process looked like this: https://amzn.github.io/style-dictionary/#/build_process
After merging all of the token files, it would go through the merged object and transform tokens it found, but only do value transforms on tokens that did not reference another token. The original intent here was that if you have a color for example, the value of it should be the same for all references of it, so we only need to do a value transform once. Then after all tokens are transformed, resolve all aliases/references. 

However, we heard from the community there were a number of reasons why someone might want to transform the value of an aliased token. 

* https://github.com/amzn/style-dictionary/issues/451
* https://github.com/amzn/style-dictionary/issues/452
* https://github.com/amzn/style-dictionary/issues/208

The new build process is similar, except that it does multiple passes of transforming and resolving aliases and defers transforms if the token has an unresolved alias. Each pass might reveal tokens that are ready to be transformed in the next pass. Take this example:

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

### Custom parser support

https://github.com/amzn/style-dictionary/pull/429

We are pretty excited about this. Until now you could only define your design tokens in either JSON, JSON5, or plain Node modules. The addition of custom parser support allows you to define your tokens in any language you like! The most obvious use-case is to use YAML which has a cleaner and less verbose syntax than JSON. But really the sky is the limit. You can now keep your source of truth in any file format you like as long as you can parse it into an object that Style Dictionary can understand. You register a custom parser like you would a custom transform or format. A parser consists of a pattern to match against files, similar to the test attribute in a loader in Webpack, and a parse function which gets the file path and its contents and is expected to return an object.

* Example: https://github.com/amzn/style-dictionary/tree/3.0/examples/advanced/custom-parser
* YAML example: https://github.com/amzn/style-dictionary/tree/3.0/examples/advanced/yaml-tokens

TODO: Fix README in example


### Adding filePath and isSource entries on tokens

https://github.com/amzn/style-dictionary/pull/356

Style Dictionary adds some metadata on each token before any transforms take place in order to give more context for transforming and formatting tokens. For example, this design token: 

```json
{
  "color": {
    "red": { "value": "#ff0000" }
  }
}
```

Turns into this:

```json
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

### Typescript typings

https://github.com/amzn/style-dictionary/pull/410

Added typings for Style Dictionary so you can use it in a TypeScript environment now!

Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)!

### Formats

* [Adding javascript/module-flat format](https://github.com/amzn/style-dictionary/pull/457), thanks [@noslouch](https://github.com/noslouch)!
* Removing filters inside Android formats: WIP

### Bug fixes

* [Trailing slash check on windows](https://github.com/amzn/style-dictionary/pull/419), thanks [@JDansercoer](https://github.com/JDansercoer)!
* [Clean config path in CLI](https://github.com/amzn/style-dictionary/pull/454), thanks [@tehkaiyu](https://github.com/tehkaiyu)!
* [Fixing max call stack bug on json/nested format](https://github.com/amzn/style-dictionary/pull/465)

### Dropping support for older versions of node

https://github.com/amzn/style-dictionary/pull/441

To be honest, we should have done this way sooner. Those versions of Node are no longer even in long-term support or maintenance. Hopefully this change should not affect anyone as you should all be on more recent versions of Node anyways. 


### To do

* Use ES6 where possible
* Better log levels
* Update documentation
