---
'style-dictionary': major
---

BREAKING: `className`, `packageName`, `mapName` and `type` options for a bunch of built-in formats have been moved from `file` to go inside the `file.options` object, for API consistency reasons.

Before:

```json
{
  "files": [{
    "destination": "tokenmap.scss",
    "format": "scss/map-deep",
    "mapName": "tokens"
  }]
}
```

After:

```json
{
  "files": [{
    "destination": "tokenmap.scss",
    "format": "scss/map-deep",
    "options": {
      "mapName": "tokens"
    }
  }]
}
```
