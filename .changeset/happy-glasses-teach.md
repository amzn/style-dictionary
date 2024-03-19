---
'style-dictionary': major
---

BREAKING: Logging has been redesigned a fair bit and is more configurable now.

Before:

```json
{
  "log": "error" // 'error' | 'warn'  -> 'warn' is the default value
}
```

After:

```json
{
  "log": {
    "warnings": "error", // 'error' | 'warn'  -> 'warn' is the default value
    "verbosity": "verbose" // 'default' | 'verbose' | 'silent'  -> 'default' is the default value
  }
}
```

Log is now and object and the old "log" option is now "warnings".

This configures whether the following five warnings will be thrown as errors instead of being logged as warnings:

- Token value collisions (in the source)
- Token name collisions (when exporting)
- Missing "undo" function for Actions
- File not created because no tokens found, or all of them filtered out
- Broken references in file when using outputReferences, but referring to a token that's been filtered out

Verbosity configures whether the following warnings/errors should display in a verbose manner:

- Token collisions of both types (value & name)
- Broken references due to outputReferences & filters
- Token reference errors

And it also configures whether success/neutral logs should be logged at all.
Using "silent" (or --silent in the CLI) means no logs are shown apart from fatal errors.