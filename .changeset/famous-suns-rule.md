---
'style-dictionary': minor
---

Added the following transforms for CSS, and added them to the `scss`, `css` and `less` transformGroups:

- `fontFamily/css` -> wraps font names with spaces in `'` quotes
- `cubicBezier/css` -> array value, put inside `cubic-bezier()` CSS function
- `strokeStyle/css/shorthand` -> object value, transform to CSS shorthand
- `border/css/shorthand` -> object value, transform to CSS shorthand
- `typography/css/shorthand` -> object value, transform to CSS shorthand
- `transition/css/shorthand` -> object value, transform to CSS shorthand
- `shadow/css/shorthand` -> object value (or array of objects), transform to CSS shorthand

The main intention here is to ensure that Style Dictionary is compliant with [DTCG draft specification](https://design-tokens.github.io/community-group/format/) out of the box with regards to exporting to CSS, where object-value tokens are not supported without transforming them to shorthands (or expanding them, which is a different feature that was added in `4.0.0-prerelease.27`).
