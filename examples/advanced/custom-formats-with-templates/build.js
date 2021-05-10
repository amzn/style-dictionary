const StyleDictionary = require('style-dictionary').extend(__dirname + '/config.json');
const fs = require('fs');
const _ = require('lodash');
const handlebars = require('handlebars');
const pug = require('pug');


console.log('Build started...');
console.log('\n==============================================');


// DECLARE CUSTOM FORMATS VIA CUSTOM TEMPLATE FILES (AND ENGINES)


// These formatting functions are using the Lodash "template" syntax

StyleDictionary.registerFormat({
  name: 'custom/format/scss',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/web-scss.template'))
});

StyleDictionary.registerFormat({
  name: 'custom/format/ios-plist',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/ios-plist.template'))
});

StyleDictionary.registerFormat({
  name: 'custom/format/android-xml',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/android-xml.template'))
});


// In this case we are using an alternative templating engine (Handlebars)
const templateCustomXml = handlebars.compile(fs.readFileSync(__dirname + '/templates/android-xml_alt.hbs', 'utf8'));

StyleDictionary.registerFormat({
  name: 'custom/format/android-xml-alt',
  formatter: function({dictionary, platform}) {
    return templateCustomXml({
      // this is to show that the formatter function only takes a "dictionary" and "platform" parameters
      // (and dictionary has "tokens" and "allTokens" attributes)
      // and returns a string. for more details about the "formatter" function refer to the documentation
      allTokens: dictionary.allTokens,
      tokens: dictionary.tokens,
      options: platform
    });
  }
});


// ... and here another templating engine (Pug)
const templateCustomPlist = pug.compileFile(__dirname + '/templates/ios-plist_alt.pug', { pretty: true });

StyleDictionary.registerFormat({
  name: 'custom/format/ios-plist-alt',
  formatter: function({dictionary}) {
    return templateCustomPlist({
      allTokens: dictionary.allTokens
    });
  }
});


// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionary.buildAllPlatforms();


console.log('\n==============================================');
console.log('\nBuild completed!');
