import { dirname } from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import handlebars from 'handlebars';
import pug from 'pug';
import webScssTemplate from './templates/web-scss.template.js';
import plistTemplate from './templates/plist.template.js';
import androidTemplate from './templates/android-xml.template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sd = await StyleDictionary.extend(__dirname + '/config.json');

console.log('Build started...');
console.log('\n==============================================');

// DECLARE CUSTOM FORMATS VIA CUSTOM TEMPLATE FILES (AND ENGINES)

// These formatting functions are using the Lodash "template" syntax

sd.registerFormat({
  name: 'custom/format/scss',
  format: ({ dictionary }) => webScssTemplate({ allTokens: dictionary.allTokens }),
});

sd.registerFormat({
  name: 'custom/format/ios-plist',
  format: async ({ dictionary }) => plistTemplate({ dictionary }),
});

sd.registerFormat({
  name: 'custom/format/android-xml',
  format: async ({ dictionary }) => androidTemplate({ dictionary }),
});

// In this case we are using an alternative templating engine (Handlebars)
const templateCustomXml = handlebars.compile(
  fs.readFileSync(__dirname + '/templates/android-xml_alt.hbs', 'utf8'),
);

sd.registerFormat({
  name: 'custom/format/android-xml-alt',
  format: function ({ dictionary, platform }) {
    return templateCustomXml({
      // this is to show that the format function only takes a "dictionary" and "platform" parameters
      // (and dictionary has "tokens" and "allTokens" attributes)
      // and returns a string. for more details about the "format" function refer to the documentation
      allTokens: dictionary.allTokens,
      tokens: dictionary.tokens,
      options: platform,
    });
  },
});

// ... and here another templating engine (Pug)
const templateCustomPlist = pug.compileFile(__dirname + '/templates/ios-plist_alt.pug', {
  pretty: true,
});

sd.registerFormat({
  name: 'custom/format/ios-plist-alt',
  format: function ({ dictionary }) {
    return templateCustomPlist({
      allTokens: dictionary.allTokens,
    });
  },
});

// FINALLY, BUILD ALL THE PLATFORMS
sd.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
