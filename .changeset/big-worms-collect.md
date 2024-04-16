---
'style-dictionary': major
---

- The project has been fully converted to [ESM format](https://nodejs.org/api/esm.html), which is also the format that the browser uses.
  For users, this means you'll have to either use Style Dictionary in ESM JavaScript code, or dynamically import it into your CommonJS code.
- `StyleDictionary.extend()` method is now asynchronous, which means it returns `Promise<StyleDictionary.Core>` instead of `StyleDictionary.Core`.
- `allProperties` / `properties` was deprecated in v3, and is now removed from `StyleDictionary.Core`, use `allTokens` and `tokens` instead.
- Templates and the method `registerTemplate` were deprecated in v3, now removed. Use Formats instead.
- The package now uses [package entrypoints](https://nodejs.org/api/packages.html), which means that what is importable from the package is locked down to just the specified entrypoints: `style-dictionary` & `style-dictionary/fs`. If more is needed, please raise an issue explaining which file you were importing and why you need it to be public API.