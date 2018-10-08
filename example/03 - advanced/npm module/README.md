## Style Dictionary as an npm module

This simple example shows how to set up a style dictionary as an npm module, either to publish to a local npm service or to publish externally.

When you publish this npm module, the `prepublish` hook will run, calling the style dictionary build system to create the necessary files.

If you want you can run `npm run build` in your local CLI environment, to generate the files and see what it is creating.
