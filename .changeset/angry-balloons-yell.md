---
'style-dictionary': major
---

BREAKING: 
- `usesReference` util function is now `usesReferences` to be consistent plural form like the other reference util functions.
- `getReferences` first and second parameters have been swapped to be consistent with `resolveReferences`, so value first, then the full token object (instead of the entire dictionary instance).
- `getReferences` accepts a third options parameter which can be used to set reference Regex options as well as an unfilteredTokens object which can be used as a fallback when references are made to tokens that have been filtered out. There will be warnings logged for this.
- `format.formatter` removed old function signature of `(dictionary, platform, file)` in favor of `({ dictionary, platform, options, file })`.