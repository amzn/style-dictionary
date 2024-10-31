// Things like `new`, import/export, and operators like conditionals or relational
// (less than, greater than, etc.). Does not include type words like
// `async`, `var`, `let`, etc., those are in storage.
export const keyword = {
  // Using '*' here will apply this to the `keyword` scope
  '*': { $value: '{color.font.code.8}' },
  control: {
    '*': { $value: '{color.font.code.8}' },
    conditional: {},
    export: {},
    import: {
      $value: '{color.font.code.8}',
      fontStyle: 'italic',
    },
    from: {
      $value: '{color.font.code.8}',
      fontStyle: 'italic',
    },
    flow: {
      $value: '{color.font.code.8}',
    },
  },
  operator: {
    '*': { $value: '{color.font.primary}' },
    arithmetic: {},
    assignment: {},
    bitwise: {},
    logical: {
      $value: '{color.font.primary}',
    },
    word: {},
  },
  other: {
    unit: { $value: '{color.font.code.29}' },
  },
};
