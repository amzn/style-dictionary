---
'style-dictionary': patch
---

Allow overriding CSS formatting with commentStyle and commentPosition props.
For commentStyle, options are 'short' or 'long'.
For commentPosition, options are 'above' or 'inline'.

We also ensure that the right defaults are picked for CSS, SASS/SCSS, Stylus and Less.

This also contains a fix for ensuring that multi-line comments are automatically put "above" rather than "inline".
