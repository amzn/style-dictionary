---
'style-dictionary': minor
---

Fixes some noisy warnings still being outputted even when verbosity is set to default.

We also added log.warning "disabled" option for turning off warnings altogether, meaning you only get success logs and fatal errors.
This option can be used from the CLI as well using the `--no-warn` flag.