/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var _ = require('lodash');
var module_def = 'module.exports = ';

function jsHeader() {
  return '/**\n' +
         ' * Do not edit directly\n' +
         ' * Generated on ' + new Date() + '\n' +
         ' */\n\n';
}

function sassHeader() {
  return '//\n' +
         '// Do not edit directly\n' +
         '// Generated on ' + new Date() + '\n' +
         '//\n\n'
}

function cssHeader() {
  return '/* Do not edit directly */\n' +
         '/* Generated on ' + new Date() + ' */\n\n';
}

module.exports = {
  'css/fonts': function(dictionary) {
    var fontFaces = {};
    _.each(dictionary.allProperties, function (prop) {
      if (prop.attributes.category === 'asset' && prop.attributes.type === 'font') {
        var parent = prop.path.slice(0);
        var child = parent.pop();
        var attrStr = JSON.stringify(parent);
        if(!fontFaces[attrStr]) {
          fontFaces[attrStr] = {};
        }
        fontFaces[attrStr][child] = prop.value;
      }
    });

    var genSrc = function (properties) {
      var tabs = '  ';
      var srcIndent = '     ';
      var asset_path = '../';

      var name = '', weight = '', style = '';
      var prefix = '@font-face {\n' + tabs + "font-family: '{{NAME}}';\n";
      var postfix = '}\n';
      var formats = [];

      Object.keys(properties).forEach(function (key) {
        var prop = properties[key];

        if(key === 'name' || key === 'weight' || key === 'style') {
          return;
        }
        else {
          var filepath = prop.split('.');
          var file_suffix = filepath.pop();
          filepath = asset_path + filepath.join('.');

          switch (file_suffix) {
            case 'eot':
              formats.unshift(tabs + srcIndent + "url('" + filepath + ".eot');\n" + tabs + "src: url('" + filepath + ".eot?#iefix') format('embedded-opentype')");
              break;
            case 'svg':
              formats.push(tabs + srcIndent + "url('" + filepath + ".svg#{{NAME}}') format('svg')");
              break;
            case 'ttf':
              formats.push(tabs + srcIndent + "url('" + filepath + ".ttf') format('truetype')");
              break;
            case 'woff':
            case 'woff2':
            default:
              formats.push(tabs + srcIndent + "url('" + filepath + "." + file_suffix + "') format('" + file_suffix + "')");
              break;
          }
        }
      });

      if(properties.style) {
        postfix = tabs + 'font-style: ' + properties.style + ';\n' + postfix;
      }
      if(properties.weight) {
        postfix = tabs + 'font-weight: ' + properties.weight + ';\n' + postfix;
      }

      var font_face = prefix + tabs + 'src: ' + formats.join(',\n').trim() + ";\n" + postfix;
      font_face = font_face.replace(/\{\{NAME\}\}/g, properties.name);

      return font_face;
    };

    var font_face_arr = [];
    Object.keys(fontFaces).forEach(function (key) {
      var fontFace = fontFaces[key];

      if(fontFace) {
        font_face_arr.push(genSrc(fontFace));
      }
    });
    font_face_arr = font_face_arr.filter(function (strVal) { return !!strVal; });

    return cssHeader() + font_face_arr.join('\n');
  },

  'css/variables': function(dictionary) {
    var root_vars = ':root {\n' + _.map(dictionary.allProperties, function (prop) {
      var to_ret_prop = '  --' + prop.name + ': ' + prop.value + ';';

      if (prop.attributes.comment)
        to_ret_prop = to_ret_prop.concat(' /* ' + prop.attributes.comment + ' */ ');
      return to_ret_prop;
    }).filter(function (strVal) { return !!strVal; }).join('\n') + '\n}\n';

    return cssHeader() + root_vars;
  },

  'scss/variables': function(dictionary) {
    var to_ret;
    return sassHeader() + _.map(dictionary.allProperties, function (prop) {
      to_ret = '$' + prop.name + ': ' + prop.value + ';';

      if (prop.attributes.comment)
        to_ret = to_ret.concat(' // ' + prop.attributes.comment);
      return to_ret;
    }).filter(function (strVal) { return !!strVal; }).join('\n');
  },

  'scss/icons': function(dictionary, config) {
    return sassHeader() + _.chain(dictionary.allProperties)
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

  'javascript/module': function(dictionary) {
    return  jsHeader() +
      module_def +
      JSON.stringify(dictionary.properties, null, 2) + ';';
  },

  'javascript/object': function(dictionary) {
    return  jsHeader() +
      'var ' +
      (this.name || '_styleDictionary') +
      ' = ' +
      JSON.stringify(dictionary.properties, null, 2) +
      ';';
  },

  'javascript/es6': function(dictionary) {
    // this is bound to the file object
    var props = _.filter(dictionary.allProperties, this.filter);
    return jsHeader() +
      _.map(props, function(prop) {
        return 'export const ' + prop.name + ' = \'' + prop.value + '\';';
      }).join('\n');
  },

  'json': function(dictionary) {
    return JSON.stringify(dictionary.properties, null, 2);
  },

  'json/asset': function(dictionary) {
    return JSON.stringify({asset: dictionary.properties.asset}, null, 2);
  },

  'sketch/palette': function(dictionary) {
    var to_ret = {
      'compatibleVersion':'1.0',
      'pluginVersion':'1.1'
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
