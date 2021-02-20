const _ = require('lodash');

function fileHeader(showFileHeader = true, commentStyle) {
  var to_ret = '';
  if (showFileHeader) {
    if (commentStyle === 'short') {
      to_ret += '\n';
      to_ret += '// Do not edit directly\n';
      to_ret += '// Generated on ' + new Date().toUTCString() + '\n';
      to_ret += '\n';
    } else {
      to_ret += '/**\n';
      to_ret += ' * Do not edit directly\n';
      to_ret += ' * Generated on ' + new Date().toUTCString() + '\n';
      to_ret += ' */\n\n';
    }
  }

  return to_ret;
}

function formattedVariables(format, dictionary, outputReferences = false) {
  var prefix, commentStyle, indentation, separator;

  switch(format) {
    case 'css':
      prefix = '--';
      indentation = '  ';
      separator = ':';
      break;
    case 'sass':
      prefix = '$';
      commentStyle = 'short';
      indentation = '';
      separator = ':';
      break;
    case 'less':
      prefix = '@';
      commentStyle = 'short';
      indentation = '';
      separator = ':';
      break;
    case 'stylus':
      prefix = '$';
      commentStyle = 'short';
      indentation = '';
      separator = '=';
      break;
  }

  return dictionary.allProperties
    // Some languages are imperative, meaning a variable has to be defined
    // before it is used. If `outputReferences` is true, check if the token
    // has a reference, and if it does send it to the end of the array.
    .sort((a) => {
      if (outputReferences) {
        if (dictionary.usesReference(a.original.value)) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 0;
      }
    })
    .map(function(prop) {
      var to_ret_prop = `${indentation}${prefix}${prop.name}${separator} `;
      let value = prop.value;

      if (outputReferences && dictionary.usesReference(prop.original.value)) {
        var ref = dictionary.getReference(prop.original.value).name;
        if (format === 'css') {
          value = `var(${prefix}${ref})`
        } else {
          value = `${prefix}${ref}`;
        }
      }

      to_ret_prop += (prop.attributes.category==='asset' ? '"'+value+'"' : value);

      if (format == 'sass' && prop.themeable === true) {
        to_ret_prop += ' !default';
      }

      to_ret_prop += ';';

      if (prop.comment) {
        if (commentStyle === 'short') {
          to_ret_prop = to_ret_prop.concat(' // ' + prop.comment);
        } else {
          to_ret_prop = to_ret_prop.concat(' /* ' + prop.comment + ' */');
        }
      }

      return to_ret_prop;
    })
    .filter(function(strVal) { return !!strVal })
    .join('\n');
}

function iconsWithPrefix(prefix, properties, config) {
  return _.chain(properties)
    .filter(function(prop) {
      return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
    })
    .map(function(prop) {
      var varName = prefix + prop.name + ': ' + prop.value + ';';
      var className = '.' + config.prefix + '-icon.' + prop.attributes.item + ':before ';
      var declaration = '{ content: ' + prefix + prop.name + '; }';
      return varName + '\n' + className + declaration;
    })
    .value().join('\n');
}

function minifyDictionary(obj) {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  var toRet = {};

  if (obj.hasOwnProperty('value')) {
    return obj.value;
  } else {
    for(var name in obj) {
      if(obj.hasOwnProperty(name)) {
        toRet[name] = minifyDictionary(obj[name]);
      }
    }
  }
  return toRet;
}

module.exports = {
  minifyDictionary,
  fileHeader,
  formattedVariables,
  iconsWithPrefix,
}