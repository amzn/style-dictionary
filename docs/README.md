<a href="">
  <img src="https://cloud.githubusercontent.com/assets/2113376/26018832/0433d85e-3726-11e7-8ef8-be6983e078a0.png" alt="Style Dictionary logo" title="StyleDictionary" width="100" align="right" />
</a>

# Style Dictionary
> *Style once, use everywhere.*

**Style Dictionary** is a system that allows you to define styles once, in a way for any platform or language to consume. A single place to create and edit your styles, and a single command exports these rules to all the places you need them - iOS, Android, CSS, JS, HTML, sketch files, style documentation, etc. It is available as a CLI through npm, but can also be used like any normal node module if you want to extend its functionality.

## Tenets
1. **Style once, use everywhere.** Tools are only used if they make lives easier. Updating a style dictionary should happen once and propagate through all systems.
2. **A single source of truth.** Styles spread across teams are fragile to update. There should be one canonical place to see style properties.
3. **Future-proof by extensibility.** We cannot know all the possible uses, platforms, transforms, etc. you might need. Therefore the style dictionary framework should be easily extensible to define custom functionality.
4. **Style dictionaries lay the foundation of interfaces.** All UI is built from styles, they are the most primitive way to describe interfaces visually.
5. **Styles should be object oriented.** Styles should be extensible, structured, and reasonable. You should be able to interact with a style dictionary like any data model.
6. **Style property names should be semantic.** If you want to have an error color for text, it should be named as such.
7. **Fail loudly.** If you reference a property that doesn't exist or format something wrong, it should break the build. This prevents unexpected errors down the line.

## Core concepts
* [Build Process](https://amzn.github.io/style-dictionary/build_process)
* [Transforms](https://amzn.github.io/style-dictionary/transforms)
* [Formats and Templates](https://amzn.github.io/style-dictionary/formats_and_templates)
* [Property Structure](https://amzn.github.io/style-dictionary/property_structure)
* [Extending](https://amzn.github.io/style-dictionary/extending)
* [Configuration](https://amzn.github.io/style-dictionary/configuration)
