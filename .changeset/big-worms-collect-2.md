---
'style-dictionary': minor
---

FileSystem that is used by Style-Dictionary can now be customized:
  
```js
import { setFs } from 'style-dictionary/fs';
setFs(myFileSystemShim);
```

By default, it uses an in-memory filesystem shim `@bundled-es-modules/memfs` in browser context, `node:fs` built-in module in Node context.
