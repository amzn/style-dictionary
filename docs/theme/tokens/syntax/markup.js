// Things in markup/markdown languages. Applies to markdown files as well as
// documentation comments if you include markdown syntax.
export const markup = {
  bold: {
    $value: '{color.font.code.28}',
    fontStyle: 'bold',
  },
  italic: {
    $value: '{color.font.code.27}',
    fontStyle: 'italic',
  },
  fenced_code: {
    $value: '{color.font.primary}',
  },
  heading: {
    $value: '{color.font.primary}',
    fontStyle: 'bold',
  },
  quote: {
    $value: '{color.font.secondary}',
    fontStyle: 'italic',
  },
  underline: {
    link: { $value: '{color.font.code.26}' },
  },
};
