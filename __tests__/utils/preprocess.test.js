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
import { typeDtcgDelegate, preprocess } from '../../lib/utils/preprocess.js';

describe('utils', () => {
  describe('preprocess', () => {
    it('should support multiple preprocessors', async () => {
      const output = await preprocess(
        {
          foo: {
            value: '5px',
          },
        },
        {
          preprocessorA: (tokens) => {
            tokens.bar = tokens.foo;
            return tokens;
          },
        },
      );
      expect(output).to.have.property('bar').eql({
        value: '5px',
      });
    });

    it('should support asynchronous preprocessors as well', async () => {
      const output = await preprocess(
        {
          foo: {
            value: '5px',
          },
        },
        {
          preprocessorA: (tokens) => {
            tokens.bar = tokens.foo;
            return tokens;
          },
          preprocessorB: async (tokens) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            tokens.baz = tokens.bar;
            return tokens;
          },
          preprocessorC: (tokens) => {
            tokens.qux = tokens.baz;
            return tokens;
          },
        },
      );
      expect(output).to.have.property('qux').eql({
        value: '5px',
      });
    });
  });

  describe('typeDtcgDelegate', () => {
    it('should correctly let tokens inherit the $type property while respecting local overrides', () => {
      const tokens = {
        dimension: {
          $type: 'dimension',
          scale: {
            $value: '2',
            $type: 'math',
          },
          xs: {
            $value: '4',
          },
          nested: {
            deep: {
              deeper: {
                $value: '12',
              },
            },
            deep2: {
              $type: 'math',
              deeper: {
                $type: 'other',
                evenDeeper: {
                  $value: '12',
                  $type: 'math',
                },
                evenDeeper2: {
                  $value: '12',
                },
              },
            },
          },
          sm: {
            $value: '8',
          },
        },
      };

      expect(typeDtcgDelegate(tokens)).to.eql({
        dimension: {
          $type: 'dimension',
          scale: {
            $value: '2',
            $type: 'math',
          },
          xs: {
            $value: '4',
            $type: 'dimension',
          },
          nested: {
            deep: {
              deeper: {
                $value: '12',
                $type: 'dimension',
              },
            },
            deep2: {
              $type: 'math',
              deeper: {
                $type: 'other',
                evenDeeper: {
                  $value: '12',
                  $type: 'math',
                },
                evenDeeper2: {
                  $value: '12',
                  $type: 'other',
                },
              },
            },
          },
          sm: {
            $value: '8',
            $type: 'dimension',
          },
        },
      });
    });
  });
});
