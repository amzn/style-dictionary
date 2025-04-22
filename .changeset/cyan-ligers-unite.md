---
'style-dictionary': patch
---

SD will use posix style paths (`'/'`) as much as possible and rely on `node:fs` to translate to win32 paths whenever a call to the filesystem is done. The exception is for dynamic imports of JS files (SD config, token files).
