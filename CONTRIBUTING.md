# Contributing to the Style Dictionary

This is a labor of love, and we work hard to provide a useful framework. We greatly value feedback and contributions from our community. Whether it's a bug report, new feature, correction, or additional documentation, we welcome your issues and pull requests. Please read through this document before submitting any issues or pull requests to ensure we have all the necessary information to effectively respond to your bug report or contribution.

## Filing Bug Reports

You can file bug reports on the [GitHub issues][issues] page.

If you are filing a report for a bug or regression in the framework, it's extremely helpful to provide as much information as possible when opening the original issue. This helps us reproduce and investigate the possible bug without having to wait for this extra information to be provided. Please read the following guidelines prior to filing a bug report.

1. Search through existing [issues][issues] to ensure that your specific issue has not yet been reported. If it is a common issue, it is likely there is already a bug report for your problem.
2. Ensure that you have tested the latest version of the framework. Although you may have an issue against an older version of the framework, we cannot provide bug fixes for old versions. It's also possible that the bug may have been fixed in the latest release.
3. Provide as much information about your environment, npm version, and relevant dependencies as possible. For example, let us know what version of Node.js you are using, what other node modules, what ES version, etc. If possible, send us a github repository we can take a look at.
4. Provide a minimal test case that reproduces your issue or any error information you related to your problem. We can provide feedback much more quickly if we know what operations you are calling in the framework. If you cannot provide a full test case, provide as much code as you can to help us diagnose the problem. Any relevant information should be provided as well, like whether this is a persistent issue, or if it only occurs some of the time.

## Submitting Pull Requests

We are always happy to receive code and documentation contributions to the framework. Please be aware of the following notes prior to opening a pull request:

1. This framework is released under the [Apache license][license]. Any code you submit will be released under that license. For substantial contributions, we may ask you to sign a [Contributor License Agreement (CLA)][cla].
2. For any significant features or API changes please reach out to us to avoid any duplicate effort.
3. Adding to the included transforms, transformGroups, and formats, please read [this section](#what-should-be-included).

## Package Manager and dependencies

We use npm as our package manager. After downloading the repo, please use the command "npm ci" to ensure you use the package-lock dependency tree. Note that you need NPM 5.7.0 or higher to use this command.

## Code Style

We use ESLint on the code to ensure a consistent style. Any new code committed must pass our ESLint tests. Take a look at our [ESLint file][eslint].

### Code Rules

1. **Do not mutate token names or values in a format.** Mutations like this should happen in a transformer.
1. **Be as generic as possible.** Do not hard-code any values or configuration in formats.
1. **Fail loudly.** Users should be aware if something is missing or configurations aren't correct. This will help debug any issues instead of failing silently.
1. **Rely on few dependencies.** This framework is meant to be extended and allows for customization. We don't want to bring a slew of dependencies that most people don't need.

### Commit Rules

We follow [conventional commits'](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) specification.

Please follow the spec to have a successful commit.

## What should be included?

Anything that contributes to the idea of creating cross-platform styles.

### What transforms/transform groups/formats should be included?

If it has a generic and flexible enough use-case, it can be included. We would like to keep this type of code to a minimum because we don't want to be a swiss army knife that does everything out of the box. Instead, we want to focus on core tasks that are useful to the largest number of projects. The spirit of this framework is to allow flexibility and modularity which helps anyone fit it to their needs. This is why you can write your own transforms, and formats with the register methods.

### Where do things go?

We separate each function/method into its own file and group them into directories. The times we break that is for transforms and formats, but we might change that in the future. Keep the files/methods as self-contained as possible, they should each do one task.

## Testing

Any new features should implement the proper unit tests. We use Jest to test our framework.

If you are adding a new transform, action, or format: please add new unit tests. You can see examples in test/formats.

## Documentation

We use [JSDoc](http://usejsdoc.org) comments in all of the code, including built-in formats and transforms, to document all of the functionality of Style Dictionary. If you are adding a new function or changing how something works, please update the JSDoc comments.

We use [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) to create markdown files based on JSDoc comments in the code. These markdown files get generated in the docs/ directory. To see what is happening, take a look at [scripts/generateDocs.js](scripts/generateDocs.js). This file is run when the npm script `generate-docs` is run, which happens whenever we do an npm release. This script generates:

- docs/actions.md
- docs/api.md
- docs/formats.md
- docs/transform_groups.md
- docs/transforms.md

Each of these files uses a handlebars template in scripts/handlebars/templates and jsdoc-to-markdown to generate the respective markdown file.

There are other markdown files in the [docs/](docs/) directory that are plain markdown files. You can edit any of those like normal.

We use [docsify](https://docsify.js.org/#/) to transform the markdown files into a documentation website. To preview it locally, run `npm run serve-docs`.

[issues]: https://github.com/amzn/style-dictionary/issues
[pr]: https://github.com/amzn/style-dictionary/pulls
[license]: https://github.com/amzn/style-dictionary/blob/main/LICENSE
[cla]: http://en.wikipedia.org/wiki/Contributor_License_Agreement
[eslint]: https://github.com/amzn/style-dictionary/blob/main/.eslintrc.json
