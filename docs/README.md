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
* [Build Process](https://github.com/amznlabs/style-dictionary/tree/master/docs/build_process.md)
* [Transforms](https://github.com/amznlabs/style-dictionary/tree/master/docs/transforms.md)
* [Formats and Templates](https://github.com/amznlabs/style-dictionary/tree/master/docs/formats_and_templates.md)
* [Property Structure](https://github.com/amznlabs/style-dictionary/tree/master/docs/property_structure.md)
* [Extending](https://github.com/amznlabs/style-dictionary/tree/master/docs/extending.md)
* [Configuration](https://github.com/amznlabs/style-dictionary/tree/master/docs/configuration.md)
