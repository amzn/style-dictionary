// A lot of elements have a meta scope, but it takes a lower priority than more
// specific scopes. For example, every element from the start of a class definition
// in Javascript to the end curly brace has a scope of `meta.class`.
// The elements where this has higher specificity are things like braces
// (curly, square, round)
export const meta = {
  brace: {
    round: {
      /* () */ '*': { value: '{color.font.primary.value}' },
    },
    square: {
      /* [] */ '*': { value: '{color.font.primary.value}' },
    },
  },
  class: {
    '*': { value: '{color.font.code.22.value}' },
  },
  jsx: {
    children: {
      '*': { value: '{color.font.primary.value}' },
    },
  },
  object: {
    '*': { value: '{color.font.code.29.value}' },
    member: {},
  },
  'property-name': {
    css: { value: '{color.font.code.5.value}' },
  },
  'property-value': {
    css: { value: '{color.font.code.5.value}' },
  },
  'property-list': {},
  selector: {
    '*': { value: '{color.font.code.5.value}' },
  },
  structure: {
    dictionary: {
      '*': { value: '{color.font.code.28.value}' },
    },
  },
  tag: {
    attributes: { value: '{color.font.code.29.value}' },
  },
  type: {
    parameters: { value: '{color.font.code.23.value}' },
  },
  var: {
    expr: {
      '*': { value: '{color.font.code.8.value}' },
    },
  },
};
