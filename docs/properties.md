# Definitions and Properties

Properties are specific style information that you want to use in your deliverables. From a programmatic point of view, the property of size.font.small is an object containing multiple attributes, with each attribute providing specific information about size.font.small.

Attributes are the key/object pairs in a definition. The most important (and only required) attribute is "value", which provides the data that will be used throughout the build process (and ultimately used for styling in your deliverables). You can include any custom attributes you would like (e.g. "comment" with a string or "metadata" as an object with its own attributes).

Here you can see a property of "size.font.small" with two attributes:
1. the required Attribute "value" set to "10"
1. an Attribute of "comment"

# Example Property
```json
{
  "size": {
    "font": {
      "small" : {
        "value": "10",
        "comment": "the smallest font allowed for readability"
      },
    }
  }
}
```

Any property which is a string is a shorthand for that property having a value of that string.  E.g this

# Shorthand
```json
{
  "size": {
    "font": {
      "small" : "10"
    }
  }
}
```

is equivalent to this:

# Extended
```json
{
  "size": {
    "font": {
      "small" : { "value": "10" },
    }
  }
}
```

You should set multiple properties in a single file using the [`Category / Type / Item (CTI)`](#category-type-item-(cti)) method
# Multiple Properties "size.font.\*"
```json
{
  "size": {
    "font": {
      "small" : { "value": "10" },
      "medium": { "value": "16" },
      "large" : { "value": "24" },
    }
  }
}
```

You can reference (alias) Attributes by wrapping the reference chain in brackets

# Attribute reference / alias
```json
{
  "size": {
    "font": {
      "small" : { "value": "10" },
      "medium": { "value": "16" },
      "large" : { "value": "24" },
      "base"  : { "value": "{size.font.medium.value}" }
    }
  }
}
```

You can reference (alias) Properties the same way

# Property reference / alias
```json
{
  "size": {
    "font": {
      "small" : { "value": "10" },
      "medium": { "value": "16" },
      "large" : { "value": "24" },
      "base"  : "{size.font.medium}"
    }
  }
}
```


#### Category / Type / Item (CTI)

This is not required by any means, but we feel this classification structure of style properties makes the most sense semantically. Style properties can be organized into a hierarchical tree structure with the top level, category, defining the primitive nature of the property. For example, we have the color category and every property underneath is always a color. As you proceed down the tree, you get more specific about what that color is. Is it a background color, a text color, or a border color? What kind of text color is it? You get the point. It's like the animal kingdom classification:

![](assets/cti.png)

Now you can structure your property json files like simple objects:

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
