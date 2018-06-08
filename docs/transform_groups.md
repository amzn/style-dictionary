# Transform Groups

Transform Groups are a way to easily define and use groups of transforms. They are an array of transforms. You can define custom transform groups with the [`registerTransformGroup`](api.md#registertransformgroup).

You use transformGroups in your config file under platforms > [platform] > transformGroup

```json
{
  "source": ["properties/**/*.json"],
  "platforms": {
    "android": {
      "transformGroup": "android"
    }
  }
}
```

----

## Pre-defined Transform groups

[lib/common/transformGroups.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/transformGroups.js)

### web 


Transforms:

[attribute/cti](transforms.md#attributecti)
[name/cti/kebab](transforms.md#namectikebab)
[size/px](transforms.md#sizepx)
[color/css](transforms.md#colorcss)


* * *

### scss 


Transforms:

[attribute/cti](transforms.md#attributecti)
[name/cti/kebab](transforms.md#namectikebab)
[time/seconds](transforms.md#timeseconds)
[content/icon](transforms.md#contenticon)
[size/rem](transforms.md#sizerem)
[color/css](transforms.md#colorcss)


* * *

### less 


Transforms:

[attribute/cti](transforms.md#attributecti)
[name/cti/kebab](transforms.md#namectikebab)
[time/seconds](transforms.md#timeseconds)
[content/icon](transforms.md#contenticon)
[size/rem](transforms.md#sizerem)
[color/hex](transforms.md#colorhex)


* * *

### html 


Transforms:

[attribute/cti](transforms.md#attributecti)
[attribute/color](transforms.md#attributecolor)
[name/human](transforms.md#namehuman)


* * *

### android 


Transforms:

[attribute/cti](transforms.md#attributecti)
[name/cti/snake](transforms.md#namectisnake)
[color/hex8android](transforms.md#colorhex8android)
[size/remToSp](transforms.md#sizeremtosp)
[size/remToDp](transforms.md#sizeremtodp)


* * *

### ios 


Transforms:

[attribute/cti](transforms.md#attributecti)
[name/cti/pascal](transforms.md#namectipascal)
[color/UIColor](transforms.md#coloruicolor)
[content/objC/literal](transforms.md#contentobjcliteral)
[asset/objC/literal](transforms.md#assetobjcliteral)
[size/remToPt](transforms.md#sizeremtopt)
[font/objC/literal](transforms.md#fontobjcliteral)


* * *

### assets 


Transforms:

[attribute/cti](transforms.md#attributecti)


* * *

