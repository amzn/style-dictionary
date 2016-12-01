var fs = require('fs-extra');
var StyleDictionary = require('../../index');

var pwd = process.cwd();
var config = JSON.parse( fs.readFileSync(pwd + '/config.json') );
var sd = StyleDictionary.extend( config );

sd.registerTemplate({
  name: 'reactNative/colors',
  template: __dirname + '/templates/js/colorStyles.js.template'
});

sd.registerAction({
  name: 'ios/copy',
  action: function() {
    fs.copySync('build/ios', '../ios');
  }
});

sd.registerAction({
  name: 'android/copy',
  action: function() {
    fs.copySync('build/android', '../android');
  }
});

sd.registerAction({
  name: 'reactNative/copy',
  action: function() {
    fs.copySync('build/react-native', '../react-native');
  }
});

sd.buildAllPlatforms();
