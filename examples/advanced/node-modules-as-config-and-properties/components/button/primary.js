const base = require('./base');

// You can do interesting things like having a base object
// that you extend. This can be useful for defining component
// styles if you have a base style and variations.
module.exports = Object.assign({}, base, {
  'background-color': { value: '{color.background.link.value}' },
  'color': { value: '{color.font.inverse.base.value}' },
});