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
import { getTypeFromMap, expandToken, expandTokens } from '../../lib/utils/expandObjectTokens.js';

describe('utils', () => {
  describe('expandObjectTokens', () => {
    describe('expandObjectTokens', () => {
      describe('getTypeFromMap', () => {
        it('should return the type input as output by default', () => {
          const output = getTypeFromMap('width', 'border', {});
          expect(output).to.equal('width');
        });

        it('should return mapped type', () => {
          const output = getTypeFromMap('width', 'border', {
            width: 'foo',
          });
          expect(output).to.equal('foo');
        });

        it('should return mapped type keyed by the composition type', () => {
          const output = getTypeFromMap('width', 'border', {
            border: { width: 'foo' },
          });
          expect(output).to.equal('foo');
        });

        it('should prioritise the mapped type keyed by composition type when also available on the top-level', () => {
          const output = getTypeFromMap('width', 'border', {
            border: { width: 'foo' },
            width: 'bar',
          });
          expect(output).to.equal('foo');
        });
      });

      describe('expandToken', () => {
        it('should expand a single object value token into multiple tokens', () => {
          const expanded = expandToken(
            {
              type: 'border',
              value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
            { expandTypesMap: { style: 'other' }, usesDtcg: false },
          );
          expect(expanded).to.eql({
            color: {
              type: 'color',
              value: '#000',
            },
            style: {
              type: 'other',
              value: 'solid',
            },
            width: {
              type: 'width',
              value: '2px',
            },
          });
        });

        it('should handle DTCG spec tokens expansion', () => {
          const expanded = expandToken(
            {
              $type: 'border',
              $value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
            { expandTypesMap: { style: 'other' }, usesDtcg: true },
          );
          expect(expanded).to.eql({
            color: {
              $type: 'color',
              $value: '#000',
            },
            style: {
              $type: 'other',
              $value: 'solid',
            },
            width: {
              $type: 'width',
              $value: '2px',
            },
          });
        });

        it('should handle the expansion of array of objects values', () => {
          const expanded = expandToken(
            {
              type: 'shadow',
              value: [
                {
                  offsetX: '2px',
                  offsetY: '4px',
                  blur: '2px',
                  spread: '0',
                  color: '#000',
                },
                {
                  offsetX: '10px',
                  offsetY: '12px',
                  blur: '4px',
                  spread: '3px',
                  color: '#ccc',
                },
              ],
            },
            {
              expandTypesMap: {
                offsetX: 'dimension',
                offsetY: 'dimension',
                blur: 'dimension',
                spread: 'dimension',
              },
              usesDtcg: false,
            },
          );

          expect(expanded).to.eql({
            1: {
              offsetX: {
                type: 'dimension',
                value: '2px',
              },
              offsetY: {
                type: 'dimension',
                value: '4px',
              },
              blur: {
                type: 'dimension',
                value: '2px',
              },
              spread: {
                type: 'dimension',
                value: '0',
              },
              color: {
                type: 'color',
                value: '#000',
              },
            },
            2: {
              offsetX: {
                type: 'dimension',
                value: '10px',
              },
              offsetY: {
                type: 'dimension',
                value: '12px',
              },
              blur: {
                type: 'dimension',
                value: '4px',
              },
              spread: {
                type: 'dimension',
                value: '3px',
              },
              color: {
                type: 'color',
                value: '#ccc',
              },
            },
          });
        });
      });

      describe('expandTokens', () => {
        it('should not expand tokens when expand is false', () => {
          const input = {
            objectValues: {
              type: 'border',
              value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
          };
          const expanded = expandTokens(input, {
            expand: false,
            expandTypesMap: { style: 'other' },
            usesDtcg: false,
          });

          expect(expanded).to.eql(input);
        });

        it('should expand tokens when expand is set to true', () => {
          const expanded = expandTokens(
            {
              objectValues: {
                nested: {
                  type: 'border',
                  value: {
                    width: '2px',
                    style: 'solid',
                    color: '#000',
                  },
                },
                double: {
                  nested: {
                    type: 'typography',
                    value: {
                      fontWeight: '800',
                      fontSize: '16px',
                      fontFamily: 'Arial Black',
                    },
                  },
                },
              },
            },
            {
              expand: true,
              expandTypesMap: { style: 'other', fontSize: 'dimension' },
              usesDtcg: false,
            },
          );

          expect(expanded).to.eql({
            objectValues: {
              nested: {
                color: {
                  type: 'color',
                  value: '#000',
                },
                style: {
                  type: 'other',
                  value: 'solid',
                },
                width: {
                  type: 'width',
                  value: '2px',
                },
              },
              double: {
                nested: {
                  fontWeight: {
                    type: 'fontWeight',
                    value: '800',
                  },
                  fontSize: {
                    type: 'dimension',
                    value: '16px',
                  },
                  fontFamily: {
                    type: 'fontFamily',
                    value: 'Arial Black',
                  },
                },
              },
            },
          });
        });

        it('should allow conditionally expanding tokens by type', () => {
          const input = {
            border: {
              type: 'border',
              value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
            typography: {
              type: 'typography',
              value: {
                fontWeight: '800',
                fontSize: '16px',
                fontFamily: 'Arial Black',
              },
            },
          };
          const expanded = expandTokens(input, {
            expand: { typography: true, border: false },
            expandTypesMap: { fontSize: 'dimension' },
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: input.border,
            typography: {
              fontWeight: {
                type: 'fontWeight',
                value: '800',
              },
              fontSize: {
                type: 'dimension',
                value: '16px',
              },
              fontFamily: {
                type: 'fontFamily',
                value: 'Arial Black',
              },
            },
          });
        });

        it('should allow conditionally expanding tokens by condition function', () => {
          const input = {
            border: {
              type: 'border',
              value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
            typography: {
              type: 'typography',
              value: {
                fontWeight: '800',
                fontSize: '16px',
                fontFamily: 'Arial Black',
              },
            },
          };
          const expanded = expandTokens(input, {
            expand: (token) => token.value.fontWeight === '800',
            expandTypesMap: { fontSize: 'dimension' },
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: input.border,
            typography: {
              fontWeight: {
                type: 'fontWeight',
                value: '800',
              },
              fontSize: {
                type: 'dimension',
                value: '16px',
              },
              fontFamily: {
                type: 'fontFamily',
                value: 'Arial Black',
              },
            },
          });
        });

        it('should also expand tokens that are references to other tokens', () => {
          const input = {
            border: {
              type: 'border',
              value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
            borderRef: {
              type: 'border',
              value: '{border}',
            },
          };
          const expanded = expandTokens(input, {
            expand: true,
            expandTypesMap: { style: 'other' },
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: {
              color: {
                type: 'color',
                value: '#000',
              },
              style: {
                type: 'other',
                value: 'solid',
              },
              width: {
                type: 'width',
                value: '2px',
              },
            },
            borderRef: {
              color: {
                type: 'color',
                value: '#000',
              },
              style: {
                type: 'other',
                value: 'solid',
              },
              width: {
                type: 'width',
                value: '2px',
              },
            },
          });
        });

        it('should support DTCG format', () => {
          const input = {
            border: {
              $type: 'border',
              $value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
            },
            borderRef: {
              $type: 'border',
              $value: '{border}',
            },
          };
          const expanded = expandTokens(input, {
            expand: true,
            expandTypesMap: { style: 'other' },
            usesDtcg: true,
          });

          expect(expanded).to.eql({
            border: {
              color: {
                $type: 'color',
                $value: '#000',
              },
              style: {
                $type: 'other',
                $value: 'solid',
              },
              width: {
                $type: 'width',
                $value: '2px',
              },
            },
            borderRef: {
              color: {
                $type: 'color',
                $value: '#000',
              },
              style: {
                $type: 'other',
                $value: 'solid',
              },
              width: {
                $type: 'width',
                $value: '2px',
              },
            },
          });
        });
      });
    });
  });
});
