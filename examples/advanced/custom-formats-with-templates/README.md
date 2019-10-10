## Custom formats using templates

This example shows how to generate design tokens files with custom formats using "custom" template files/engines. This is useful when you need to distribute your design tokens and integrate them with custom pipelines or scripts, that expect specific formats, or if you have any specific needs that are not covered out-of-the-box by Style Dictionary.

**Notice**: before starting to dig into all the possible customisations that you can have, try the default settings offered by the library, look at the output files, and see if they can suit your needs. Probably they will do. If they don't, think how you want the output files generated, and see which one of the API methods you can use for that specific scope.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will generate the files in the `build` folder.

#### How does it work

The "build" command will run the custom script `build.js`, that contains three different custom templates, one for every platform declared in the `config.js` file. For example, this is the custom template declaration for the "android" platform:

```
StyleDictionary.registerFormat({
  name: 'custom/format/android-xml',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/android-xml.template'))
});
```

As you can see, the `registerFormat` [API method](https://amzn.github.io/style-dictionary/#/api?id=registerformat) is invoked, passing a custom name for the format (you can choose whatever string you like) and a formatting function that returns the content to be saved to file.

The format is then used in the `config.js` file and passed to a `file` declaration for a platform (look at the `config.js` file in the example to see how it is used).

For the formatting function, it's possible to use any templating language (Lodash, Mustache, PUG, anything that can return a string). In the example, we have used three different languages to show the differences.

#### What to look at

Open the `config.js` file and see how for each platform the `files` declarations use custom formats:

```
"android": {
    "transformGroup": "android",
    "buildPath": "build/android/",
    "files": [{
        "destination": "tokens.xml",
        "format": "custom/format/android-xml"
    },{
        "destination": "tokens_alt.xml",
        "format": "custom/format/android-xml-alt"
    }]
}
```

Now open the `build.js` script and look at how these custom formats are declared, using **different templating files/engines**.

Finally, look at the different template files in the `templates` folder and see how they are built to generate custom file formats in output:

* **web-scss.template**: this is a template that uses [Lodash](https://lodash.com/docs/4.17.10#template), and shows how you can create a custom format for Sass ".scss" files. The same approach can be used if you need other custom formats for the web (or other platforms too).
* **android-xml.template**: this template uses Lodash as well, and shows how to create a custom XML format for Android, that can be read as "resource file". This is one of the many possible formats for Android that you could create.
* **android-xml_alt.hbs**: this is an alternative example of custom XML format for Android, that uses [Handlebar](https://handlebarsjs.com) as templating language.
* **ios-plist.template**: this template uses Lodash as well, and shows how to create a custom PLIST format for iOS, that can be read as "resource file". This is one of the many possible formats for iOS that you could create.
* **ios-plist_alt.pug**: this is an alternative example of custom XML format for Android, that uses [Pug](https://pugjs.org/api/getting-started.html) as templating language.
