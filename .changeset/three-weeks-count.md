---
'style-dictionary': major
---

No longer allow references to non-token leaf nodes. References only work when referencing a Design Token (its value).
Non-token nodes will also not make it to the output, because they are filtered out during the flattening process to `tokenMap` and `tokenArray`.
Remove allowing references with `.value` suffix.
