const StyleDictionary = require('style-dictionary');

console.log('Build started...');
console.log('\n==============================================');


// REGISTER THE CUSTOM TRANFORMS

StyleDictionary.registerTransform({
  name: 'hexRGB/hexARGB',
  type: 'value',
  matcher: function(token) {
      return token.group === 'color';
  },
  transformer: function(token) {
      // for sake of simplicity, in this example we assume colors are always in the format #xxxxxx
      return token.value.replace(/^#/,'#FF');
  }
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/config.json');


// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();


console.log('\n==============================================');
console.log('\nBuild completed!');
