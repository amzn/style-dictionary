const yaml = require('js-yaml');
const fs = require('fs');
const glob = require('glob');
const config = yaml.safeLoad(fs.readFileSync('./config.yml'));
const deepExtend = require('style-dictionary/lib/utils/deepExtend');

// Copied from lib/extend.js
// If you don't want property collision detection
// feel free to remove references to Collision
function Collision(opts) {
  if (config.log) {
    var str = `Collision detected at: ${opts.path.join('.')}! Original value: ${opts.target[opts.key]}, New value: ${opts.copy[opts.key]}`;
    if (config.log === 'warn') {
      console.warn(str);
    } else if (config.log === 'error') {
      throw new Error(str);
    }
  }
}

// Need to combine properties files
// Replicating functionality in lib/utils/combineJSON.js
var properties = {};
var files = [];

// If there are includes, add them to the properties object first,
// then delete include from the config. This is replicating
// functionality in lib/extend.js
if (config.include && _.isArray(options.include)) {
  config.include.forEach(function(file) {
    deepExtend([properties, yaml.safeLoad(fs.readFileSync(file))], Collision);
  });
  config.include = null;
}

// Create a flat array of files based on glob
config.source.forEach(function(src) {
  files = files.concat(glob.sync(src, {}));
});

// Merge all the properties files together
files.forEach(function(file) {
  deepExtend([properties, yaml.safeLoad(fs.readFileSync(file))], Collision);
});

// Add the newly created properties object to the config
config.properties = properties;
// Remove the source of the config so that the style dictionary
// doesn't try to combine those files because they aren't JSON
config.source = null;


// Now we can extend style dictionary like normal
const StyleDictionary = require('style-dictionary').extend(config);

StyleDictionary.buildAllPlatforms();
