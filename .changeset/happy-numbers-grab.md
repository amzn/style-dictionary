---
'style-dictionary': minor
---

Expose a new utility called resolveReferences which takes a value containing references, the dictionary object, and resolves the value's references for you.

```js
import StyleDictionary from 'style-dictionary';
import { resolveReferences } from 'style-dictionary/utils';

const sd = new StyleDictionary({ tokens: {
  foo: { value: 'foo' },
  bar: { value: '{foo}' },
  qux: { value: '{bar}' },
}});

console.log(resolveReferences(sd.tokens.qux.value, sd.tokens)); // 'foo'
```
