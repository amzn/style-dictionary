---
'style-dictionary': patch
---

Respect `formatting` options in scss map-deep/map-flat formats, those that make sense:

- `commentPosition`
- `commentStyle`
- `indentation`

Also export a new type interface `FormattingOverrides`, which is a limited version of `FormattingOptions`.
These contain the formatting options that can be overridden by users, whereas the full version is meant for the format helper utilities such as `createPropertyFormatter`/`formattedVariables`.
