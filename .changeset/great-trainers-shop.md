---
'style-dictionary': patch
---

Allow transitive transforms to return undefined, by doing this the transformer can mark itself as "deferred" for that specific token. This is useful when references in properties other than "value" need to be resolved first.
