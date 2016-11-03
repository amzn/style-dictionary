# TODO: StyleDictionary logo

StyleDictionary is a system that provides you with a single place to create and edit your styles.  With a single command, you can export these rules to all the places you need them - iOS, Android, HTML, style documentation, etc.  It is implemented to run via Node.js and is available via npm.


# What problem does StyleDictionary solve?

When you are managing experiences, it can be quite challenging to keep styles consistent and synchronized across multiple development platforms and devices.  At the same time, designers, developers, PMs and others must be able to have consistent and up-to-date style documentation to enable effective work and communication.  StyleDictionary generates all of this for you from a single source - removing roadblocks, errors, and inefficiencys across your workflow.


# Demo

TODO: insert video


# Tutorial

TODO: add tutorial


# How do you build a StyleDictionary?

The StyleDictionary is a collection of JSON text files.  It uses key/value pairs to save style definitions within a file.  There is a straightforward method for referencing other style keys within the value - enabling you to have a single place to change a style and have it propagate across all of your other styles.

# Fast Example

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
Here we are creating some basic 


# Options using the style dictionary

