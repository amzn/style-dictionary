---
'style-dictionary': major
---

BREAKING: For formats using the `fileHeader` `formatHelpers` utility, it will no longer display a timestamp in the fileHeader output by default. This is now an opt-in by setting `file.formatting.fileHeaderTimestamp` to `true`. The reason for making this opt-in now is that using Style Dictionary in the context of a CI (continuous integration) pipeline is a common use-case, and when running on pull request event, output files always show a diff in git due to the timestamp changing, which often just means that the diff is bloated by redundancy.

New:

```json
{
  "platforms": {
    "css": {
      "files": [{
        "destination": "variables.css",
        "format": "css/variables",
        "options": {
          "formatting": {
            "fileHeaderTimestamp": true
          }
        }
      }]
    }
  }
}
```

or:

```js
import { fileHeader } from 'style-dictionary/utils';

const headerContent = await fileHeader({ formatting: { fileHeaderTimestamp: true } });
```
