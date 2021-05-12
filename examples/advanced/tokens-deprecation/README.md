## How to deprecate design tokens

There are many ways in which one can decide to deprecate a design token. This example shows one of the possible ways, but please consider it as a suggestion and adapt it to your own specific needs.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, if you want to build the tokens run `npm run build`. This command will generate the files in the `build` folder.


#### How does it work

Using extra attributes associated to a design token, is possible (at build time) to read this extra meta-information and, using custom templates, generates output files that contain these extra information in the form of specific comments that inform the consumers of these files about the fact that some of the design tokens are to be considered deprecated.


#### What to look at

Open the `tokens/color/base.json` and `tokens/size/font.json` files and see how some of the tokens have a custom `deprecated` attribute (and an additional `deprecated_comment` attribute).

Now open the custom template files in `templates` and see how this attributes are used to - conditionally, when a token is deprecated - add extra comments to the output files.

Finally, once generated the output files, open the `build/scss/_variables.scss` and `build/ios/tokens.plist` files and see how the `deprecated` attributes have been converted to comments (and extra tokens in the plist) in the output files.