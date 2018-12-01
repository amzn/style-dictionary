# Package Structure

Style dictionaries are configuration driven. A style dictionary package must contain a configuration and reference a path to property files. You can optionally include assets in your package.

Here is a basic example of what a style dictionary package looks like.

```
├── config.json
├── properties/
│   ├── size/
│       ├── font.json
│   ├── color/
│       ├── font.json
│   ...
├── assets/
│   ├── fonts/
│   ├── images/
```


| Name | Description |
| :--- | :--- |
| config.json | This is where the [configuration](config.md) for the style dictionary lives, where you define what happens when Style Dictionary runs |
| property files | [Properties](properties.md) are saved as a collection of JSON or JS module files. We usually keep them in a `properties` directory, but you can put them wherever you like - the path to them should be in the `source` attribute on your `config.json` file. |
| assets (optional) | Assets can be included in your style dictionary package, allowing you to keep them in your style dictionary as a single source of truth. |


## Assets

Assets are not required, but can be useful to include in your style dictionary. If you don't want to manage having assets like images,
vectors, font files, etc. in multiple locations, you can keep them in your style dictionary as a single source of truth.

> Coming soon: how to generate image assets based on your style dictionary
