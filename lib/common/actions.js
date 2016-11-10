var _  = require('lodash'),
    fs = require('fs-extra');


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

  "copy_assets": function(dictionary, config) {
    console.log('Copying assets directory');
    fs.copySync('assets', config.buildPath + 'assets');
  }
};
