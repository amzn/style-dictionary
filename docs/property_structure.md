# Property Structure

Style properties are what make up a style dictionary. You can structure your properties however you want to, the only requirement is the property contains a "value" attribute. This is how the build system knows which nodes are properties as opposed to structure.

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

The above JSON snippet has 2 style properties, color.font.base and color.font.inverse.base. So you can have style properties defined at any level in the JSON structure. 

## Category / Type / Item

This is not required by any means, but we feel this classification structure of style properties makes the most sense semantically. Style properties can be organized into a hierarchical tree structure with the top level, category, defining the primitive nature of the property. For example, we have the color category and every property underneath is always a color. As you proceed down the tree, you get more specific about what that color is. Is it a background color, a text color, or a border color? What kind of text color is it? You get the point. Now you can structure your property json files like simple objects:

```json
{
  "size": {
    "font": {
      "base":  { "value": "16" },
      "large": { "value": "20" }
    }
  }
}
```

The CTI is implicit in the structure, the category is 'size' and the type is 'font', and there are 2 properties 'base' and 'large'.

Structuring style properties in this manner gives us consistent naming and accessing of these properties. You don't need to remember if it is button_color_error or error_button_color, it is color_background_button_error!

You can organize and name your style properties however you want, there are no restrictions. But there are a good amount of helpers if you do use this structure, like the 'attribute/cti' transform which adds attributes to the property of its CTI based on the path in the object. There are a lot of name transforms as well for when you want a flat structure like for sass variables.

Also, the CTI structure provides a good mechanism to target transforms for specific kinds of properties. All of the transforms provided by the framework use the CTI structure to know if it should be applied. For instance, the 'color/hex' transform only applies to properties of the category 'color'.
