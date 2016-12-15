# TODO: StyleDictionary logo

StyleDictionary is a system that provides you with simple end-to-end reliability and consistency of your design across platforms.  With a single place to create and edit your styles, a single command exports these rules to all the places you need them - iOS, Android, HTML, style documentation, etc.  It is implemented to run via Node.js and is available via npm.


# What problem does StyleDictionary solve?

When you are managing user experiences, it can be quite challenging to keep styles consistent and synchronized across multiple development platforms and devices.  At the same time, designers, developers, PMs and others must be able to have consistent and up-to-date style documentation to enable effective work and communication.  Even then, mistakes inevitably happen and the design may not be implemented accurately.  StyleDictionary solves this by automatically generating style definitions across all platforms from a single source - removing roadblocks, errors, and inefficiencys across your workflow.


# Demo

TODO: insert video


# Tutorial

TODO: add tutorial


# How do you build a StyleDictionary?

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

Here we are creating some basic font size definitions.  The style definition size.font.small.value is "10px" for example.  The style definition size.font.base.value automatically takes on the value found in size.font.medium.value, so both of those resolve to "16px".


# Using the output of StyleDictionary in a project

Show examples of how to use in:

- iOS
- Android
- html/CSS
- react
- react native


# Installing StyleDictionary for use from the CLI

Note that you must have node (and npm) installed.

Execute the following from the command line:

```
git clone https://github.com/amznlabs/style-dictionary.git ./sdtemp
cd sdtemp
npm run install-cli
cd ..
rm -rf sdtemp
```

# Configuring StyleDictionary (config.json)




# CLI options for StyleDictionary

- -h or --help for usage
    - style-dictionary --help
- -v or --version for version information
    - style-dictionary --version 
- -c or --config to specify which config file you want to run
    - style-dictionary --config ./config.json
