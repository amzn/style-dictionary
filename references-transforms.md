# References & transforms

These are use cases that we want to ensure work but currently don't.

## Examples

### Combining transitive value modification + value formatting

```json
{
  "color": {
    "red": { "value": "#f00" },
    "danger": { "value": "{color.red}", "darken": 0.75 },
    "error": { "value": "{color.danger}", "darken": 0.5 }
  }
}
```

Desired output:

```swift
import SwiftUI

public class  {
    public static let colorRed = UIColor(red: 255, green: 0, blue: 0, alpha: 1);
    public static let colorDanger = UIColor(red: 63.75, green: 0, blue: 0, alpha: 1);
    public static let colorError = UIColor(red: 31.88, green: 0, blue: 0, alpha: 1);
}
```

Actual output:

Fatal error because `color.red` gets transformed to `UIColor(red: 255, green: 0, blue: 0, alpha: 1)` first, which means that `color.danger` then cannot be darkened by the modifier because the modifier function does not support `UIColor` format.

### outputReferences + transitive transform

We allow output references to work with transitive value modification by deferring the modification to the final output (CSS color-mix)

```json
{
  "color": {
    "darken": { "value": 0.5 },
    "red": { "value": "#f00" },
    "danger": { "value": "{color.red}", "darken": 0.75 },
    "error": { "value": "{color.danger}", "darken": "{darken}" }
  }
}
```

Desired output:

```css
:root {
  --color-red: #f00;
  --color-danger: color-mix(in srgb, var(--color-red), #000 75%);
  --color-error: color-mix(in srgb, var(--color-danger), #000 50%);
}
```

Actual output:

```css
:root {
  --color-red: #f00;
  --color-danger: var(--color-red);
  --color-error: var(--color-danger);
}
```

Due to transformation work being undone by restoring the `original.value` and replacing that with CSS custom prop.

### outputReferences + math

Similar as the example before, we allow output references to work with transitive value modification by deferring the modification to the final output (CSS Calc)

```json
{
  "size": {
    "scale": { "value": "2" },
    "xs": { "value": "4px" },
    "sm": { "value": "{size.xs} * {size.scale}" },
    "md": { "value": "{size.sm} * {size.scale}" },
    "lg": { "value": "{size.md} * {size.scale}" }
  }
}
```

Desired output:

```css
:root {
  --size-xs: 2;
  --size-sm: 4px;
  --size-md: calc(var(--size-sm) * var(--size-scale));
  --size-lg: calc(var(--size-md) * var(--size-scale));
}
```

Actual output:

```css
:root {
  --size-xs: 2;
  --size-sm: 4px;
  --size-md: var(--size-sm) * var(--size-scale);
  --size-lg: var(--size-md) * var(--size-scale);
}
```

Due to transformation work being undone by restoring the `original.value` and replacing references with CSS custom props.

## Solutions

I've tried to come up with solutions that tackle these use cases while not breaking existing use cases (from what I can tell).

- resolve (`true|false|filterFunction`) references on platform/global level instead of format level, so we don't resolve references to begin with, meaning no unnecessary transform work is done to begin with, and we don't need to "undo" anything by restoring `original.value`

  ```js
  {
    references: {
      // allows resolving "darken" props but not "value" props, if we want.
      // Also useful for description/comment prop which might contain references
      // that you want to keep unresolved, since it's meta data
      resolve: (prop) => prop !== 'value';
    }
  }
  ```

- allow transforms to transform values with references (as a consequence of the above, this is needed)

  ```js
  StyleDictionary.registerTransform({
    name: 'css/color-mix',
    references: true,
    transformer: () => {
      // input: { "value": "{color.danger}", "darken": "{darken}" }
      // 1. if we resolve darken prop refs
      // output: color-mix(in srgb, {color.danger}, #000 50%)
      // 2. if we don't
      // output: color-mix(in srgb, {color.danger}, #000 {darken})
      // 3. if we don't and also need to convert 0-1 range to percentages
      // output: color-mix(in srgb, {color.danger}, #000 calc({darken} * 100%))
      // final output (assuming 3):
      //   color-mix(in srgb, var(--colorDanger), #000 calc(var(--darken) * 100%))
    },
  });
  ```

- allow transforms to defer until after regular/transitive transforms,
  useful for any transforms that do formatting-only transformations on values
  that can be transformed (modified, so more than just formatting) by transitive transforms

  ```js
  StyleDictionary.registerTransform({
    name: 'color/UIColorSwift',
    defer: true,
    transformer: () => {
      // format rgba(r,g,b,a) -> UIColor(red: r, green: g, blue: b, alpha: a)
    },
  });
  ```

- formats support references by strictly regex'ing for `{}` inside values and replacing them with references depending on the platform (e.g. CSS Custom Props for css). No need to look at the `original.value` anymore:

  ```js
  // Example of es6 javascript format that allows references
  import StyleDictionary from 'style-dictionary';
  import {
    usesReference,
    isReferenceExclusively,
    getReferences,
    replaceReferences,
  } from 'style-dictionary/utils';

  const { fileHeader } = StyleDictionary.formatHelpers;

  StyleDictionary.registerFormat({
    name: 'es6',
    formatter: (dictionary) => {
      const { allTokens, options, file } = dictionary;
      const isNumeric = (str) => {
        if (typeof str !== 'string') return false;
        return (
          !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
          !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
        );
      };

      const compileTokenValue = (token) => {
        let value = `${token.value}`;
        const isRefExclusively = isReferenceExclusively(value);
        if (usesReference(value)) {
          if (!isRefExclusively) {
            // since we're putting references back and value is not exclusively a reference, use template literals
            value = `\`${value}\``;
          }
          const refs = getReferences(dictionary, value);
          return replaceReferences(refs, (ref) =>
            isRefExclusively ? ref.name : `\${${ref.name}}`,
          );
        }
        return isNumeric(value) ? value : JSON.stringify(value);
      };

      return `${fileHeader({ file })}${allTokens.reduce((acc, token) => {
        return (
          acc +
          `export const ${token.name} = ${compileTokenValue(token)}; ${
            token.comment ? `// ${token.comment}` : ''
          }\n`
        );
      }, '')}`;
    },
  });
  ```
