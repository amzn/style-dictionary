<img src="assets/logo.png" alt="Style Dictionary logo" title="StyleDictionary" width="150" align="right" />

[![npm version](https://img.shields.io/npm/v/style-dictionary.svg?style=flat-square)](https://badge.fury.io/js/style-dictionary)
![license](https://img.shields.io/npm/l/style-dictionary.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/amzn/style-dictionary.svg?style=flat-square)](https://travis-ci.org/amzn/style-dictionary)
[![code climate](https://img.shields.io/codeclimate/github/amzn/style-dictionary.svg?style=flat-square)](https://codeclimate.com/github/amzn/style-dictionary)

# Style Dictionary
> *Style once, use everywhere.*

A Style Dictionary is a system that allows you to define styles once, in a way for any platform or language to consume. A single place to create and edit your styles, and a single command exports these rules to all the places you need them - iOS, Android, CSS, JS, HTML, sketch files, style documentation, etc. It is available as a CLI through npm, but can also be used like any normal node module if you want to extend its functionality.

When you are managing user experiences, it can be quite challenging to keep styles consistent and synchronized across multiple development platforms and devices.  At the same time, designers, developers, PMs and others must be able to have consistent and up-to-date style documentation to enable effective work and communication.  Even then, mistakes inevitably happen and the design may not be implemented accurately.  StyleDictionary solves this by automatically generating style definitions across all platforms from a single source - removing roadblocks, errors, and inefficiencies across your workflow.


__A style dictionary consists of:__
1. [Style properties](#style-properties) organized in JSON files
1. Static assets that can be used across platforms

__What a style dictionary does:__
1. Allows the style properties and assets to be consumed in any platform or language

Let's take a look at a very basic example.

```json
{
  "size": {
    "font": {
      "small" : { "value": "10px" },
      "medium": { "value": "16px" },
      "large" : { "value": "24px" },
      "base"  : { "value": "{size.font.medium.value}" }
    }
  }
}
```

Here we are creating some basic font size properties. The style property `size.font.small` is "10px" for example. The style definition size.font.base.value automatically takes on the value found in size.font.medium.value, so both of those resolve to "16px".

Now what the style dictionary build system will do with this information is convert it to different formats so that you can use these values in any type of codebase. From this one file you can generate any number of files like:

```scss
$size-font-small: 10px;
$size-font-medium: 16px;
$size-font-large: 24px;
$size-font-base: 16px;
```

```xml
<dimen name="font-small">10sp</dimen>
<dimen name="font-medium">16sp</dimen>
<dimen name="font-large">24sp</dimen>
<dimen name="font-base">16sp</dimen>
```

```objectivec
float const SizeFontSmall = 10.00f;
float const SizeFontMedium = 16.00f;
float const SizeFontLarge = 24.00f;
float const SizeFontBase = 16.00f;
```

This is a very simple example, take a deeper dive into the style dictionary framework in

The style dictionary framework is completely extensible and modular so you can create any type of file from a style dictionary.
If there is a new language, platform, file type, you can extend the style dictionary framework to create the files you need.

__Some other things you can build with a style dictionary__
1. Images and graphics
1. Sketch files
1. Documentation site
1. _Literally anything_


## Style Properties

> Synonyms: design token, design variable, design constant, atom

A style property is a key/value data to describe any fundamental/atomic visual properties. This information is stored in a canonical
source, the style dictionary, and transformed for use in different platforms, languages, and contexts. A simple example is a color.
A color can be represented in many ways, all of these are the same color: `#ffffff`, `rgb(255,255,255)`, `hsl(0,0,1)`.

A style dictionary organizes style properties in a structured way for easy access. Style properties are organized as a deep object
with the leaf nodes being the style properties.

```json
{
  "color": {
    "font": {
      "base": { "value": "#111111" },
      "secondary": { "value": "#333333" },
      "tertiary": { "value": "#666666" },
      "inverse": {
        "base": { "value": "#ffffff" }
      }
    }
  }
}
```

In this example there are 4 style properties: `color.font.base`, `color.font.secondary`, `color.font.tertiary`, and `color.font.inverse.base`.
A style property is any object in the JSON that has a `value` attribute on it. In this way you can nest properties at different levels.
This allows you to easily access the property as well as do things like get all the inverse font colors.


## Contributing

Please help make this framework better. For more information take a look at [CONTRIBUTING.md](https://github.com/amzn/style-dictionary/blob/master/CONTRIBUTING.md)


## License

[Apache 2.0](https://github.com/amzn/style-dictionary/blob/master/LICENSE)
