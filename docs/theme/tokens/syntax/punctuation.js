export const punctuation = {
  accessor: {
    $value: '{color.font.primary}',
  },
  definition: {
    array: {
      $value: '{color.font.primary}',
    },
    block: {
      $value: '{color.font.primary}',
    },
    dictionary: {
      $value: '{color.font.primary}',
    },
    heading: { $value: '{color.font.code.22}' },
    list: { $value: '{color.font.code.21}' },
    parameters: {
      $value: '{color.font.primary}',
    },
    quote: {},
    string: {
      '*': { $value: '{color.font.code.25}' },
      begin: {},
      end: {},
    },
    tag: {
      '*': { $value: '{color.font.primary}' },
    },
    typeparameters: { $value: '{color.font.primary}' },

    // ${} in string templates in JS
    'template-expression': {
      '*': { $value: '{color.font.code.21}' },
      begin: {},
      end: {},
    },
    variable: {},
  },

  section: {
    '*': { $value: '{color.font.secondary}' },
    interpolation: {
      begin: {},
      end: {},
    },
  },
  separator: {
    '*': { $value: '{color.font.primary}' },
    array: {
      /* commas between array items */
    },
    continuation: {},
    dictionary: {
      /* commas between object/dictionary attributes */
    },
  },
  terminator: {
    /* Semicolons in JS */
    '*': { $value: '{color.font.tertiary}' },
  },
};
