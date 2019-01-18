const base = require('./base');

module.exports = Object.assign({}, base, {
  'background-color': { value: '{color.background.base.value}' },
  'color': { value: '{color.font.link.value}' },
  'border-color': { value: '{color.border.base.value}' },
  'border-width': { value: '{size.border.width.base.value}' },
  'border-radius': { value: '{size.border.radius.base.value}' },
});