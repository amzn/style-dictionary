## Custom templates

This example shows how to use "custom" templates to generate design tokens files with custom formats. This is useful when you need to distribute your design tokens and integrate them with custom pipelines or scripts, that expect specific formats, or if you have very specific needs that are not covered out-of-the-box by Style Dictionary.

**Notice**: before starting to dig into all the possible customisations that you can have, try the default settings offered by the library, look at the output files, and see if they can suit your needs. Probably they will do. If they don't, think how you want the output files generated, and see which one of the API methods you can use for that specific scope.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will generate the files in the `build` folder.

#### How does it work

The "build" command will run the custom script `build.js`, that contains three different custom templates, one for every platform declared in the `config.js` file. For example, this is the custom template declaration for the "android" platform:

```
StyleDictionary.registerTemplate({
  name: 'custom/template/android-xml',
  template: __dirname + '/templates/android-xml.template'
});
```

As you can see, the `registerTemplate` [API method](https://amzn.github.io/style-dictionary/#/api?id=registertemplate) is invoked, passing a custom name for the template (you can choose whatever you like, it's just a string) and a path to a templating file (these templates expect the Lodash ["template"](https://lodash.com/docs/4.17.10#template) syntax). 

The template is then used in the `config.js` file and passed to a `file` declaration for a platform (look at the `config.js` file in the example to see how it is used).

Using this approach to create custom file formats for the generation of design token files is quite simple, but is not the only method that can be used. Alternatively, you can use the `registerFormat` [API method](https://amzn.github.io/style-dictionary/#/api?id=registerformat). In this case, the method still expects a custom name, but instead of a template file as a second argument, it expects a formatting function that returns the content to be saved to file:

```
const templateCustomXml = handlebars.compile(fs.readFileSync(__dirname + '/templates/android-xml_alt.hbs', 'utf8'));

StyleDictionary.registerFormat({
  name: 'custom/format/android-xml',
  formatter: function(dictionary, platform) {
    return templateCustomXml({
      properties: dictionary.properties,
      allProperties: dictionary.allProperties,
      options: platform
    });
  }
});
```

For the formatting function, it's possible to use any templating language (Lodash, Mustache, PUG, anything that can return a string). In the example, we have used three different languages to show the differences.

#### What to look at

Open the `config.js` file and see how for each platform there are two kinds of `files` declarations, one that uses a custom template and one that uses a custom format.

```
"android": {
    "transformGroup": "android",
    "buildPath": "build/android/",
    "files": [{
        "destination": "tokens_template.xml",
        "template": "custom/template/android-xml"
    },{
        "destination": "tokens_format.xml",
        "format": "custom/format/android-xml"
    }]
}
```

Now open the `build.js` script and look at how these custom template/formats are declared. As said above, we show both the possible approaches, using both the `registerTemplate` and `registerFormat` API methods to highlight the differences between the two. The first one is simpler, but relies on Lodash "template" syntax, the second is slightly more complex, but you can use whatever templating language you prefer.

One interesting thing to notice is that the same file `templates/web-scss.template` is used in both a `registerTemplate` and `registerFormat` declaration. This is to show how, in reality, these two methods are completely equivalent.

Finally, look at the different template files in the `templates` folder and see how they are built to generate custom file formats in output:

* **web-scss.template**: this is a template that uses [Lodash](https://lodash.com/docs/4.17.10#template), and shows how you can create a custom format for Sass/Scss files. The same approach can be used if you need other custom formats for the web (or other platforms too).
* **android-xml.template**: this template too uses Lodash, and shows how to create a custom XML format for Android, that can be read as "resource file". This is just one of the many possible formats for Android, so if you need to create one speak with your developers to agree on the format they want.
* **android-xml_alt.hbs**: this is an alternative example of custom XML format for Android, that uses [Handlebar](https://handlebarsjs.com) as templating language.
* **ios-plist.template**: this template too uses Lodash, and shows how to create a custom PLIST format for iOS, that can be read as "resource file". This is just one of the many possible formats for iOS, so if you need to create one speak with your developers to agree on the format they want.
* **ios-plist_alt.pug**: this is an alternative example of custom XML format for Android, that uses [Pug](https://pugjs.org/api/getting-started.html) as templating language.
