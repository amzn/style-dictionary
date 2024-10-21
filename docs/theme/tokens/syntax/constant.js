// Constants are things like booleans, nulls, numbers.
export const constant = {
  character: {
    // escape characters like /
    escape: {},
  },

  // Constants built into the the language like booleans
  language: {
    // Dart does not seem to have great syntax grammar definitions
    dart: { $value: '{color.font.code.26}' },
    boolean: {
      false: { $value: '{color.font.code.21}' },
      true: { $value: '{color.font.code.25}' },
    },
    // * import in JS
    'import-export-all': {
      $value: '{color.font.code.27}',
    },
    null: { $value: '{color.font.code.21}' },
    symbol: { $value: '{color.font.code.29}' },
  },
  other: {
    placeholder: {},
  },
  numeric: {
    '*': { $value: '{color.font.code.29}' },
    // These have more specific scopes like integer.binary and integer.decimal
    integer: {},
    complex: {},
    float: {},
  },
};
