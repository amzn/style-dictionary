---
'style-dictionary': patch
---

All formats using `createPropertyFormatter` or `formattedVariables` helpers now respect the `file.options.formatting` option passed by users to customize formatting.

Example:

```js
{
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath,
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            formatting: { indentation: '    ' },
          },
        },
      ]
    }
  }
}
```
