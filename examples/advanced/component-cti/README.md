## Component CTI Structure

This example will show you one way to define component tokens in a simple way while still using the CTI attributes for transforming the tokens. The CTI structure for Style Dictionary tokens makes defining component-level tokens cumbersome and not user-friendly. This is because the CTI of tokens is based on the object path of the token. Now, if you wanted to write tokens for a button component it would have to look something like this:

```json
{
  "size": {
    "padding" : {
      "button": { "value": "{size.padding.base.value}" }
    },
    "font": {
      "button": { "value": 2 }
    }
  },

  "color": {
    "font": {
      "button": {
        "primary": { "value": "{color.font.inverse.value}" },
        "secondary": { "value": "{color.font.link.value}" }
      }
    },

    "background": {
      "button": {
        "primary": { "value": "hsl(10, 80, 50)" },
        "secondary": { "value": "{color.background.primary.value}" }
      }
    }
  }
}
```

Instead, when defining component tokens it makes more sense to structure them more like CSS. `component.button.background-color` makes more sense than `color.background.button`. Here is what the component tokens would look like in this new structure:

```json
{
  "component": {
    "button": {
      "padding": { "value": "{size.padding.medium.value}" },
      "font-size": { "value": 2 },
      
      "primary": {
        "background-color": { "value": "hsl(10, 80, 50)" },
        "color": { "value": "{color.font.inverse.value}" }
      },
      
      "secondary": {
        "background-color": { "value": "{color.background.primary.value}" },
        "color": { "value": "{color.font.link.value}" }
      }
    }
  }
}
```

### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, if you want to build the tokens run `npm run build`. This command will generate the files in the `build` folder.


### How does it work

All of the built-in transforms target tokens using the CTI attributes. The built-in [`attribute/cti`](https://amzn.github.io/style-dictionary/#/transforms?id=attributecti) transform adds the CTI attributes to each token based on the object path of the token. In this example we override the default behavior of the [`attribute/cti`](https://amzn.github.io/style-dictionary/#/transforms?id=attributecti) transform to apply CTI attributes based on token's key, or last part of the object path to generate the equivalent category and type. This way we can correctly map a token with an object path of `component.button.background-color` to a category of `color` and type of `background`. 

Style Dictionary allows for extensibility through [monkey patching](https://en.wikipedia.org/wiki/Monkey_patch). This allows you to override the default behavior of the Style Dictionary library, and any built-in transforms and formats. You can override built-in transforms and formats by adding ones with the same name. Also, all of the built-in transforms, transformGroups, and formats are available by accessing them in the Style Dictionary library under the attributes `transform`, `transformGroup`, and `format` respectively. For example:

```javascript
const StyleDictionary = require('style-dictionary');

const cti = StyleDictionary.transform['attribute/cti'];
// {
//   type: 'attribute',
//   transformer: f () {}
// }
```

In this example we monkey patch the `attribute/cti` transform to look at the top-level namespace of the token and if it is 'component', instead of running the default `attribute/cti` transform, it instead looks at the last part of the object path to generate the equivalent category and type.

For example, if the key of the token (the last part of the object path) is "background-color", the monkey patched `attribute/cti` transform will return a category of 'color' and type of 'background'. This example uses CSS property names, but you could also change it to use similar React/CSS-in-JS names like 'backgroundColor' instead of 'background-color'.

### What to look at

* `config.js`:
  * `propertiesToCTI`: A plain object where we map the CSS property name to the proper category and type.
  * `CTITransform`: A transform object that defines a transformer method, which will override the default `attribute/cti` transform. This is similar to creating a child class with some custom logic and then calling `super`. In the transformer function it first looks at the top-level namespace, the first item in the object path, and if it is 'component' we run our custom logic using the `propertiesToCTI` map. If it is not 'component', use the built-in `attribute/cti`.
* `tokens/component/button.json`: Take a look at how it defines the component tokens and uses the last part of the object path as the CSS property. Notice how we can define token values in here that are not references, but they still get transformed properly: font-size uses 'rem' and background-color uses hex in the output.
