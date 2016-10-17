var fs = require('fs');
var StyleDictionary = require('../index');

var pwd = process.cwd();
var config = JSON.parse( fs.readFileSync(pwd + '/config.json') );
var sd = StyleDictionary.extend( config );

sd.buildAllPlatforms();
