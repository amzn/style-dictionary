---
'style-dictionary': minor
---

Some fixes for Expand utility:

- Array values such as `dashArray` property of `strokeStyle` tokens no longer get expanded unintentionally, `typeof 'object'` check changed to `isPlainObject` check.
- Nested object-value tokens (such as `style` property inside `border` tokens) will now also be expanded.
- When references are involved during expansion, the resolved value is used when the property is an object, if not, then we keep the reference as is.
  This is because if the reference is to an object value, the expansion might break the reference.
