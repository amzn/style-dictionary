## Custom transforms (and transformGroups)

This example shows how to use custom transforms (and transformGroups) to apply custom "transformations" to the design tokens.

Transforms are functions that modify a design token (in a non-destructive way). The reason for *transforms* is that in this way each platform can consume the token in different ways (eg. changing *pixel* values to *pt* values for iOS, and *dp* or *sp* for Android).

**Remember**: transforms are performed sequentially, hence the order you use transforms matters.

The need for custom transforms is that Style Dictionary expects the tokens to be declared according to certain criteria, to use the pre-defined transforms and formats/templates. For example, the *web* transformGroup consists of the *attribute/cti*, *name/cti/kebab*, *size/px* and *color/css* transforms.
The *size/px* adds 'px' to the end of the number, and is applied only if `token.attributes.category === 'size'`. This means that your token needs to be expressed without units, and be under the *'size'* "category. If you need a different logic or you want to organize your tokens differently, probably you can't use the out-of-the-box transformation groups, but you have to declare your custom ones.

If [custom formats](../custom-formats-with-templates/) are the way to allow users to customize the format of the *output* of Style Dictionary, custom transforms are the way to allow them to customize both the *input* (the token names/values/attributes) and the *output* (the actual values expressed in the design tokens). For this reasons, custom transforms are probably one of the **most powerful features** of Style Dictionary: they make it extremely versatile, allowing limitless possibilities of extension and customization of the entire design token pipeline.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will generate the files in the `build` folder.

#### How does it work

To declare a custom **transform**, you have to call the `registerTransform` method:

```
StyleDictionary.registerTransform({
  name: 'ratio/%',
  type: 'value',
  matcher: function(token) {
      return token.group === 'ratio';
  },
  transformer: function(token) {
      return `${Math.floor(100 * token.value)}%`;
  }
});
```

More information can be found on the [documentation](https://amzn.github.io/style-dictionary/#/api?id=registertransform).

To use this new custom transform, we need to create a new custom transformGroup that references it.

To register this custom **transformGroup** , you have to call the `registerTransformGroup` method:

```
StyleDictionary.registerTransformGroup({
  name: 'custom/web',
  transforms: ['...', 'ratio/%', '...']
});
```

More information can be found on the [documentation](https://amzn.github.io/style-dictionary/#/api?id=registertransformgroup).

Once registered, the custom group can be associated to one or more **platforms** in the `config.json` file:

```
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "web": {
      "transformGroup": "custom/web",
      "buildPath": "build/web/",
      "files": [{
        "destination": "tokens.js",
        "format": "javascript/es6"
      }]
  ...

```

When you register a new group, you can use a new array of transforms, or you can "extend" an existing group (see the code in the `build.js` file). Even though the second option seems simpler, we suggest to always declare explicitly your array: it's clearer to see what transformations will be applied, and you will always be in full control of the code.

Tip: to know what transforms are included in a pre-defined group you can [refer to the documentation](https://amzn.github.io/style-dictionary/#/transform_groups) or you can add a `console.log(StyleDictionary.transformGroup['group_name'])`
in your code and look the array of transforms associated with the it, directly in your console.

#### What to look at

Open the `config.json` file and see how for each platform there is a `transformGroup` declaration. In this specific example, all the transformGroups applied to the platforms are custom.

Now open a token file (eg. `tokens/colors|font|spacing.json`) to see how we have associated custom attributes to the tokens, to be used later in the matchers functions. See also how the values are unit-less, where the units are applied at build time accordingly to the destination platform. Compare the values in the input JSON files, and the values that appear in the files generated in `build`, and you will see where and how the transformations have been applied.

Now open the `build.js` script and look at how these custom transforms/transformGroups are declared and registered via the `registerTransform` and `registerTransform` API methods. We have added as many comments as possible to make the code clear and show the interesting parts of it.

A few things to notice in the file:

- the name of a custom "transform" can be the same as an existing pre-defined method; in that case, the pre-defined method is overwritten
- beyond the existing attributes, you can use custom attributes to create  **matcher** functions, used to filter the tokens and apply the transform only to those that match the filter condition.
- if you don't specify a **matcher**, the transformation will be applied to all the tokens
- the transformation can be applied not only to the **value** of a token, but also to its **name** (and also to its attributes)


**IMPORTANT**: the registration of custom transforms needs to be done _before_ applying the configuration (the methods needs to be already declared and registered in Style Dictionary to be used when extending it with the configuration). See the code in the `build.js` for more details.
