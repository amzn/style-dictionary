---
'style-dictionary': minor
---

Allow not throwing fatal errors on broken token references/aliases, but `console.error` instead.
`resolveReferences` and `getReferences` both allow passing `throwOnBrokenReferences` option, setting this to false will prevent a fatal error.
You can also configure this on global/platform `log` property:

```json
{
  "log": {
    "errors": {
      "brokenReferences": "console"
    }
  }
}
```

This setting defaults to `"error"` when not configured.

Some minor grammatical improvements to some of the error logs were also done.
