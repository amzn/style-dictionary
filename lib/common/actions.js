var _          = require('lodash'),
    fs         = require('fs-extra'),
    path       = require('path'),
    sys        = require('sys'),
    fileExists = require('../utils/fileExists'),
    exec       = require('child_process').execSync;

function puts(error, stdout, stderr) { sys.puts(stdout) }


module.exports = {
  "android/copyImages": function(dictionary, config) {
    var imagesDir = config.buildPath + 'android/main/res/drawable-';
    _.each(dictionary.allProperties, function(prop) {
      if (prop.attributes.category === 'asset' && prop.attributes.type === 'image') {
        var name = prop.path.slice(2,4).join('_');
        fs.copySync(prop.value, imagesDir + prop.attributes.state + '/' + name + '.png');
      }
    });
  },

  "web/aui_build": function(dictionary, config) {
    var assets_yml_path = 'assets.yml';
    var assets_yml_exists = fileExists(assets_yml_path);
    var assets_yml = "sourceDirectories:\n  - src/";
    
    if (assets_yml_exists) {
      console.warn('You have an assets.yml file in your package, make sure you have all your assets declared in there!')
    } else {
      console.log('Building an assets yml file');
      fs.writeFileSync(assets_yml_path, assets_yml);
    }

    console.log('Doing an AUI Build');
    try {
      exec("amazon_ui", puts);
    } catch(err) {
      console.error(err.name + ': ' + err.message)
    }

    console.log('Cleaning up AUI files');
    fs.removeSync('src');
    if (!assets_yml_exists) {
      fs.removeSync(assets_yml_path);
    }
  },

  "web/buzz_build": function(dictionary, config) {
    var config_hjson_path = 'config.hjson';
    var config_hjson_exists = fileExists(config_hjson_path);
    var config_hjson = "{\n  recipe: aui\n}";

    if (config_hjson_exists) {
      console.warn('You have a config.hjson file in your package, make sure you have all your assets declared in there!')
    } else {
      console.log('Building a config.hjson file');
      fs.writeFileSync(config_hjson_path, config_hjson);
    }

    console.log('Doing a Buzz Build');
    try {
      exec("buzz", puts);
    } catch(err) {
      console.error(err.name + ': ' + err.message)
    }

    console.log('Cleaning up buzz files');
    if (!config_hjson_exists) {
      fs.removeSync(config_hjson_path);
    }
  },

  "copy_assets": function(dictionary, config) {
    console.log('Copying assets directory');
    fs.copySync('assets', config.buildPath + 'assets');
  }
};
