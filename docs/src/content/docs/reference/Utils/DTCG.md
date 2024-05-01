---
title: Design Token Community Group
---

These utilities have to do with the [Design Token Community Group Draft spec](https://design-tokens.github.io/community-group/format/).

## typeDtcgDelegate

This function processes your ["Design Token Community Group Draft spec"-compliant](https://design-tokens.github.io/community-group/format/) dictionary of tokens, and ensures that `$type` inheritance is applied.

We built this utility because it's cheaper to apply the inheritance once, rather than on every access of a token's "$type" property, checking the ancestor tree to find it.

This utility is ran by default in Style-Dictionary after the parser hook and before the preprocessor hook.

```js
import { typeDtcgDelegate } from 'style-dictionary/utils';

const output = typeDtcgDelegate(input);
```

Input:

```js
{
  dimensions: {
    $type: 'dimension',
    sm: {
      $value: '5',
    },
    md: {
      $value: '10',
    },
    nested: {
      deep: {
        lg: {
          $value: '15',
        },
      },
    },
    nope: {
      $value: '20',
      $type: 'spacing',
    },
  },
}
```

Output:

```js
{
  dimensions: {
    $type: 'dimension',
    sm: {
      $value: '5',
      $type: 'dimension',
    },
    md: {
      $value: '10',
      $type: 'dimension',
    },
    nested: {
      deep: {
        lg: {
          $value: '15',
          $type: 'dimension',
        },
      },
    },
    nope: {
      $value: '20',
      $type: 'spacing',
    },
  },
}
```
