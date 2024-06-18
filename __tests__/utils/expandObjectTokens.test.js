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
import {
  getTypeFromMap,
  expandToken,
  expandTokens,
} from '../../dist/esm/utils/expandObjectTokens.mjs';

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

const borderOutput = {
  color: {
    type: 'color',
    value: '#000',
  },
  style: {
    type: 'strokeStyle',
    value: 'solid',
  },
  width: {
    type: 'dimension',
    value: '2px',
  },
};

const typographyOutput = {
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
};

describe('utils', () => {
  describe('expandObjectTokens', () => {
    describe('expandObjectTokens', () => {
      describe('getTypeFromMap', () => {
        it('should return the type input as output by default', () => {
          const output = getTypeFromMap('width', 'foo', {});
          expect(output).to.equal('width');
        });

        it('should return mapped type, when overriding the base DTCG map', () => {
          const output = getTypeFromMap('width', 'border', {
            border: { width: 'foo' },
          });
          expect(output).to.equal('foo');
        });

        it('should return mapped type keyed by the composition type', () => {
          const output = getTypeFromMap('width', 'foo', {
            foo: { width: 'foo' },
          });
          expect(output).to.equal('foo');
        });

        it('should prioritise the mapped type keyed by composition type when also available on the top-level', () => {
          const output = getTypeFromMap('width', 'foo', {
            foo: { width: 'foo' },
            width: 'bar',
          });
          expect(output).to.equal('foo');
        });
      });

      describe('expandToken', () => {
        it('should expand a single object value token into multiple tokens', () => {
          const expanded = expandToken(input.border, { expand: true, usesDtcg: false });
          expect(expanded).to.eql(borderOutput);
        });

        it('should adjust the path properties of the newly expanded tokens if path prop is already present (platform expand)', () => {
          const expanded = expandToken(
            {
              type: 'border',
              value: {
                width: '2px',
                style: 'solid',
                color: '#000',
              },
              path: ['input', 'border'],
            },
            { expand: true, usesDtcg: false },
          );
          expect(expanded).to.eql({
            color: {
              type: 'color',
              value: '#000',
              path: ['input', 'border', 'color'],
            },
            style: {
              type: 'strokeStyle',
              value: 'solid',
              path: ['input', 'border', 'style'],
            },
            width: {
              type: 'dimension',
              value: '2px',
              path: ['input', 'border', 'width'],
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
            { expand: true, usesDtcg: true },
          );
          expect(expanded).to.eql({
            color: {
              $type: 'color',
              $value: '#000',
            },
            style: {
              $type: 'strokeStyle',
              $value: 'solid',
            },
            width: {
              $type: 'dimension',
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
              expand: true,
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
          const expanded = expandTokens(input, {
            expand: false,
            usesDtcg: false,
          });

          expect(expanded).to.eql(input);
        });

        it('should expand tokens when expand is set to true', () => {
          const expanded = expandTokens(
            {
              objectValues: {
                nested: input.border,
                double: {
                  nested: input.typography,
                },
              },
            },
            {
              expand: true,
              usesDtcg: false,
            },
          );

          expect(expanded).to.eql({
            objectValues: {
              nested: borderOutput,
              double: {
                nested: typographyOutput,
              },
            },
          });
        });

        it('should allow conditionally expanding tokens by type using include', () => {
          const expanded = expandTokens(input, {
            expand: {
              include: ['typography'],
            },
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: input.border,
            typography: typographyOutput,
          });
        });

        it('should allow conditionally expanding tokens by type using exclude', () => {
          const expanded = expandTokens(input, {
            expand: {
              exclude: ['typography'],
            },
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: borderOutput,
            typography: input.typography,
          });
        });

        it('should allow conditionally expanding tokens by condition function', () => {
          const expanded = expandTokens(input, {
            expand: (token) => token.value.fontWeight === '800',
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: input.border,
            typography: typographyOutput,
          });

          const expandedInclude = expandTokens(input, {
            expand: { include: (token) => token.value.fontWeight === '800' },
            usesDtcg: false,
          });

          expect(expandedInclude).to.eql({
            border: input.border,
            typography: typographyOutput,
          });

          const expandedExclude = expandTokens(input, {
            expand: { exclude: (token) => token.value.fontWeight === '800' },
            usesDtcg: false,
          });

          expect(expandedExclude).to.eql({
            border: borderOutput,
            typography: input.typography,
          });
        });

        it('should also expand tokens that are references to other tokens', () => {
          const refInput = {
            border: input.border,
            borderRef: {
              type: 'border',
              value: '{border}',
            },
          };
          const expanded = expandTokens(refInput, {
            expand: true,
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            border: borderOutput,
            borderRef: borderOutput,
          });
        });

        it('should expand nested composite tokens', () => {
          const refInput = {
            black: {
              value: '#000',
              type: 'color',
            },
            stroke: {
              value: {
                dashArray: ['0.5rem', '0.25rem'],
                lineCap: 'round',
              },
              type: 'strokeStyle',
            },
            border: {
              value: {
                color: '{black}',
                width: '3px',
                style: '{stroke}',
              },
              type: 'border',
            },
          };

          const expanded = expandTokens(refInput, {
            expand: true,
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            black: {
              value: '#000',
              type: 'color',
            },
            stroke: {
              dashArray: {
                value: ['0.5rem', '0.25rem'],
                type: 'dimension',
              },
              lineCap: {
                value: 'round',
                type: 'lineCap',
              },
            },
            border: {
              // color can remain unresolved ref because its resolved value is not an object
              color: { value: '{black}', type: 'color' },
              width: { value: '3px', type: 'dimension' },
              // style must be its resolved value because it is an object and potentially gets expanded,
              // breaking the original reference
              style: {
                dashArray: {
                  value: ['0.5rem', '0.25rem'],
                  type: 'dimension',
                },
                lineCap: {
                  value: 'round',
                  type: 'lineCap',
                },
              },
            },
          });
        });

        it('should expand shadow tokens', () => {
          const refInput = {
            shade: {
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
          };

          const expanded = expandTokens(refInput, {
            expand: true,
            usesDtcg: false,
          });

          expect(expanded).to.eql({
            shade: {
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
            usesDtcg: true,
          });

          expect(expanded).to.eql({
            border: {
              color: {
                $type: 'color',
                $value: '#000',
              },
              style: {
                $type: 'strokeStyle',
                $value: 'solid',
              },
              width: {
                $type: 'dimension',
                $value: '2px',
              },
            },
            borderRef: {
              color: {
                $type: 'color',
                $value: '#000',
              },
              style: {
                $type: 'strokeStyle',
                $value: 'solid',
              },
              width: {
                $type: 'dimension',
                $value: '2px',
              },
            },
          });
        });

        it('should throw an error when include and exclude are combined', () => {
          const badFn = () =>
            expandTokens(input, {
              expand: {
                include: ['typography'],
                exclude: ['border'],
              },
              usesDtcg: false,
            });

          expect(badFn).to.throw(
            'expand.include should not be combined with expand.exclude, use one or the other.',
          );
        });
      });
    });
  });
});
