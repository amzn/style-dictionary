---
title: Migration Guidelines
sidebar:
  order: 2
---

Version 5 is a drop-in replacement for the majority of users, due to its super tiny breaking change budget.

The main goal here was to refactor Style Dictionary's internals to improve performance, especially for large sets with many token references.

That said, here are the few breaking changes that you should keep in mind when migrating to v5.

## Token references strictness

We no longer allow you to create token references to non-token leaf nodes. References only work when referencing a Design Token (it refers to its value).

Example:

<!-- prettier-ignore -->
```json ins="{foo.nested}" del=/{foo}|{foo.nested.attributes}|{foo.nested.fontSize}|{foo.nested.\\$value.fontSize}/
{
  "foo": {
    "nested": {
      "$value": {
        "fontSize": "16px"
      },
      "$type": "typography",
      "attributes": {
        "something": "val"
      }
    }
  },
  "valid": {
    // allowed! :) resolves to its $value -> `{ fontSize: "16px" }`
    "$value": "{foo.nested}",
    "$type": "fontSize"
  },
  "bar": {
    // token group, not allowed
    "$value": "{foo}",
    "$type": "fontSize"
  },
  "baz": {
    // token sub prop, not allowed
    "$value": "{foo.nested.attributes}",
    "$type": "fontSize"
  },
  "qux": {
    // token sub prop, not allowed
    "$value": "{foo.nested.$value.fontSize}",
    "$type": "fontSize"
  },
  "fizz": {
    // token value sub prop, not allowed
    "$value": "{foo.nested.fontSize}",
    "$type": "fontSize"
  }
}
```

Furthermore, leaf nodes within your token object definition that are not Design Token nodes, will never make it to the final output for nested formats, because these get filtered out.

Example:

<!-- prettier-ignore -->
```json del="\\"bar\\": \\"something\\""
{
  "foo": {
    "bar": "something",
    "nested": {
      "$value": {
        "fontSize": "16px"
      },
      "$type": "typography",
    }
  }
}
```

Will be minified to the following for nested formats:

```json
{
  "foo": {
    "nested": {
      "$value": {
        "fontSize": "16px"
      },
      "$type": "typography"
    }
  }
}
```

Most users will not depend on referencing other things than the design token layer, so for most users this will not be a breaking change.
However, some users may rely on allowing to reference different layers, in that case this will be breaking.

The main rationale behind being more strict on this is that internally, we rely on a flattened `Map()` structure of the tokens.
This allows us to optimize reference resolution, because tokens are directly indexable. Token groups are not part of this index.
Furthermore, tokens in a Map are cheaper to iterate over than doing nested object traversal.

## Removed reference syntax customization

It is no longer possible to pass options to change the reference syntax `{ref.foo}`.
The opening (`{`), closing (`}`) and separator (`.`) characters are now set to be aligned with the DTCG spec.

## Minimum NodeJS version v22.0.0

At the time of writing this, version 22 of NodeJS is LTS (Long Time Support).
The main reason for requiring v22.0.0 is to support the use of `Set.prototype.union` which we utilize in our token reference resolution utility, and it's important for performance to use the cheaper built-in versus doing a union manually.
