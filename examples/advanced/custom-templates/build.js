const StyleDictionary = require('style-dictionary').extend(__dirname + '/config.json');
const fs = require('fs');
const _ = require('lodash');
const handlebars = require('handlebars');
const pug = require('pug');


console.log('Build started...');
console.log('\n==============================================');


// DECLARE CUSTOM TEMPLATES
// Notice: these templates expect the Lodash "template" syntax

StyleDictionary.registerTemplate({
  name: 'custom/template/scss',
  template: __dirname + '/templates/web-scss.template'
});

StyleDictionary.registerTemplate({
  name: 'custom/template/ios-plist',
  template: __dirname + '/templates/ios-plist.template'
});

StyleDictionary.registerTemplate({
  name: 'custom/template/android-xml',
  template: __dirname + '/templates/android-xml.template'
});


// DECLARE CUSTOM FORMATS VIA CUSTOM TEMPLATES
// Notice: this is an alternative way to use custom templates to generate token files with custom formats

// in this case we are using the same template as above, to declare a custom format
const templateCustomScss = _.template(fs.readFileSync(__dirname + '/templates/web-scss.template'));

StyleDictionary.registerFormat({
  name: 'custom/format/scss',
  formatter: function(dictionary, platform) {
    return templateCustomScss({
      allProperties: dictionary.allProperties
    });
  }
});

// In this case we are using an alternative templating engine (Handlebars)
const templateCustomXml = handlebars.compile(fs.readFileSync(__dirname + '/templates/android-xml_alt.hbs', 'utf8'));

StyleDictionary.registerFormat({
  name: 'custom/format/android-xml',
  formatter: function(dictionary, platform) {
    return templateCustomXml({
      allProperties: dictionary.allProperties,
      options: platform // this is just to show how, if you need them, you can pass also the properties of the "platform" to the template
    });
  }
});

// ... and here another templating engine (Pug)
const templateCustomPlist = pug.compileFile(__dirname + '/templates/ios-plist_alt.pug', { pretty: true });

StyleDictionary.registerFormat({
  name: 'custom/format/ios-plist',
  formatter: function(dictionary) {
    return templateCustomPlist({
      allProperties: dictionary.allProperties
    });
  }
});


// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionary.buildAllPlatforms();


console.log('\n==============================================');
console.log('\nBuild completed!');
