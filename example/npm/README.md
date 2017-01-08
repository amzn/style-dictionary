## Style Dictionary as an npm module

This example shows how to set up a style dictionary as an npm module, either to publish to a local npm service or to publish externally. 

When you publish this npm module, the prepublish hook will run, calling the style dictionary build system to create the necessary files. You can also just run `npm run build` to generate the files to see what it is creating. 
