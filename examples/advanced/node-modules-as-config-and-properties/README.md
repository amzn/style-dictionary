## Node Modules as Config and Property files

This example shows some advanced features using Style Dictionary with node modules. Make sure you are familiar with Style Dictionary concepts first by reading the [docs](https://amzn.github.io/style-dictionary) or taking a look at the [basic example](../../basic) first.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will run the Style Dictionary CLI with the config.js as the configuration file and will generate the files in the `build` folder.

#### How does it work?

Style Dictionary understands node modules that export a simple object for both a config file as well as the property source files. Using node module exports allows you to do some pretty cool things like generating properties programmatically  (design tokens).

The `.extend()` method on the Style Dictionary module can take an object or a path to a JSON or node module and it copies the object attributes onto a new copy of the Style Dictionary object. The Style Dictionary object stores the transforms, transformGroups, and formats as attributes on the SD object. You can override these defaults by directly adding these attributes to your config object. This allows you to add custom transforms and formats without calling `.registerTransform()`!

#### What to look at

The [`config.js`](config.js) file is the first thing to look at. It has a lot of comments how everything works. It shows how you can add custom transforms and formats without calling the register methods. It also shows how you can extend built-in transforms and transformGroups.

If you take a look at any of the `index.js` files in `properties/` or `components/` you can see how using node module exports can simplify the object structure. Now you don't have to copy the same top-level object paths in the JSON object. Some specific files to look at:

* [`components/index.js`](components/index.js) Uses node module export/require to merge the property files together without Style Dictionary
* [`components/button/primary.js`](components/button/primary.js) Extends a default set of properties
* [`properties/color/core.js`](properties/color/core.js) Creates a color ramp programmatically based on base colors
