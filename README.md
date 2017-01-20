# TODO: StyleDictionary logo

StyleDictionary is a system that provides you with simple end-to-end reliability and consistency of your design across platforms.  With a single place to create and edit your styles, a single command exports these rules to all the places you need them - iOS, Android, HTML, style documentation, etc.  It is implemented to run via Node.js and is available via npm.


# What problem does StyleDictionary solve?

When you are managing user experiences, it can be quite challenging to keep styles consistent and synchronized across multiple development platforms and devices.  At the same time, designers, developers, PMs and others must be able to have consistent and up-to-date style documentation to enable effective work and communication.  Even then, mistakes inevitably happen and the design may not be implemented accurately.  StyleDictionary solves this by automatically generating style definitions across all platforms from a single source - removing roadblocks, errors, and inefficiencies across your workflow.

## Write once, use everywhere.

A style dictionary is a toolkit for everyone in an organization to use. A designers can use a sketch plugin, a PM can use a style guide website, a web developer can use sass files, an iOS developer can use a static library, etc. The style dictionary is the single source of truth.


# Demo

TODO: insert video


# Installing StyleDictionary for use from the CLI

Note that you must have node (and npm) installed.

In the terminal, switch to the root level of the style-dictionary project, and execute the following from the command line:

```
npm install -g style-dictionary
```


# Tutorial

Now that you have StyleDictionary installed, lets use it. This package comes with some examples to start you off. 
 ```
 mkdir MyStyleDictionary
 cd MyStyleDictionary
 style-dictionary init complete
 ```
 
Now you have an example project set up. You can make changes to the style dictionary and rebuild the project by running:

```
style-dictionary build
```

You should see this output:

```
Reading config file from ./config.json
Building your style dictionary
```

Doesn't look like much happened, but your styles have been built and incorporated into the projects inside that directory.  Lets take a look.  Open the "style-guide" subdirectory and execute this command:

```
npm start-website
```

Now go to this address in your browser:

```
http://localhost:8080/index.html
```
It should look like this:

* insert photo

Looks nice.  Now lets make a change.  Edit the file in 'properties/color.json', changing color.blue.light from '#000055' to '#0000FF'.  Now re-run style-dictionary and reload the page in your browser.  Tada!  Now it looks like this:

* insert photo

Whats great about this is that if you run the android project, the iOS project, the react-native project, etc, is that they will _all_ be updated with this change.

Go ahead and change color.blue.light back to '#000055'.  Lets change color.background.warning from '{color.blue.light}' to '{color.orange.light}'.

In the same folder as 'colors.json', edit 'icons.json' and modify icon.something.warning from '{icon.something.exclamation}' to '{icon.something.yield}'.  Re-run style-dictionary and reload the page in your browser.  Now it should look like this:

* insert photo

Now all warnings will look like this, across all platforms and all applications, including your style guide.  Make sense?




# So what is a StyleDictionary?

The StyleDictionary is a collection of JSON text files.  It uses key/value pairs to save style definitions within a file.  There is a straightforward method for referencing other style keys within the value - enabling you to have a single place to change a style and have it propagate across all of your other styles.

# Quick Example

```
{
	"size": {
		"font": {
			"small": {
				"value": "10px"
			},
			"medium": {
				"value": "16px"
			},
			"large": {
				"value": "24px"
			},
			"base": {
				"value": "{size.font.medium.value}"
			}
		}
	}
}
```

Here we are creating some basic size font definitions.  The style definition size.font.small.value is "10px" for example.  The style definition size.font.base.value automatically takes on the value found in size.font.medium.value, so both of those resolve to "16px".

# How to deal with separate codebases / remote development

The best solution for situations where the codebases for your various platforms are separate is to have a single accessible place where you store your StyleDictionary output (E.G. AWS S3).  The StyleDictionary run simply creates the output files and automatically uploads them where they can be accessed by the build scripts of the various platforms/teams.

* insert example

# Creating your own output type (platform)

In config.json, the 'platforms' attribute defines what the various processing techniques are created and applied to develop the final output to be incorporated into your project.

TODO TODO TODO

# Using the output of StyleDictionary in a project

Show examples of how to use in:

- iOS
- Android
- html/CSS
- react
- react native


# Configuring StyleDictionary (config.json)




# CLI options for StyleDictionary

- -h or --help for usage
    - style-dictionary --help
- -v or --version for version information
    - style-dictionary --version 
- -c or --config to specify which config file you want to run
    - style-dictionary --config ./config.json


# Core concepts

To learn a little more about the internal structure of how the style dictionary build process works, lets outline some core concepts.

## How it builds
![build structure](https://github.com/amznlabs/style-dictionary/blob/master/images/build-diagram.png)

1. The build system looks for a config file, if you don't specify it looks for config.json in the current directory.
1. It finds all the JSON files in the source attribute in the config and performs a deep merge.
1. From this all properties object, we iterate over the platforms in the config and:
  1. Perform all transforms, in order, defined in the transforms attribute or transformGroup.
  1. Build all files defined in the files array
  1. Perform any actions defined in the actions attribute

If you are using the Style Dictionary in node, when you use the extend method with either a config object or a path to a config object, it will perform the deep merge and pass back a StyleDictionary object with all the methods and properties filled in.

```
var StyleDictionary = require('style-dictionary');

// extend performs the deep merge of the properties
var styleDictionary = StyleDictionary.extend( pwd + '/config.json' );

// You can also extend with an object
// var styleDictionary = StyleDictionary.extend({ /* config options */ });

// This will perform step 3, for each platform execute transforms,
// build files, and perform actions of each platform
styleDictionary.buildAllPlatforms();
```


### Style Properties

A style property is an attribute to describe something visually. It is atomic (it cannot be broken down further). Style properties have a name, a value, and optional attributes or metadata. The name of a property can be anything, but we have a proposed naming structure that works really well in the next section. 

### Category/Type/Item Structure

While not exactly necessary, we feel this classification structure of style properties makes the most sense semantically. Style properties can be organized into a hierarchical tree structure with the top level, category, defining the primitive nature of the property. For example, we have the color category and every property underneath is always a color. As you proceed down the tree to type, item, sub-item, and state, you get more specific about what that color is. Is it a background color, a text color, or a border color? What kind of text color is it? You get the point. Now you can structure your property json files like simple objects:

```
{
  "size": {
    "font": {
      "base":  { "value": "16" },
      "large": { "value": "20" }
    }
  }
}
```
 
 The CTI is implicit in the structure, the category and type is 'size' and 'font', and there are 2 properties 'base' and 'large'. 
 
 Structuring style properties in this manner gives us consistent naming and accessing of these properties. You don't need to remember if it is button_color_error or error_button_color, it is color_background_button_error! 
 
 Technically, you can organize and name your style properties however you want, there are no restrictions. But we have a good amount of helpers if you do use this structure, like the 'attribute/cti' transform which adds attributes to the property of its CTI based on the path in the object. There are a lot of name transforms as well for when you want a flat structure like for sass variables.
 
 Also, the CTI structure provides a good mechanism to target transforms for specific kinds of properties. All of the transforms provided by the framework use the CTI of a property to know if it should be applied. For instance, the 'color/hex' transform only applies to properties of the category 'color'. 

### Platform
A platform defines transforms (or a transformGroup), files to be built, and any additional configuration like variable prefixes. Think of a platform as a way to describe how to interact with the style dictionary. For example, maybe we want to use only the colors in Javascript as arrays for rendering lines in a d3 line chart. You would define a platform that outputs a JS module that looks something like this:

```
module.exports = {
  chart_colors_1: ['#ff9900', '', '', '', ''],
  chart_colors_2: ['#ff9900', '', '', '', ''],
  ...
}
```

A platform is like a pivot table in excel. You start with the raw data and pivot it in a way that makes sense. 
