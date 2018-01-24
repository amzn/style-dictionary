# Actions

Actions provide a way to run custom build code such as generating binary assets like images.

Here are all the actions that come with the Style Dictionary build system. We try to include what most people might need. You can define custom actions with the [`registerAction`](api.md#registeraction). If you think we are missing some things, take a look at our [contributing docs](https://github.com/amzn/style-dictionary/blob/master/CONTRIBUTING.md) and send us a pull request! If you have a specific need for your project, you can always write your own [custom actions](#adding-custom-actions).

You use actions in your config file under platforms > [platform] > actions

```json
{
  "source": ["properties/**/*.json"],
  "platforms": {
    "android": {
      "transformGroup": "android",
      "files": [],
      "actions": ["copy_assets"]
    }
  }
}
```


----

## Pre-defined Actions

[lib/common/actions.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/actions.js)

### android/copyImages 


Action to copy images into appropriate android directories.


* * *

### copy_assets 


Action that copies everything in the assets directory to a new assets directory in the build path of the platform.


* * *

