---
'style-dictionary': patch
---

Reuse static hooks in the constructor to set instance hooks prop, to avoid discarding built-in hooks overwrites by consumers.
