---
'style-dictionary': minor
---

When expanding object-value tokens, add some metadata about what type the token belonged to before expanding, and which property. This is useful e.g. for transforms to target specific object-value properties like lineHeights. When expanding, the type is aligned to the `number` type (DTCG), but you may want to transform `lineHeight` (not a known DTCG type) tokens but not all `number` tokens.
