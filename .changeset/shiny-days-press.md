---
'style-dictionary': minor
---

Prevent duplicate redundant calls to StyleDictionary class methods by caching platform specific config & tokens results.

Added reusable methods:

- `getPlatformTokens()` -> grabs the `tokens`/`allTokens`(new! `exportPlatform` does not return this) for a specific platform, after running platform specific preprocessors and transforms. This replaces the old `exportPlatform` method which is now deprecated and will be removed in v5.
- `getPlatformConfig()` -> grabs the processed/transformed `PlatformConfig` for a specific platform, replaces the now deprecated `getPlatform` method which will be removed in v5.

The reasons for deprecating those methods and replacing them with new ones is to reduce method ambiguity and make them more pure.

Add new options object to methods:

- `getPlatformTokens`
- `getPlatformConfig`
- `exportPlatform` (deprecated, see above)
- `getPlatform` (deprecated, see above)
- `formatPlatform`
- `formatAllPlatforms`
- `buildPlatform`
- `buildAllPlatforms`
- `cleanPlatform`
- `cleanAllPlatforms`

with property `cache`, which if set to `false`, will disable this caching of generating the platform specific config / tokens, e.g.:

```js
await sd.exportPlatform('css', { cache: false });
await sd.buildAllPlatforms('css', { cache: false });
```

Expectation is that this is usually not useful for majority of users, unless for example you're testing multiple runs of StyleDictionary while changing tokens or platform configs in between those runs.
