## Format Helpers

This example shows how to use the format helper methods to create custom formats.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use _yarn_ update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will run the Style Dictionary CLI with the **sd.config.js** as the configuration file and will generate the files in the `build` folder.

#### How does it work?

Starting in version 3.0, Style Dictionary exposes internal helper methods for formats. In the configuration we are defining custom formats using some of those format helper methods.

#### What to look at

The [`sd.config.js`](sd.config.js) file has everything you need to know.
