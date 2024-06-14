export const support = {
  class: {
    '*': { value: '{color.font.code.22.value}' },
    component: {
      '*': { value: '{color.font.code.22.value}' },
    },
  },
  constant: {
    color: { value: '{color.font.code.27.value}' },
    'font-name': { value: '{color.font.code.27.value}' },
    'property-value': { value: '{color.font.code.27.value}' },
    // Math as in Math.floor in JS
    math: {},
  },
  function: {
    '*': { value: '{color.font.code.8.value}' },
    kernel: {},
    // functions on the global Math object like .floor or .round
    math: {},
  },
  type: {
    'property-name': {
      '*': { value: '{color.font.code.26.value}' },
      css: { value: '{color.font.primary.value}' },
    },
    vendored: { value: '{color.font.code.22.value}' },
  },
};
