/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
const createPropertyFormatter = require('../../../lib/common/formatHelpers/createPropertyFormatter');
const createDictionary = require('../../../lib/utils/createDictionary');

const dictionary = createDictionary({
  properties: {
    tokens: {
      foo: {
        original: {
          value: '5px',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'foo'
        },
        name: 'tokens-foo',
        path: ['tokens', 'foo'],
        value: '5px',
        type: 'spacing'
      },
      ref: {
        original: {
          value: '{tokens.foo}',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'ref'
        },
        name: 'tokens-ref',
        path: ['tokens', 'ref'],
        value: '5px',
        type: 'spacing'
      }
    }
  }
});

const transformedDictionary = createDictionary({
  properties: {
    tokens: {
      foo: {
        original: {
          value: '5px',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'foo'
        },
        name: 'tokens-foo',
        path: ['tokens', 'foo'],
        value: '5px',
        type: 'spacing'
      },
      ref: {
        original: {
          value: '{tokens.foo}',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'ref'
        },
        name: 'tokens-ref',
        path: ['tokens', 'ref'],
        value: 'changed by transitive transform',
        type: 'spacing'
      },
    }
  }
});

const numberDictionary = createDictionary({
  properties: {
    tokens: {
      foo: {
        original: {
          value: 10,
          type: 'dimension'
        },
        attributes: {
          category: 'tokens',
          type: 'foo'
        },
        name: 'tokens-foo',
        path: ['tokens', 'foo'],
        value: 10,
        type: 'dimension'
      },
      ref: {
        original: {
          value: '{tokens.foo}',
          type: 'dimension'
        },
        attributes: {
          category: 'tokens',
          type: 'ref'
        },
        name: 'tokens-ref',
        path: ['tokens', 'ref'],
        value: 10,
        type: 'dimension'
      },
      zero: {
        original: {
          value: 0,
          type: 'dimension',
        },
        attributes: {
          category: 'tokens',
          type: 'zero',
        },
        name: 'tokens-zero',
        path: ['tokens', 'zero'],
        value: 0,
        type: 'dimension',
      },
      'ref-zero': {
        original: {
          value: '{tokens.zero}',
          type: 'dimension',
        },
        attributes: {
          category: 'tokens',
          type: 'ref-zero',
        },
        name: 'tokens-ref-zero',
        path: ['tokens', 'ref-zero'],
        value: 0,
        type: 'dimension',
      },
    }
  }
})

const multiDictionary = createDictionary({
  properties: {
    tokens: {
      foo: {
        original: {
          value: '10px',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'foo'
        },
        name: 'tokens-foo',
        path: ['tokens', 'foo'],
        value: '10px',
        type: 'spacing'
      },
      bar: {
        original: {
          value: '15px',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'bar'
        },
        name: 'tokens-bar',
        path: ['tokens', 'bar'],
        value: '15px',
        type: 'spacing'
      },
      ref: {
        original: {
          value: '{tokens.foo} 5px {tokens.bar}',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'ref'
        },
        name: 'tokens-ref',
        path: ['tokens', 'ref'],
        value: '10px 5px 15px',
        type: 'spacing'
      },
    }
  }
})

const objectDictionary = createDictionary({
  properties: {
    tokens: {
      foo: {
        original: {
          value: '5px',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'foo'
        },
        name: 'tokens-foo',
        path: ['tokens', 'foo'],
        value: '5px',
        type: 'spacing'
      },
      ref: {
        original: {
          value: {
            width: '{tokens.foo}',
            style: 'dashed',
            color: '#FF00FF'
          },
          type: 'border'
        },
        attributes: {
          category: 'tokens',
          type: 'ref'
        },
        name: 'tokens-ref',
        path: ['tokens', 'ref'],
        value: '5px dashed #FF00FF',
        type: 'border'
      }
    }
  }
});


describe('common', () => {
  describe('formatHelpers', () => {
    describe('createPropertyFormatter', () => {
      describe('outputReferences', () => {
        it('should support outputReferences', () => {
          const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary, format: 'css' })
          expect(propFormatter(dictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 5px;');
          expect(propFormatter(dictionary.tokens.tokens.ref)).toEqual('  --tokens-ref: var(--tokens-foo);');
        })

        it('should support outputReferences when values are transformed by (transitive) "value" transforms', () => {
          const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary: transformedDictionary, format: 'css' })
          expect(propFormatter(transformedDictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 5px;');
          expect(propFormatter(transformedDictionary.tokens.tokens.ref)).toEqual('  --tokens-ref: var(--tokens-foo);');
        })

        it('should support number values for outputReferences', () => {
          const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary: numberDictionary, format: 'css' })
          expect(propFormatter(numberDictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 10;');
          expect(propFormatter(numberDictionary.tokens.tokens.ref)).toEqual('  --tokens-ref: var(--tokens-foo);');
        })

        it('should support valid falsy values for outputReferences', () => {
          const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary: numberDictionary, format: 'css' })
          expect(propFormatter(numberDictionary.tokens.tokens.zero)).toEqual('  --tokens-zero: 0;');
          expect(propFormatter(numberDictionary.tokens.tokens['ref-zero'])).toEqual('  --tokens-ref-zero: var(--tokens-zero);');
        })

        it('should support multiple references for outputReferences', () => {
          const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary: multiDictionary, format: 'css' })
          expect(propFormatter(multiDictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 10px;');
          expect(propFormatter(multiDictionary.tokens.tokens.bar)).toEqual('  --tokens-bar: 15px;');
          expect(propFormatter(multiDictionary.tokens.tokens.ref)).toEqual('  --tokens-ref: var(--tokens-foo) 5px var(--tokens-bar);');
        })

        it('should support object value references for outputReferences', () => {
          // The ref is an object type value, which means there will usually be some kind of transform (e.g. a CSS shorthand transform)
          // to change it from an object to a string. In our example, we use a border CSS shorthand for border token.
          // In this case, since it is an object value, we will run the transformation on the transformed (string) value.
          const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary: objectDictionary, format: 'css' })
          expect(propFormatter(objectDictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 5px;');
          expect(propFormatter(objectDictionary.tokens.tokens.ref)).toEqual('  --tokens-ref: var(--tokens-foo) dashed #FF00FF;');
        })
      });

      describe('commentStyle', () => {
        const commentProperties = {
          color: {
            red: {
              name: 'color-red',
              value: '#FF0000',
              comment: 'Foo bar qux',
              attributes: {
                category: 'color',
                type: 'red',
              },
              path: ['color', 'red'],
            },
            blue: {
              name: 'color-blue',
              value: '#0000FF',
              comment: 'Foo\nbar\nqux',
              attributes: {
                category: 'color',
                type: 'blue',
              },
              path: ['color', 'blue'],
            },
            green: {
              name: 'color-green',
              value: '#00FF00',
              comment: 'Foo bar qux',
              attributes: {
                category: 'color',
                type: 'green',
              },
              path: ['color', 'green'],
            },
          },
        };

        const commentDictionary = createDictionary({
          properties: commentProperties,
        });

        it('should default to putting comment next to the output value', () => {
          // long commentStyle
          const cssFormatter = createPropertyFormatter({
            format: 'css',
            commentDictionary,
          });
          // short commentStyle
          const sassFormatter = createPropertyFormatter({
            format: 'sass',
            commentDictionary,
          });

          // red = single-line comment, blue = multi-line comment
          const cssRed = cssFormatter(commentDictionary.tokens.color.red);
          const cssBlue = cssFormatter(commentDictionary.tokens.color.blue);
          const sassRed = sassFormatter(commentDictionary.tokens.color.red);
          const sassBlue = sassFormatter(commentDictionary.tokens.color.blue);

          // Note that since CSS puts it inside a selector, there is an indentation of 2 spaces as well
          // CSS also has commentStyle long, whereas sass uses short
          expect(cssRed).toMatchInlineSnapshot(
            `"  --color-red: #FF0000; /* Foo bar qux */"`
          );

          expect(cssBlue).toMatchInlineSnapshot(`
"  /**
   * Foo
   * bar
   * qux
   */
  --color-blue: #0000FF;"
`);

          expect(sassRed).toMatchInlineSnapshot(
            `"$color-red: #FF0000; // Foo bar qux"`
          );
          expect(sassBlue).toMatchInlineSnapshot(`
"// Foo
// bar
// qux
$color-blue: #0000FF;"
`);
        });

        it('allows overriding formatting commentStyle', () => {
          // long commentStyle
          const cssFormatter = createPropertyFormatter({
            format: 'css',
            commentDictionary,
            formatting: { commentStyle: 'long', commentPosition: 'above' },
          });
          // short commentStyle
          const sassFormatter = createPropertyFormatter({
            format: 'sass',
            commentDictionary,
            formatting: { commentStyle: 'short', commentPosition: 'above' },
          });

          const cssRed = cssFormatter(commentDictionary.tokens.color.green);
          const sassRed = sassFormatter(commentDictionary.tokens.color.green);

          expect(cssRed).toMatchInlineSnapshot(`
"  /* Foo bar qux */
  --color-green: #00FF00;"
`);

          expect(sassRed).toMatchInlineSnapshot(`
"// Foo bar qux
$color-green: #00FF00;"
`);
        });
      });
    })
  })
})
