---
'style-dictionary': minor
---

Add new utility in `style-dictionary/utils` -> `stripMeta` for stripping metadata from tokens.
This utility is used now as an opt-in for the built-in `'json'` format by using `options.stripMeta`, which if set to `true` will strip Style Dictionary meta props.
You can specify `keep`/`strip` (allow/blocklist) for granular control about which properties to keep or strip.
