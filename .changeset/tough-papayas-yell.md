---
'style-dictionary': patch
---

Dynamically import prettier and plugins so that they can be chunked separately by bundlers, and only imported on demand. This will significantly improve bundle size for users of Style Dictionary.
