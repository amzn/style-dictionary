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
  'css/variables': function(dictionary) {
    var to_ret;
    return cssHeader() + ':root {\n' + _.map(dictionary.allProperties, function (prop) {
      if (prop.attributes.category !== 'asset') {
        to_ret = '  --' + prop.name + ': ' + prop.value + ';';

        if (prop.attributes.comment)
          to_ret = to_ret.concat(' /* ' + prop.attributes.comment + ' */ ');
        return to_ret;
      }
    }).filter(function (strVal) { return !!strVal; }).join('\n') + '\n}\n';
  },

  'scss/variables': function(dictionary) {
    var to_ret;
    return sassHeader() + _.map(dictionary.allProperties, function (prop) {
      if (prop.attributes.category !== 'asset') {
        to_ret = '$' + prop.name + ': ' + prop.value + ';';

        if (prop.attributes.comment)
          to_ret = to_ret.concat(' // ' + prop.attributes.comment);
        return to_ret;
      }
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
