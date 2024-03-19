---
'style-dictionary': major
---

Remove reliance on CTI token structure across transforms, actions and formats.

Breaking changes:

- Token type will now be determined by "type" (or "$type") property on the token, rather than by checking its CTI attributes. This change has been reflected in all of the format templates as well as transform "matcher" functions that were previously checking `attributes.category` as the token type indicator.
- Types are mostly aligned with [DTCG spec types](https://design-tokens.github.io/community-group/format/#types), although a few additional ones have been added for compatibility reasons:
  - asset -> string type tokens where the value is a filepath to an asset
  - icon -> content type string tokens where the content resembles an icon, e.g. for icon fonts like [Microsoft codicons](https://github.com/microsoft/vscode-codicons)
  - html -> HTML entity strings for unicode characters
  - content -> regular string content e.g. text content which sometimes needs to be wrapped in quotes
- Built-in name transforms are now reliant only on the token path, and are renamed from `name/cti/casing` to just `name/casing`. `name/ti/camel` and `name/ti/constant` have been removed. For example `name/cti/kebab` transform is now `name/kebab`.
- Transform `content/icon` has been renamed to `html/icon` since it targets HTML entity strings, not just any icon content.
- `font/objC/literal`, `font/swift/literal` and `font/flutter/literal` have been removed in favor of `font/objC/literal`, `font/swift/literal` and `font/flutter/literal`, as they do he exact same transformations.
- `typescript/module-declarations` format to be updated with current DesignToken type interface.


Before:

```json
{
  "color": {
    "red": {
      "value": "#FF0000"
    }
  }
}
```

After:

```json
{
  "color": { // <-- this no longer needs to be "color" in order for the tokens inside this group to be considered of type "color"
    "red": {
      "value": "#FF0000",
      "type": "color"
    }
  }
}
```