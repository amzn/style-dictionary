# Examples

To get you started, there are some example packages included that you can use. You can take a look at the code on Github or you
can use the CLI included to generate a new package using these examples. Here is how you can do that:
```bash
$ mkdir MyStyleD
$ cd MyStyleD
$ style-dictionary init [example]
```
Where `[example]` is one of: `basic`, `complete`, `npm`, `s3`

## Basic
[View on Github](https://github.com/amzn/style-dictionary/tree/master/example/basic)

This example code is bare-bones to show you what this framework can do. Use this if you want to play around with what the Style Dictionary
can do.


## Complete
[View on Github](https://github.com/amzn/style-dictionary/tree/master/example/complete)

This is a more complete package and should have everything you need to get started. This package can be consumed as a Cocoapod on iOS,
as a node module for web, and as a local library for Android.

## npm
[View on Github](https://github.com/amzn/style-dictionary/tree/master/example/npm)

This example shows how to set up a style dictionary as an npm module, either to publish to a local npm service or to publish externally.

When you publish this npm module, the prepublish hook will run, calling the style dictionary build system to create the necessary files. You can also just run `npm run build` to generate the files to see what it is creating.

## s3
[View on Github](https://github.com/amzn/style-dictionary/tree/master/example/s3)

One way to use the style dictionary framework is to build files for each platform and upload those build artifacts to an s3 bucket. The platforms can pull these files down during their build process.

----

> More coming soon...
