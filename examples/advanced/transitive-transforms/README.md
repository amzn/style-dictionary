## Transitive Transforms

Style Dictionary 3.0 added the ability to have transitive transforms, transforms that work on token values that reference/alias other tokens. This example shows a few ways to take advantage of transitive transforms.

Common use cases include:

- Referencing and modifying colors, such as brightening/darkening colors or adding transparencies to colors
- Splitting colors into re-usable parts, like having hue, lightness, and saturation shared across colors.


#### Running the example

First of all, set up the required dependencies running the command `npm ci` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, you can run `npm run build`. This command will generate output files in the `build` folder. For brevity, it only builds CSS variables as an output, but you could add any platforms to this example.

#### How does it work

In version 3.0, Style Dictionary added the ability to transitively transform token values, meaning you could transform a token value that referenced another token. This functionality allows you to now _modify_ a referenced value; darkening a color for example. This example does this by creating a custom transform that uses [chromajs](https://gka.github.io/chroma.js) to modify colors. 

You can also define data that isn't a design token itself, but can be referenced in a design token. This example defines [alpha](tokens/alpha.json5), [hue](tokens/hue.json5), [lightness](tokens/lightness.json5), and [saturation](tokens/saturation.json5) data that is then used elsewhere in design tokens. This works because how Style Dictionary handles references is very un-opinionated. When Style Dictionary sees any string attribute with curly braces, it will grab whatever it finds at that object path and replace the string with it. 

Before version 3.0, Style Dictionary did not have transitive transforms though. While you could reference non-token values, you would not be able to then transform the value if it had a reference in it. 

_NOTE: This example uses [json5](https://json5.org/) for the design tokens so that it can be marked up with comments for reference. If you are using plain JSON make sure to change the contents of the design token files accordingly._

#### What to look at

* **sd.config.js** This file holds the Style Dictionary configuration and custom transforms. It defines a custom transform that uses chromajs to modify color tokens that have a `modify` array on the token, which the transform uses to call certain methods on chromajs to modify the color.
* **tokens/** This directory holds all the design tokens being used for this example.
* **tokens/(alpha|hue|lightness|saturation).json5** These files define color parts that are used in color design tokens. Because these files don't use the `{"value": ""}` syntax like design tokens in Style Dictionary, they are not included in any output by default. But because they are included in the `source` they can still be referenced in design tokens. 
* **tokens/color/core.json5** This file defines a core color palette. The interesting thing here is that each color value is defined as an HSL object rather than a HEX string. The HSL value references hue, saturation, and lightness defined in the above files. 
* **tokens/color/overlay.json5** This file defines some overlay colors that reference core colors but modifies their transparency. 
* **tokens/color/font.json5** This file defines some font colors by modifying core colors.