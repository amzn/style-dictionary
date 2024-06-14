// These are names of functions, data structures, classes, etc., but not of
// variables which reference them. For example, `var foo = someFunction();`,
// `someFunction()` would be an entity. Entity also includes some HTML syntax
// like tags and tag attributes.

// The entity scopes are generally assigned to the names of data structures,
// types and other uniquely-identifiable constructs in code and markup. The
// notable exceptions are entity.name.tag and entity.other.attribute-name,
// which are used in HTML and XML tags.
export const entity = {
  name: {
    tag: {
      '*': { value: '{color.font.code.21.value}' },
      reference: { value: '{color.font.code.8.value}' },
      yaml: { value: '{color.font.code.22.value}' },
    },
    type: {
      module: { value: '{color.font.code.22.value}' },
    },
    function: {
      '*': { value: '{color.font.code.27.value}' },
    },
  },
  other: {
    'attribute-name': {
      id: { value: '{color.font.code.22.value}' },
      class: { value: '{color.font.code.23.value}' },
      '*': { value: '{color.font.code.27.value}' },
    },
  },
};
