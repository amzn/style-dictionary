// For coloring inserted and removed text, use either a background
// or a border color but not both
export const diffEditor = {
  insertedTextBackground: { $value: '{color.background.success}', modify: { alpha: 0.2 } },
  insertedTextBorder: {},
  insertedLineBackground: { $value: '{color.background.success}', modify: { alpha: 0.2 } },
  removedTextBackground: { $value: '{color.background.danger}', modify: { alpha: 0.2 } },
  removedTextBorder: {},
  removedLineBackground: { $value: '{color.background.danger}', modify: { alpha: 0.2 } },
  border: {},
};
