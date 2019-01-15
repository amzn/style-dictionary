## Style Dictionary as an npm module

This example shows how to set up a style dictionary as an npm module, either to publish to a local npm service or to publish externally.

When you publish this npm module, the `prepublishOnly` hook will run, calling the style dictionary build system to create the necessary files.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, run `npm run build`. This command will generate the files in the `build` folder.


#### What to look at

Open the `package.json` file and see how in this specific example there is an extra [`prepublishOnly`](https://docs.npmjs.com/misc/scripts) command script, that builds the dictionary.

This command is run automatically before the package is prepared and packed via the `npm publish` command.