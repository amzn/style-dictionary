---
title: Logging
sidebar:
  order: 3
---

You can customize the logging behavior of Style Dictionary.

```js
const sd = new StyleDictionary({
  // these are the defaults
  log: {
    warnings: 'warn', // 'warn' | 'error' | 'disabled'
    verbosity: 'default', // 'default' | 'silent' | 'verbose'
  },
});
```

> `log` can also be set on platform specific configuration

| Param           | Type                                | Description                                                                                                                                                          |
| --------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log`           | `Object`                            |                                                                                                                                                                      |
| `log.warnings`  | `'warn' \| 'error' \| 'disabled'`   | Whether warnings should be logged as warnings, thrown as errors or disabled entirely. Defaults to 'warn'                                                             |
| `log.verbosity` | `'default' \|'silent' \| 'verbose'` | How verbose logs should be, default value is 'default'. 'silent' means no logs at all apart from fatal errors. 'verbose' means detailed error messages for debugging |

There are five types of warnings that will be thrown as errors instead of being logged as warnings when `log.warnings` is set to `error`:

- Token value collisions (in the source)
- Token name collisions (when exporting)
- Missing "undo" function for Actions
- File not created because no tokens found, or all of them filtered out
- Broken references in file when using outputReferences, but referring to a token that's been filtered out

Verbosity configures whether the following warnings/errors should display in a verbose manner:

- Token collisions of both types (value & name)
- Broken references due to outputReferences & filters
- Token reference errors

And through `'silent'` it also configures whether success/neutral logs should be logged at all.

By default the verbosity ('default') will keep logs relatively brief to prevent noise.

## CLI

Log verbosity can be passed as an option in the CLI by passing either `-v` or `--verbose` to get verbose logging,
and `-s` or `--silent` to get silent logging.
Warnings can be disabled by using the `-n` or `--no-warn` flag.
