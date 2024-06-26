export const comment = {
  // Using * will work like apply to all nested scopes
  '*': { $value: '{color.font.tertiary}' },
  line: {
    $value: '{color.font.tertiary}',
    fontStyle: 'italic',
  },
  block: {
    documentation: { $value: '{color.font.secondary}' },
  },
  single: { $value: '{color.font.tertiary}' },
};
