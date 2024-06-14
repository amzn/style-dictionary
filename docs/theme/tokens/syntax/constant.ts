// Constants are things like booleans, nulls, numbers.
export const constant = {
  character: {
    // escape characters like /
    escape: {},
  },

  // Constants built into the the language like booleans
  language: {
    // Dart does not seem to have great syntax grammar definitions
    dart: { value: '{color.font.code.26.value}' },
    boolean: {
      false: { value: '{color.font.code.21.value}' },
      true: { value: '{color.font.code.25.value}' },
    },
    // * import in JS
    'import-export-all': {
      value: '{color.font.code.27.value}',
    },
    null: { value: '{color.font.code.21.value}' },
    symbol: { value: '{color.font.code.29.value}' },
  },
  other: {
    placeholder: {},
  },
  numeric: {
    '*': { value: '{color.font.code.29.value}' },
    // These have more specific scopes like integer.binary and integer.decimal
    integer: {},
    complex: {},
    float: {},
  },
};
