export const support = {
  class: {
    '*': { $value: '{color.font.code.22}' },
    component: {
      '*': { $value: '{color.font.code.22}' },
    },
  },
  constant: {
    color: { $value: '{color.font.code.27}' },
    'font-name': { $value: '{color.font.code.27}' },
    'property-value': { $value: '{color.font.code.27}' },
    // Math as in Math.floor in JS
    math: {},
  },
  function: {
    '*': { $value: '{color.font.code.8}' },
    kernel: {},
    // functions on the global Math object like .floor or .round
    math: {},
  },
  type: {
    'property-name': {
      '*': { $value: '{color.font.code.26}' },
      css: { $value: '{color.font.primary}' },
    },
    vendored: { $value: '{color.font.code.22}' },
  },
};
