---
'style-dictionary': minor
---

Allow passing a custom FileSystem Volume to your Style-Dictionary instances, to ensure input/output files are read/written from/to that specific volume. 
Useful in case you want multiple Style-Dictionary instances that are isolated from one another in terms of inputs/outputs.

```js
import { Volume } from 'memfs';
// You will need a bundler for memfs in browser...
// Or use as a prebundled fork:
import memfs from '@bundled-es-modules/memfs';
const { Volume } = memfs;

const vol = new Volume();

const sd = new StyleDictionary({
  tokens: {
    colors: {
      red: {
        value: "#FF0000",
        type: "color"
      }
    }
  },
  platforms: {
    css: {
      transformGroup: "css",
      files: [{
        destination: "variables.css",
        format: "css/variables"
      }]
    }
  }
}, { volume: vol });

await sd.buildAllPlatforms();

vol.readFileSync('/variables.css');
/**
 * :root {
 *   --colors-red: #FF0000;
 * }
 */ 
```

This also works when using extend:

```js
const extendedSd = await sd.extend(cfg, { volume: vol })
```
