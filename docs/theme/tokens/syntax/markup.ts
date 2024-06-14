// Things in markup/markdown languages. Applies to markdown files as well as
// documentation comments if you include markdown syntax.
export const markup = {
  bold: {
    value: '{color.font.code.28.value}',
    fontStyle: 'bold',
  },
  italic: {
    value: '{color.font.code.27.value}',
    fontStyle: 'italic',
  },
  fenced_code: {
    value: '{color.font.primary.value}',
  },
  heading: {
    value: '{color.font.primary.value}',
    fontStyle: 'bold',
  },
  quote: {
    value: '{color.font.secondary.value}',
    fontStyle: 'italic',
  },
  underline: {
    link: { value: '{color.font.code.26.value}' },
  },
};
