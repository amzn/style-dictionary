## Generating @font-face rules

To generate `@font-face` rules, we will need a few moving parts (described below). The final output will look like:

```css
/** build/css/fonts.css */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src:
    url('../fonts/Roboto.woff2') format('woff2'),
    url('../fonts/Roboto.woff') format('woff');
  font-display: fallback;
}
```

```scss
// build/scss/_fonts.scss
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src:
    url('#{$font-path}/fonts/Roboto.woff2') format('woff2'),
    url('#{$font-path}/fonts/Roboto.woff') format('woff');
  font-display: fallback;
}
```

#### Running the example

Set up the required dependencies by running the command `npm install` in your local CLI environment (if you prefer to use _yarn_, update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will generate the files in the `build` folder.

Note, running this example will generate a "While building fonts.css, token collisions were found; output may be unexpected. Ignore this warning if intentional." warning. The warning is expected and can be ignored.

#### How does it work

- Each font is defined using a specific structure:
  ```json
  {
    "asset": {
      "font": {
        "<family>": {
          "<weight>": {
            "<style>": {
              "value": "<path>",
              "formats": ["<list of formats, e.g. woff2, woff>"],
              "type": "asset"
            }
          }
        }
      }
    }
  }
  ```
- A custom _transform_ will promote the family name, weight and style to their own named attributes on the token object.
- A custom _format_ will generate the `@font-face` rules.
- A _platform_ ties it all together.

#### What to look at

Open `tokens.json`:

- To distinguish font-face tokens from other font tokens, the "**asset**" category is used.
- Each font-face token is structured so that the font's _family name_, _weight_ (400, 700, etc.), and _style_ (normal or italics) can be determined at runtime.

Compare this example's `tokens.json` to the generated files `css/fonts.css`, and `scss/_fonts.scss`.

Next up, open `sd.config.js` to see how the "css-font-face" and "scss-font-face" platforms are configured. Note the `transforms`, `format`, `filter`, and the custom `options.fontPathPrefix` properties.

Lastly, in the same file, check out the code for the `attribute/font` transform, and `font-face` format.
