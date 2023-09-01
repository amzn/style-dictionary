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
      bar: {
        original: {
          value: '{tokens.foo}',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'bar'
        },
        name: 'tokens-bar',
        path: ['tokens', 'bar'],
        value: '5px',
        type: 'spacing'
      },
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
      bar: {
        original: {
          value: '{tokens.foo}',
          type: 'spacing'
        },
        attributes: {
          category: 'tokens',
          type: 'bar'
        },
        name: 'tokens-bar',
        path: ['tokens', 'bar'],
        value: 'changed by transitive transform',
        type: 'spacing'
      },
    }
  }
});




describe('common', () => {
  describe('formatHelpers', () => {
    describe('createPropertyFormatter', () => {
      it('should support outputReferences', () => {
        const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary, format: 'css' })
        expect(propFormatter(dictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 5px;');
        expect(propFormatter(dictionary.tokens.tokens.bar)).toEqual('  --tokens-bar: var(--tokens-foo);');
      })

      it('should support outputReferences when values are transformed by (transitive) "value" transforms', () => {
        const propFormatter = createPropertyFormatter({ outputReferences: true, dictionary, format: 'css' })
        expect(propFormatter(transformedDictionary.tokens.tokens.foo)).toEqual('  --tokens-foo: 5px;');
        expect(propFormatter(transformedDictionary.tokens.tokens.bar)).toEqual('  --tokens-bar: var(--tokens-foo);');
      })
    })
  })
})