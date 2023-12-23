## Use variables in output files

This example shows how you keep aliases/references intact in certain types of formats as well as in custom formats.

Common use cases include:

- Vending theme-able output like CSS variables

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use _yarn_, update the commands accordingly).

At this point, you can run `npm run build`. This command will generate the output file in the `build` folder.

#### How does it work

The "build" command uses the `sd.config.js` file as the Style Dictionary configuration. It is configured to use JSON files in the `tokens/` directory as the source files. It adds a custom format directly in the configuration (as opposed to using the `.registerFormat()` method) that uses 2 new methods added as exposed utilities: `usesReferences()` and `getReferences()`. Also, it uses a new configuration on some formats: `outputReferences: true` to include variable references in the output.

#### What to look at

The `sd.config.js` file has everything you need to see. The tokens included in this example are just enough to show these new techniques.

Here is an example that shows how to get an alias's name within a custom format:

```javascript
import { usesReferences, getReferences } from 'style-dictionary/utils';

//...
function({ dictionary }) {
  return dictionary.allTokens.map(token => {
    let value = JSON.stringify(token.value);
    // the `dictionary` object now has `usesReferences()` and
    // `getReferences()` methods. `usesReferences()` will return true if
    // the value has a reference in it. `getReferences()` will return
    // an array of references to the whole tokens so that you can access their
    // names or any other attributes.
    if (usesReferences(token.original.value)) {
      const refs = getReferences(token.original.value, dictionary);
      refs.forEach(ref => {
        value = value.replace(ref.value, function() {
          return `${ref.name}`;
        });
      });
    }
    return `export const ${token.name} = ${value};`
  }).join(`\n`)
}
```

The `build/` directory is where all the files are being built to. After Style Dictionary is run, take a look at the files it generates:

- `build/tokens.js` This file is generated from the custom format in this example. Tokens that are references to other tokens use the variable name instead of raw value.
- `build/tokens.json` This file does not use variable references to show that other outputs work as intended.
- `build/tokens.css` This file is generated using the `css/variables` built-in format with the new `outputReferences` configuration.
- `build/tokens.scss` This file is generated using the `scss/variables` built-in format with the new `outputReferences` configuration.
