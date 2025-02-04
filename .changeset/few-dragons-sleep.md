---
'style-dictionary': patch
---

- `'color/hex'` (`colorHex` enum) built-in transform can now handle alpha channels properly by outputting hex8 format if needed. This also affects the transformGroups `less` and `js` which apply this transform.
- `'color/hex8'` (`colorHex8` enum) built-in transform is now deprecated, use `'color/hex'` (`colorHex` enum) instead.
