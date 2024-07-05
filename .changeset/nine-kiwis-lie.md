---
'style-dictionary': patch
---

Fix bugs with expand tokens where they would run before instead of after user-configured preprocessors, and would fatally error on broken references. Broken refs should be tolerated at the expand stage, and errors will be thrown after preprocessor lifecycle if the refs are still broken at that point.
