## Referencing (Aliasing)

This example shows how to use referencing (or "aliasing") to reference a value -or an attribute– of a token and assign it to the value –or attribute– of another token.

This is quite handy when you want to create a system that uses some basic design definitions (base colors, base font sizes, base scales, etc) but then exposes them in a more complex and detailed set of design tokens, typically to describe a complete UI pattern library.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, you can run `npm run build`. This command will generate the output file in the `build` folder.

#### How does it work

The "build" command processes the JSON files in the `tokens` folder. Whenever it finds a reference declared via this syntax:

```
   token: {
       "value": "{ref.to.object.value}"
   }
```
the build process resolves the reference using the declared path (`ref.to.object`) to retrieve the actual value of the referenced token inside the Style Dictionary object.

**Notice**: if the path is not valid, doesn't exist or is a circular reference, Style Dictionary generates an error in the console.

#### What to look at

Open the JSON files in the `tokens` folder and see how certain tokens are referencing the values of other tokens via "aliases".

For example, open `color/base.json` and see how the value of the "primary" color is a **reference** to the value of the "green" color, declared as:

```
   "primary": { "value": "{color.base.green.value}" }

```
In this case, the string `"{color.base.green.value}"` is resolved at build time, and gets its value from the value of the "green" base color, `"#00FF00"`.

The reference can point to another token in a **different JSON file**. For example open `color/font.json` and see how the value for the base/secondary font colors are references to the tokens declared in `color/base.json`:

```
{
  "color": {
    "font": {
      "base"     : { "value": "{color.base.red.value}" },
      "secondary": { "value": "{color.base.green.value}" }
      ...
```

It is also possible to create **chains of references**, where a value references an alias that is also an alias of a value. If you open `button/button.json`, the value of the primary color for the button is an alias of `color.primary.value`, that is an alias of `color.base.green.value`:

```
{
  "button": {
    "color": {
      "primary": {
        "value": "{color.primary.value}"
        ...
```

The value associated to a token can be an **object** (eg. an RGB color). In that case, the reference still works. If you open `color/font.json` you will see that the "faded" color of text is a reference to `color.base.gray.medium.value`, but if you look in `color/base.json` you will see that the value of the "medium gray" color is not a string, but an RGB object:

```
{
  "color": {
    "base": {
      ...
      "gray": {
        "medium": { "value": { "r": 146, "g": 153, "b": 162 } }

```
In that case Style Dictionary still resolves correctly the alias to the  corresponding value:

```
"color-base-gray-medium": "#9299a2"
```

You can also reference **other attributes of a token**, not only its value. For example in `button/button.json` the value of text size is composed as concatenation (remember, it's a string, think of it as template literals) of two tokens of the "global" object, declared in the `globals.json` file:

```
    "text": {
      "size": {
        "value": "{globals.baseline}{globals.unit}"
      }
    }

```
this at build time gets resolved to:

```
"button-text-size": "16px"
```

This is an example: the real applications can be the most different depending on the context and the needs. For example, look at the [multi-brand-multi-platform](../multi-brand-multi-platform) demo, to see how the aliasing is used to create a powerful theming system.
