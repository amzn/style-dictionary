---
'style-dictionary': patch
---

Hotfix for `'size/rem'` => `sizeRem` transform to not change values with `'px'` units to `'rem'`. Regression was added in `v4.3.1` (commit sha 1684a8e).
