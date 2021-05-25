## Multi Brand & Multi Platform

While it's pretty standard to use a common set of tokens to generate the same design tokens for different platforms (only in different format), this example shows how to setup a **multi-brand, multi-platform suite** of design tokens, with values that may depend on the brand (eg. a brand color) or the platform (eg. a font family).

In this specific case it's necessary to use a **custom build script** to process the tokens for each one of the possible brand/platform combinations. In the script the configuration used by Style Dictionary becomes parametric, with "brand" and "platform" used as arguments of a function that returns the "config" object used to extend Style Dictionary.

The tokens are organized in **specific folders**, depending if they are "platform" dependent, "brand" dependent or "global" (independent of platform or brand). The organization of the files used in this example is not strictly required, but has the advantage that it's easier to see what the tokens depend on, and it's easier to use global paths to include the correct files for a specific combination of "brand" and "platform" (see the "source" declaration block in the `getStyleDictionaryConfig` function of the build script).

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will generate the files in the `build` folder. Unlike other examples, the files are organised not only by "platform", but also organised in "brand" sub-folders.

#### How does it work

The "build" command will run the custom script `build.js`. This script loops on all the possible combinations of "platform" (web, iOS, Android) and "brand" ("brand-1", "brand-2" and "brand-3" in the example):

```
['brand-1', 'brand-2', 'brand-3'].map(function (brand) {
  ['web', 'ios', 'android'].map(function (platform) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand, platform));
    StyleDictionary.buildPlatform(platform);
  })
})

```

For each combination it receives a parametric configuration object from the `getStyleDictionaryConfig` function, where the input token files to read and the output paths where to write the generated files depend on the "platform" and "brand" values:

```
function getStyleDictionaryConfig(brand, platform) {
  return {
    "source": [
      `tokens/brands/${brand}/*.json`,
      "tokens/globals/**/*.json",
      `tokens/platforms/${platform}/*.json`
    ],
    "platforms": {
      "web": {
        "transformGroup": "web",
        "buildPath": `build/web/${brand}/`,
        "files": [{
          "destination": "tokens.scss",
          "format": "scss/variables"
        }]
      },
      ...
    }
  };
}
```
The tokens are stored in three different folders:

* **brands**: this folder contain tokens that depend on the "brand", eg. the "primary" and "secondary" colors (generally these are called "brand colors", think of the blue of Facebook, the orange of Amazon, or the red of Gmail).
* **platforms**: this folder contain tokens that depend on the "platform", eg. the font family used in the application or website (eg. a font stack like "Tahoma, Arial, 'Helvetica Neue', sans" on web, "San Francisco" in iOS, "Roboto" in Android).
* **global**: this folder contain tokens that are common, that don't depend on the specific "platform" or "brand", eg. the base grayscale colors, the font sizes, etc.

Leveraging the ability of Style Dictionary to reference other tokens values as "aliases", we can have generic tokens like `font.family.base` or `color.primary` whose values actually depend on the "platform" and "brand" and whose values are computed dynamically at build time depending on the specific "platform/brand" files, included dynamically by the `getStyleDictionaryConfig` function.

#### What to look at

Open the `build.js` script and look how the `StyleDictionary.buildPlatform` function is called multiple times, looping on the combination of platform and brand, and how the configuration object is returned by the `getStyleDictionaryConfig` function.

Now look at the tokens folders, and see how they are organized. Open `tokens/brands/brand-1/color.json`. You will see this declaration:

```
{
  "color": {
    "brand": {
      "primary"   : { "value": "#3B5998" },
      "secondary" : { "value": "#4267B2" }
    }
  }
}
```

The actual values depend on the "brand" (compare this file with `brand-2/color.json` and `brand-3/color.json`. These values are used as "aliases" in the `tokens/global/color/base.json` file:

```
{
  "color": {
    "base": {
      ...
    },
    "primary"     : { "value": "{color.brand.primary.value}" },
    "secondary"   : { "value": "{color.brand.secondary.value}" },
    ...
  }
}
```

Depending on the file included at build time, the actual value of `color.primary` will depend on the "brand". To see how this works out, open the file `build/web/brand-1/tokens.scss` and compare it with the similar files for "brand-2" and "brand-3": you will see how the values for `color.primary`, `color.action.primary` are different for different brands, and how they are actually the values declared in the "brands" source folders.

In the same way, now open `tokens/platforms/android/font.json` and you will see:

```
{
  "font": {
    "platform": {
      "system": { "value": "Roboto" }
    }
  }
}
```
the value `font.platform.system` is consumed by the `tokens/globals/font/index.json` file:

```
{
  "font": {
    "family": {
      "headers" : { "value": "Montserrat" },
      "base"    : { "value": "{font.platform.system.value}" }
    }
  }
}
```
In this way the design tokens for the different platforms will be:

```
// WEB
$font-family-headers: Montserrat;
$font-family-base: Tahoma, Arial, 'Helvetica Neue', sans;
```

```
// IOS
#define FontFamilyHeaders @"Montserrat"
#define FontFamilyBase @"San Francisco"

```

```
// ANDROID
// TODO - here you would see that the font-family-base is "Roboto"
```
