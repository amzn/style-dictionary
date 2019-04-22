## Component CTI Structure

This example will show you one way to define component tokens in an easy way while still using the CTI attributes.

### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, if you want to build the tokens run `npm run build`. This command will generate the files in the `build` folder.


### How does it work

Style Dictionary allows for extensibility through [monkey patching](https://en.wikipedia.org/wiki/Monkey_patch). This allows you to override default behavior of the Style Dictionary library, and any built-in transforms and formats. You can override built-in transforms and formats by adding ones with the same name. Also, all of the built-in transforms, transformGroups, and formats are available by accessing them in the Style Dictionary library under the attributes `transform`, `transformGroup`, and `format` respectively. For example:

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

### Why do this?

The CTI structure for Style Dictionary tokens makes defining component-level tokens really cumbersome and not user-friendly. Instead, when defining component tokens it makes more sense to structure them more like CSS. `component.button.background-color` makes more sense than `color.background.button`


### What to look at

* `config.js`:
  * `propertiesToCTI`: A plain object where we map the CSS property name to the proper category and type.
  * `CTITransform`: A transform object that defines a transformer method, which will override the default `attribute/cti` transform. This is similar to creating a child class with some custom logic and then calling `super`. In the transformer function it first looks at the top-level namespace, the first item in the object path, and if it is 'component' we run our custom logic using the `propertiesToCTI` map. If it is not 'component', use the built-in `attribute/cti`.
* `tokens/component/button.json`: Take a look at how it defines the component tokens and uses the last part of the object path as the CSS property. Notice how we can define token values in here that are not references, but they still get transformed properly: font-size uses 'rem' and background-color uses hex in the output.