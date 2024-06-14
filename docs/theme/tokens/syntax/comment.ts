export const comment = {
  // Using * will work like apply to all nested scopes
  '*': { value: '{color.font.tertiary.value}' },
  line: {
    value: '{color.font.tertiary.value}',
    fontStyle: 'italic',
  },
  block: {
    documentation: { value: '{color.font.secondary.value}' },
  },
  single: { value: '{color.font.tertiary.value}' },
};
