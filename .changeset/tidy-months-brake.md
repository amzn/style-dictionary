---
'style-dictionary': minor
---

Create `formatPlatform` and `formatAllPlatforms` methods.
This will return the outputs and destinations from the format hook for your dictionary, without building these outputs and persisting them to the filesystem.
Additionally, formats can now return any data type instead of requiring it to be a `string` and `destination` property in `files` is now optional.
This allows users to create formats intended for only formatting tokens and letting users do stuff with it during runtime rather than writing to files.
