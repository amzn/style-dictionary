---
'style-dictionary': major
---

BREAKING: 
- `usesReference` util function is now `usesReferences` to be consistent plural form like the other reference util functions.
- `getReferences` first and second parameters have been swapped to be consistent with `resolveReferences`, so value first, then the full token object (instead of the entire dictionary instance).
- `getReferences` accepts a third options parameter which can be used to set reference Regex options as well as an unfilteredTokens object which can be used as a fallback when references are made to tokens that have been filtered out. There will be warnings logged for this.
- `format.formatter` removed old function signature of `(dictionary, platform, file)` in favor of `({ dictionary, platform, options, file })`.
- Types changes:
  
  - Style Dictionary is entirely strictly typed now, and there will be `.d.ts` files published next to every file, this means that if you import from one of Style Dictionary's entrypoints, you automatically get the types implicitly with it. This is a big win for people using TypeScript, as the majority of the codebase now has much better types, with much fewer `any`s.
  - There is no more hand-written Style Dictionary module `index.d.ts` anymore that exposes all type interfaces on itself. This means that you can no longer grab types that aren't members of the Style Dictionary class directly from the default export of the main entrypoint. External types such as `Parser`, `Transform`, `DesignTokens`, etc. can be imported from the newly added types entrypoint:

  ```ts
  import type { DesignTokens, Transform, Parser } from 'style-dictionary/types';
  ```

  Please raise an issue if you find anything missing or suddenly broken.
  - `Matcher`, `Transformer`, `Formatter`, etc. are still available, although no longer directly but rather as properties on their parents, so `Filter['matcher']`, `Transform['transformer']`, `Format['formatter']`
