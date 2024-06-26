// A lot of elements have a meta scope, but it takes a lower priority than more
// specific scopes. For example, every element from the start of a class definition
// in Javascript to the end curly brace has a scope of `meta.class`.
// The elements where this has higher specificity are things like braces
// (curly, square, round)
export const meta = {
  brace: {
    round: {
      /* () */ '*': { $value: '{color.font.primary}' },
    },
    square: {
      /* [] */ '*': { $value: '{color.font.primary}' },
    },
  },
  class: {
    '*': { $value: '{color.font.code.22}' },
  },
  jsx: {
    children: {
      '*': { $value: '{color.font.primary}' },
    },
  },
  object: {
    '*': { $value: '{color.font.code.29}' },
    member: {},
  },
  'property-name': {
    css: { $value: '{color.font.code.5}' },
  },
  'property-value': {
    css: { $value: '{color.font.code.5}' },
  },
  'property-list': {},
  selector: {
    '*': { $value: '{color.font.code.5}' },
  },
  structure: {
    dictionary: {
      '*': { $value: '{color.font.code.28}' },
    },
  },
  tag: {
    attributes: { $value: '{color.font.code.29}' },
  },
  type: {
    parameters: { $value: '{color.font.code.23}' },
  },
  var: {
    expr: {
      '*': { $value: '{color.font.code.8}' },
    },
  },
};
