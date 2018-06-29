# Package Structure

Style dictionaries are configuration driven.

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
| config.json | This is where the [`configuration`](config) for the style dictionary lives, where you define what happens when Style Dictionary runs |
| properties | Properties are saved as a collection of JSON files. We usually keep them in a `properties` directory, but you can put them wherever you like, they just need to be referenced in the `source` attribute on your `config.json` file. |

Style properties are what make up a style dictionary. You can structure your properties however you want to, the only requirement is the property contains a "value" attribute. This is how the build system knows which nodes are properties as opposed to structure. This allows you to have different levels of nesting.

```json
{
  "color": {
    "font": {
      "base":  { "value": "#111111" },
      "inverse": {
        "base": { "value": "#EEEEEE" }
      }
    }
  }
}
```

The above JSON snippet has 2 style properties, `color.font.base` and `color.font.inverse.base`. So you can have style properties defined at any level in the JSON structure.

## Assets

Assets are not required, but can be useful to include in your style dictionary. If you don't want to manage having assets like images,
vectors, font files, etc. in multiple locations, you can keep them in your style dictionary as a single source of truth.

> Coming soon: how to generate image assets based on your style dictionary
