---
'style-dictionary': patch
---

Only run postinstall scripts when NODE_ENV isn't production (e.g. npm install --production or --omit=dev). To avoid errors running husky/patch-package.
