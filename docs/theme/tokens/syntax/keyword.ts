// Things like `new`, import/export, and operators like conditionals or relational
// (less than, greater than, etc.). Does not include type words like
// `async`, `var`, `let`, etc., those are in storage.
export const keyword = {
  // Using '*' here will apply this to the `keyword` scope
  '*': { value: '{color.font.code.8.value}' },
  control: {
    '*': { value: '{color.font.code.8.value}' },
    conditional: {},
    export: {},
    import: {
      value: '{color.font.code.8.value}',
      fontStyle: 'italic',
    },
    from: {
      value: '{color.font.code.8.value}',
      fontStyle: 'italic',
    },
    flow: {
      value: '{color.font.code.8.value}',
    },
  },
  operator: {
    '*': { value: '{color.font.primary.value}' },
    arithmetic: {},
    assignment: {},
    bitwise: {},
    logical: {
      value: '{color.font.primary.value}',
    },
    word: {},
  },
  other: {
    unit: { value: '{color.font.code.29.value}' },
  },
};
