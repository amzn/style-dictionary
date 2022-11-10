## Filters

This example shows how to use built-in and custom filters to the design tokens.

Filters are functions that might remove according to some conditions a design token from the output distribution.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will generate the files in the `build` folder.

#### How does it work a built-in filter?

Currently StyleDictionary supports just the following built-in filters:

- removePrivate

You have to apply it in the `config.json` file:

```
"scss": {
  "buildPath": "build/web/",
  "files": [{
    "destination": "colors.scss",
    "filter": "removePrivate",
    "format": "scss/variables"
  }]
}
```

The StyleDictionary will take care of filtering out proper design tokens from the source of truth:

```
{
  "color": {
    "gray": {
      "light" : {
        "value": "#CCCCCC",
        "group": "color",
        "private": true
      },
      "medium": {
        "value": "#999999",
        "group": "color"
      },
      "dark"  : {
        "value": "#111111",
        "group": "color"
      }
    },
  }
}
```

#### How does it work a custom filter?

To declare a custom **filter**, you have to call the `registerFilter` method:

```
StyleDictionary.registerFilter({
  name: 'isTextTransform',
  matcher: function(token) {
    return token.attributes.category === 'font' && token.value.includes['lowercase', 'uppercase]
  }
});
```

You have to apply it in the `config.json` file:

```
"scss": {
  "buildPath": "build/web/",
  "files": [{
    "destination": "fonts.scss",
    "filter": "isTextTransform",
    "format": "scss/variables"
  }]
}
```

The StyleDictionary will take care of filtering out proper design tokens from the source of truth:

```
{
  "fonts": {
    "title-transform": {
      "value": "uppercase", // included
      "group": "font"
    },
    "title-size": {
      "value": "36px", // excluded
      "group": "font"
    }
  }
}
```

More information can be found on the [documentation](https://amzn.github.io/style-dictionary/#/api?id=registerfilter).
