---
'style-dictionary': major
---

BREAKING: minimum NodeJS version required is now v22.0.0 (LTS, at time of writing this). This is to support `Set.prototype.union` which we utilize in our token reference resolution utility, and it's important to use the cheaper built-in versus doing a union manually.
