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
import { typeDtcgDelegate } from '../../lib/utils/preprocess.js';

describe('utils', () => {
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
