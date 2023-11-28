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
import StyleDictionary from 'style-dictionary';

describe('register/transformGroup', async () => {
  let StyleDictionaryExtended;
  beforeEach(async () => {
    StyleDictionary.preprocessors = {};
    StyleDictionaryExtended = new StyleDictionary({});
    await StyleDictionaryExtended.hasInitialized;
  });

  it('should support registering preprocessor on StyleDictionary class', () => {
    StyleDictionary.registerPreprocessor({
      name: 'example-preprocessor',
      preprocessor: (dict) => dict,
    });
    expect(StyleDictionary.preprocessors['example-preprocessor']).to.not.be.undefined;
    expect(StyleDictionaryExtended.preprocessors['example-preprocessor']).to.not.be.undefined;
  });

  it('should support registering preprocessor on StyleDictionary instance, which registers it on the class', () => {
    StyleDictionaryExtended.registerPreprocessor({
      name: 'example-preprocessor',
      preprocessor: (dict) => dict,
    });
    expect(StyleDictionary.preprocessors['example-preprocessor']).to.not.be.undefined;
    expect(StyleDictionaryExtended.preprocessors['example-preprocessor']).to.not.be.undefined;
  });

  it('should throw if the preprocessor name is not a string', () => {
    expect(() => {
      StyleDictionaryExtended.registerPreprocessor({
        name: true,
        preprocessor: (dict) => dict,
      });
    }).to.throw('Cannot register preprocessor; Preprocessor.name must be a string');
  });

  it('should throw if the preprocessor is not a function', () => {
    expect(() => {
      StyleDictionaryExtended.registerPreprocessor({
        name: 'example-preprocessor',
        preprocessor: 'foo',
      });
    }).to.throw('Cannot register preprocessor; Preprocessor.preprocessor must be a function');
  });

  it('should preprocess the dictionary as specified', async () => {
    StyleDictionary.registerPreprocessor({
      name: 'strip-descriptions',
      preprocessor: (dict) => {
        // recursively traverse token objects and delete description props
        function removeDescription(slice) {
          delete slice.description;
          Object.values(slice).forEach((value) => {
            if (typeof value === 'object') {
              removeDescription(value);
            }
          });
          return slice;
        }
        return removeDescription(dict);
      },
    });

    StyleDictionaryExtended = new StyleDictionary({
      tokens: {
        foo: {
          value: '4px',
          type: 'dimension',
          description: 'Foo description',
        },
        description: 'My dictionary',
      },
    });
    await StyleDictionaryExtended.hasInitialized;
    expect(StyleDictionaryExtended.tokens).to.eql({
      foo: {
        value: '4px',
        type: 'dimension',
      },
    });
  });

  it('should support async preprocessors', async () => {
    StyleDictionary.registerPreprocessor({
      name: 'strip-descriptions',
      preprocessor: async (dict) => {
        // recursively traverse token objects and delete description props
        async function removeDescription(slice) {
          // Arbitrary delay, act as though this action is asynchronous and takes some time
          await new Promise((resolve) => setTimeout(resolve, 100));
          delete slice.description;

          await Promise.all(
            Object.values(slice).map((value) => {
              if (typeof value === 'object') {
                return removeDescription(value);
              } else {
                return Promise.resolve();
              }
            }),
          );
          return slice;
        }
        return removeDescription(dict);
      },
    });

    StyleDictionaryExtended = new StyleDictionary({
      tokens: {
        foo: {
          value: '4px',
          type: 'dimension',
          description: 'Foo description',
        },
        description: 'My dictionary',
      },
    });
    await StyleDictionaryExtended.hasInitialized;
    expect(StyleDictionaryExtended.tokens).to.eql({
      foo: {
        value: '4px',
        type: 'dimension',
      },
    });
  });
});
