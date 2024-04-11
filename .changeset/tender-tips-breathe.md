---
'style-dictionary': major
---

BREAKING: no longer wraps tokens of type asset in double quotes. Rather, we added a transform `asset/url` that will wrap such tokens inside `url("")` statements, this transform is applied to transformGroups scss, css and less.
