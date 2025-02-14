---
'style-dictionary': minor
---

Add `tokenMap` properties to Dictionary, which is a JavaScript Map structure of the tokens, which makes it easy to iterate as well as access tokens. Also add `convertTokenData` utility that allows to seemlessly convert between Map, Object or Array of tokens, and deprecate the `flattenTokens` utility in favor of that one.
