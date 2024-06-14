---
'style-dictionary': minor
---

Allow not throwing fatal errors on broken token references/aliases, but `console.error` instead.

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

`resolveReferences` and `getReferences` `warnImmediately` option is set to `true` which causes an error to be thrown/warned immediately by default, which can be configured to `false` if you know those utils are running in the transform/format hooks respectively, where the errors are collected and grouped, then thrown as 1 error/warning instead of multiple.

Some minor grammatical improvements to some of the error logs were also done.
