# Build Process

Here is what the build system is doing under the hood.

![build structure](assets/build-diagram.png)

1. The build system reads in a configuration
1. If there is an `includes` attribute in the config, it will take those files and deep merge them into the `properties` object
1. It takes all the JSON files in the `source` attribute in the config and performs a deep merge onto the `properties` object
1. Then it iterates over the platforms in the config and:
  1. Performs all transforms, in order, defined in the transforms attribute or transformGroup
  1. Builds all files defined in the files array
  1. Performs any actions defined in the actions attribute
