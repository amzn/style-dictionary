## Embed assets as base64

This example shows how it's possible to embed and distribute assets – like **images, icons and fonts** – directly as design tokens.

This means that you can centralise all your "core" design values in one single place and one single format, and make their distribution (and consumption) much easier.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, run `npm run build`. This command will generate the files in the `build` folder.

#### How does it work

In Style Dictionary it is possible to associate to the `value` of a property the path of a file. During the build process, the property is processed and the asset converted to a **base64 string**. In this way the asset can be distributed **embedded** in an output file that has a pre-defined format of your choice (JSON, JS, Sass, XML, PLIST, etc), and this can be then later consumed directly in your application or website.

For example, in **JavaScript** this code:

```
<img src={`"data:image/png;base64,${asset-image-logo}"`} alt="" />`
```

will be rendered as:

```
<img src="data:image/png;base64,PHN2ZyB4bWxucz0iaHR0..." />
```
and in **Sass** this code:

```
background-image: url('data:image/png;base64,$asset-image-logo');
```
will be rendered as:

```
background-image: url('data:image/png;base64,PHN2ZyB4bWxucz0iaHR0...');
```

#### What to look at

Open the `config.json` file and see how all the "assets/embed/*" platform blocks are configured:

```
    "assets/embed/json": {
      "transforms": ["attribute/cti", "name/cti/kebab", "asset/base64"],
      "buildPath": "build/json/",
      "files": [{
        "destination": "assets_icons.json",
        "format": "json/flat",
        "filter": {
          "attributes": { "category":"asset", "type":"icon" }
        }
      }
      ...
```

Here there are **three specific transforms**: *attribute/cti* to assign the Category/Type/Item attributes to the tokens, *name/cti/kebab* to assign them the correct name, and finally *asset/base64* to take the path declared in the "value" of the properties, convert the file at that path in base64 format, and assign the output of the base64 conversion to the "value" of the property.

If you take for example the file `assets/icons.json` you will see this declaration:

```
  "asset": {
    "icon": {
      "alert-circle": { "value": "assets/icons/alert-circle.svg" }

```
where the value of the `alert-circle` property is a path that points to the `alert-circle.svg` file in the `assets/icons/` folder. 

Now, `build` the dictionary and open the generated file `build/scss/assets_icons.scss`, and you will see this result:

```
$asset-icon-alert-circle: "PHN2ZyB4bWxucz0iaHR0...
``` 

As you can see, the asset has been converted to a base64 string and its value associated to a design token.
