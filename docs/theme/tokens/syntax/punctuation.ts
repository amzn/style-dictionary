export const punctuation = {
  accessor: {
    value: '{color.font.primary.value}',
  },
  definition: {
    array: {
      value: '{color.font.primary.value}',
    },
    block: {
      value: '{color.font.primary.value}',
    },
    dictionary: {
      value: '{color.font.primary.value}',
    },
    heading: { value: '{color.font.code.22.value}' },
    list: { value: '{color.font.code.21.value}' },
    parameters: {
      value: '{color.font.primary.value}',
    },
    quote: {},
    string: {
      '*': { value: '{color.font.code.25.value}' },
      begin: {},
      end: {},
    },
    tag: {
      '*': { value: '{color.font.primary.value}' },
    },
    typeparameters: { value: '{color.font.primary.value}' },

    // ${} in string templates in JS
    'template-expression': {
      '*': { value: '{color.font.code.21.value}' },
      begin: {},
      end: {},
    },
    variable: {},
  },

  section: {
    '*': { value: '{color.font.secondary.value}' },
    interpolation: {
      begin: {},
      end: {},
    },
  },
  separator: {
    '*': { value: '{color.font.primary.value}' },
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
    '*': { value: '{color.font.tertiary.value}' },
  },
};
