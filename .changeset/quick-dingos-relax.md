---
'style-dictionary': minor
---

When transform hooks throw errors, they will now be caught and error-handled by Style Dictionary.
Instead of causing a fatal failure, the error is collected and logged as a warning at the end.
With verbosity turned to `"verbose"`, information about which tokens in which files are causing an error in which transform, to help debugging the problem.
Sensible fallbacks are used when a transform cannot complete.
