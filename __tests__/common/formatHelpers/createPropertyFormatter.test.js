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
import { expect } from 'chai';
import createPropertyFormatter from '../../../lib/common/formatHelpers/createPropertyFormatter.js';
import createDictionary from '../../../lib/utils/createDictionary.js';

const dictionary = createDictionary({
  tokens: {
    foo: {
      original: {
        value: '5px',
        type: 'spacing',
      },
      attributes: {
        category: 'foo',
      },
      name: 'foo',
      path: ['foo'],
      value: '5px',
      type: 'spacing',
    },
    ref: {
      original: {
        value: '{foo}',
        type: 'spacing',
      },
      attributes: {
        category: 'ref',
      },
      name: 'ref',
      path: ['ref'],
      value: '5px',
      type: 'spacing',
    },
  },
});

const transformedDictionary = createDictionary({
  tokens: {
    foo: {
      original: {
        value: '5px',
        type: 'spacing',
      },
      attributes: {
        category: 'foo',
      },
      name: 'foo',
      path: ['foo'],
      value: '5px',
      type: 'spacing',
    },
    ref: {
      original: {
        value: '{foo}',
        type: 'spacing',
      },
      attributes: {
        category: 'ref',
      },
      name: 'ref',
      path: ['ref'],
      value: 'changed by transitive transform',
      type: 'spacing',
    },
  },
});

const numberDictionary = createDictionary({
  tokens: {
    foo: {
      original: {
        value: 10,
        type: 'dimension',
      },
      attributes: {
        category: 'foo',
      },
      name: 'foo',
      path: ['foo'],
      value: 10,
      type: 'dimension',
    },
    ref: {
      original: {
        value: '{foo}',
        type: 'dimension',
      },
      attributes: {
        category: 'ref',
      },
      name: 'ref',
      path: ['ref'],
      value: 10,
      type: 'dimension',
    },
    zero: {
      original: {
        value: 0,
        type: 'dimension',
      },
      attributes: {
        category: 'zero',
      },
      name: 'zero',
      path: ['zero'],
      value: 0,
      type: 'dimension',
    },
    'ref-zero': {
      original: {
        value: '{zero}',
        type: 'dimension',
      },
      attributes: {
        category: 'ref-zero',
      },
      name: 'ref-zero',
      path: ['ref-zero'],
      value: 0,
      type: 'dimension',
    },
  },
});

const multiDictionary = createDictionary({
  tokens: {
    foo: {
      original: {
        value: '10px',
        type: 'spacing',
      },
      attributes: {
        category: 'foo',
      },
      name: 'foo',
      path: ['foo'],
      value: '10px',
      type: 'spacing',
    },
    bar: {
      original: {
        value: '15px',
        type: 'spacing',
      },
      attributes: {
        category: 'bar',
      },
      name: 'bar',
      path: ['bar'],
      value: '15px',
      type: 'spacing',
    },
    ref: {
      original: {
        value: '{foo} 5px {bar}',
        type: 'spacing',
      },
      attributes: {
        category: 'ref',
      },
      name: 'ref',
      path: ['ref'],
      value: '10px 5px 15px',
      type: 'spacing',
    },
  },
});

const objectDictionary = createDictionary({
  tokens: {
    foo: {
      original: {
        value: '5px',
        type: 'spacing',
      },
      attributes: {
        category: 'foo',
      },
      name: 'foo',
      path: ['foo'],
      value: '5px',
      type: 'spacing',
    },
    ref: {
      original: {
        value: {
          width: '{foo}',
          style: 'dashed',
          color: '#FF00FF',
        },
        type: 'border',
      },
      attributes: {
        category: 'ref',
      },
      name: 'ref',
      path: ['ref'],
      value: '5px dashed #FF00FF',
      type: 'border',
    },
  },
});

describe('common', () => {
  describe('formatHelpers', () => {
    describe('createPropertyFormatter', () => {
      describe('outputReferences', () => {
        it('should support outputReferences', () => {
          const propFormatter = createPropertyFormatter({
            outputReferences: true,
            dictionary,
            format: 'css',
          });
          // expect(propFormatter(dictionary.tokens.foo)).to.equal('  --foo: 5px;');
          expect(propFormatter(dictionary.tokens.ref)).to.equal('  --ref: var(--foo);');
        });

        it('should support outputReferences when values are transformed by (transitive) "value" transforms', () => {
          const propFormatter = createPropertyFormatter({
            outputReferences: true,
            dictionary: transformedDictionary,
            format: 'css',
          });
          expect(propFormatter(transformedDictionary.tokens.foo)).to.equal('  --foo: 5px;');
          expect(propFormatter(transformedDictionary.tokens.ref)).to.equal('  --ref: var(--foo);');
        });

        it('should support number values for outputReferences', () => {
          const propFormatter = createPropertyFormatter({
            outputReferences: true,
            dictionary: numberDictionary,
            format: 'css',
          });
          expect(propFormatter(numberDictionary.tokens.foo)).to.equal('  --foo: 10;');
          expect(propFormatter(numberDictionary.tokens.ref)).to.equal('  --ref: var(--foo);');
        });

        it('should support valid falsy values for outputReferences', () => {
          const propFormatter = createPropertyFormatter({
            outputReferences: true,
            dictionary: numberDictionary,
            format: 'css',
          });
          expect(propFormatter(numberDictionary.tokens.zero)).to.equal('  --zero: 0;');
          expect(propFormatter(numberDictionary.tokens['ref-zero'])).to.equal(
            '  --ref-zero: var(--zero);',
          );
        });

        it('should support multiple references for outputReferences', () => {
          const propFormatter = createPropertyFormatter({
            outputReferences: true,
            dictionary: multiDictionary,
            format: 'css',
          });
          expect(propFormatter(multiDictionary.tokens.foo)).to.equal('  --foo: 10px;');
          expect(propFormatter(multiDictionary.tokens.bar)).to.equal('  --bar: 15px;');
          expect(propFormatter(multiDictionary.tokens.ref)).to.equal(
            '  --ref: var(--foo) 5px var(--bar);',
          );
        });

        it('should support object value references for outputReferences', () => {
          // The ref is an object type value, which means there will usually be some kind of transform (e.g. a CSS shorthand transform)
          // to change it from an object to a string. In our example, we use a border CSS shorthand for border token.
          // In this case, since it is an object value, we will run the transformation on the transformed (string) value.
          const propFormatter = createPropertyFormatter({
            outputReferences: true,
            dictionary: objectDictionary,
            format: 'css',
          });
          // expect(propFormatter(objectDictionary.tokens.foo)).to.equal('  --foo: 5px;');

          expect(propFormatter(objectDictionary.tokens.ref)).to.equal(
            '  --ref: var(--foo) dashed #FF00FF;',
          );
        });
      });

      describe('commentStyle', () => {
        const commentTokens = {
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
          tokens: commentTokens,
        });

        it('should default to putting comment next to the output value', async () => {
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

          await expect(cssRed).to.matchSnapshot(1);
          await expect(cssBlue).to.matchSnapshot(2);

          await expect(sassRed).to.matchSnapshot(3);
          await expect(sassBlue).to.matchSnapshot(4);
        });

        it('allows overriding formatting commentStyle', async () => {
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

          await expect(cssRed).to.matchSnapshot(1);

          await expect(sassRed).to.matchSnapshot(2);
        });
      });
    });
  });
});
