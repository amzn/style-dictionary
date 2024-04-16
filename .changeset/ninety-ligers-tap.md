---
'style-dictionary': major
---

BREAKING: moved `formatHelpers` away from the StyleDictionary class and export them in `'style-dictionary/utils'` entrypoint instead.

Before

```js
import StyleDictionary from 'style-dictionary';

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;
```

After

```js
import { fileHeader, formattedVariables } from 'style-dictionary/utils';
```
