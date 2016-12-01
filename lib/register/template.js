var fs = require('fs'),
    _  = require('lodash');

/**
 * Add a custom format to the style property builder
 * @memberOf StyleDictionary
 * @param {Object} options
 * @param {String} options.name
 * @param {String} options.template
 * @returns StyleDictionary object
 */
function registerTemplate(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (typeof options.template !== 'string')
    throw new Error('template path must be a string');
  if (!fs.existsSync(options.template))
    throw new Error('template must be a file');

  var template_string = fs.readFileSync( options.template );

  this.template[options.name] = _.template( template_string );
  return this;
}

module.exports = registerTemplate;