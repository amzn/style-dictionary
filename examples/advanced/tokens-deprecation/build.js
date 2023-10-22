import StyleDictionary from 'style-dictionary';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import _ from 'lodash';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sd = await StyleDictionary.extend(__dirname + '/config.json');

console.log('Build started...');
console.log('\n==============================================');

sd.registerFormat({
  name: 'custom/format/scss',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/web-scss.template')),
});

sd.registerFormat({
  name: 'custom/format/ios-plist',
  formatter: _.template(fs.readFileSync(__dirname + '/templates/ios-plist.template')),
});

// FINALLY, BUILD ALL THE PLATFORMS
sd.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
