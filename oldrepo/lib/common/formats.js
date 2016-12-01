var _ = require('lodash'),
    convertToBase64 = require('../utils/convertToBase64');
var font_before = "@font-face {font-family: 'scapp_iconsregular'; src: url(data:application/x-font-ttf;charset=utf-8;base64,";
var font_after = ") format('truetype'); font-weight: normal; font-style: normal; }";
var module_def = "module.exports = ";

module.exports = {
  "scss/variables": function(dictionary) {
    var to_ret;
    return _.map(dictionary.allProperties, function (prop) {
      if (prop.attributes.category !== 'asset') {
        to_ret = '$' + prop.name + ': ' + prop.value + ';';

        if (prop.attributes.comment)
          to_ret = to_ret.concat(' // ' + prop.attributes.comment);
        return to_ret;
      }
    }).join('\n');
  },

  "scss/icons": function(dictionary, config) {
    return _.chain(dictionary.allProperties)
      .filter(function(prop) {
        return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
      })
      .map(function(prop) {
        var varName = '$' + prop.name + ': ' + prop.value + ';';
        var className = '.' + config.prefix + '-icon.' + prop.attributes.item + ':before ';
        var declaration = '{ content: $' + prop.name + '; }';
        return varName + '\n' + className + declaration;
      })
      .value().join('\n');
  },

  "scss/font": function(dictionary) {
    return _.chain(dictionary.allProperties)
      .filter(function(prop) {
        return prop.attributes.category === 'asset' && prop.attributes.type === 'font';
      })
      .map(function(prop) {
        return font_before + convertToBase64(prop.value) + font_after;
      })
      .value().join('\n');
  },


  "javascript/module": function(dictionary) {
    return module_def + JSON.stringify(dictionary.properties) + ';';
  },

  "javascript/object": function(dictionary, config) {
    return 'var ' +
      config.jsVariableName +
      ' = ' +
      JSON.stringify(dictionary.properties, null, 2) +
      ';';
  },

  "json": function(dictionary) {
    return JSON.stringify(dictionary.properties, null, 2);
  },

  "json/asset": function(dictionary) {
    return JSON.stringify({asset: dictionary.properties.asset}, null, 2);
  },

  "sketch/palette": function(dictionary, config) {
    var to_ret = {
      "compatibleVersion":"1.0",
      "pluginVersion":"1.1"
    };
    to_ret.colors = _.chain(dictionary.allProperties)
      .filter(function(prop) {
        return prop.attributes.category === 'color' && prop.attributes.type === 'base';
      })
      .map(function(prop) {
        return prop.value;
      })
      .value();
    return JSON.stringify(to_ret, null, 2);
  }
};
