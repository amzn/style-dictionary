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
  resolveRefs,
  resolveRefValueWrapper,
  _resolveReferences,
} from '../../../lib/utils/references/resolveRefsNew.js';
import { convertTokenData } from '../../../lib/utils/convertTokenData.js';

describe('resolveRefs()', () => {
  describe('_resolveReferences', () => {
    it(`resolves simple references`, () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{foo}',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      expect(_resolveReferences('{foo}', tokenMap, { usesDtcg: true, token: tokens.foo })).to.eql({
        resolved: '16px',
        errors: [],
      });

      expect(_resolveReferences('{bar}', tokenMap, { usesDtcg: true, token: tokens.bar })).to.eql({
        resolved: '16px',
        errors: [],
      });
    });

    it(`returns reference errors for broken references while still resolving the rest`, () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{ay} {foo} {qux}',
          filePath: '/path/to/set.json',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      expect(
        _resolveReferences('{bar}', tokenMap, { usesDtcg: true, token: { $value: '{bar}' } }),
      ).to.eql({
        resolved: '{ay} 16px {qux}',
        errors: [
          {
            ref: '{ay}',
            token: {
              $value: '{ay} {foo} {qux}',
              filePath: '/path/to/set.json',
              key: '{bar}',
            },
            type: 'not-found',
          },
          {
            ref: '{qux}',
            token: {
              $value: '{ay} {foo} {qux}',
              filePath: '/path/to/set.json',
              key: '{bar}',
            },
            type: 'not-found',
          },
        ],
      });
    });

    it(`returns circular reference errors, while still resolving the rest`, () => {
      const tokens = {
        circ1: {
          $value: '{circ2}',
        },
        circ2: {
          $value: '{circ3}',
        },
        circ3: {
          $value: '{circ1}',
        },
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{circ1} {foo} {qux}',
          filePath: '/path/to/set.json', // some metadata, confirm that's in the errors object
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      expect(
        _resolveReferences('{bar}', tokenMap, { usesDtcg: true, token: { $value: '{bar}' } }),
      ).to.eql({
        resolved: '{circ1} 16px {qux}',
        errors: [
          {
            ref: '{circ1}',
            chain: ['{circ1}', '{circ2}', '{circ3}', '{circ1}'],
            token: {
              $value: '{circ1} {foo} {qux}',
              filePath: '/path/to/set.json',
              key: '{bar}',
            },
            type: 'circular',
          },
          {
            ref: '{qux}',
            token: {
              $value: '{circ1} {foo} {qux}',
              filePath: '/path/to/set.json',
              key: '{bar}',
            },
            type: 'not-found',
          },
        ],
      });
    });

    it(`returns self reference errors`, () => {
      const tokens = {
        circ1: {
          $value: '{circ1}',
        },
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{circ1} {foo} {qux}',
          filePath: '/path/to/set.json', // some metadata, confirm that's in the errors object
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      expect(_resolveReferences('{bar}', tokenMap, { usesDtcg: true, token: tokens.bar })).to.eql({
        resolved: '{circ1} 16px {qux}',
        errors: [
          {
            ref: '{circ1}',
            chain: ['{circ1}', '{circ1}'],
            token: {
              $value: '{circ1} {foo} {qux}',
              filePath: '/path/to/set.json',
            },
            type: 'circular',
          },
          {
            ref: '{qux}',
            token: {
              $value: '{circ1} {foo} {qux}',
              filePath: '/path/to/set.json',
              key: '{bar}',
            },
            type: 'not-found',
          },
        ],
      });
    });

    it(`supports references with spaces that need trimming`, () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{ foo }',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      expect(_resolveReferences('{bar}', tokenMap, { usesDtcg: true, token: tokens.bar })).to.eql({
        resolved: '16px',
        errors: [],
      });
    });

    it(`maintains types for primitives in values that are exclusively refs`, () => {
      const tokens = {
        foo: {
          $value: 16,
        },
        bar: {
          $value: '{foo}',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      expect(_resolveReferences('{bar}', tokenMap, { usesDtcg: true, token: tokens.bar })).to.eql({
        resolved: 16,
        errors: [],
      });
    });
  });

  describe('resolveRefValueWrapper', () => {
    it('resolves design token references', () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: {
            nested: '{foo}',
          },
          prop: 'some {foo}',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      const token = resolveRefValueWrapper(tokens.bar, tokenMap, { usesDtcg: true });
      expect(token).to.eql({
        resolved: {
          $value: {
            nested: '16px',
          },
          prop: 'some 16px',
        },
        errors: [],
      });
    });

    it('returns a rich error object for broken/circular refs, with token partially resolved', () => {
      const tokens = {
        circ1: {
          $value: '{circ2}',
        },
        circ2: {
          $value: '{circ3}',
        },
        circ3: {
          $value: '{circ1}',
        },
        foo: {
          $value: '16px',
        },
        bar: {
          $value: {
            nested: '{foo} {circ1} {qux}',
          },
          prop: 'some {foo}',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      const token = resolveRefValueWrapper(tokens.bar, tokenMap, { usesDtcg: true });
      expect(token).to.eql({
        resolved: {
          $value: {
            nested: '16px {circ1} {qux}',
          },
          prop: 'some 16px',
        },
        errors: [
          {
            ref: '{circ1}',
            chain: ['{circ1}', '{circ2}', '{circ3}', '{circ1}'],
            token: {
              $value: {
                nested: '16px {circ1} {qux}',
              },
              prop: 'some 16px',
            },
            type: 'circular',
          },
          {
            ref: '{qux}',
            token: {
              $value: {
                nested: '16px {circ1} {qux}',
              },
              prop: 'some 16px',
            },
            type: 'not-found',
          },
        ],
      });
    });

    it('does not resolve references in objectsOnly mode when the value is not exclusively a ref, since the value cannot then resolve to an object', () => {
      const tokens = {
        object: {
          $value: { fontSize: '16px' },
        },
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{foo} x',
        },
        baz: {
          $value: '{foo}',
        },
        qux: {
          $value: '{object}',
        },
      };
      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });

      // not exclusively a ref, so resolved can never be an object, keep ref
      const tokenBar = resolveRefValueWrapper(tokens.bar, tokenMap, {
        usesDtcg: true,
        objectsOnly: true,
      });
      expect(tokenBar).to.eql({
        resolved: {
          $value: '{foo} x',
        },
        errors: [],
      });

      // referenced value is not an object so keep ref
      const tokenBaz = resolveRefValueWrapper(tokens.baz, tokenMap, {
        usesDtcg: true,
        objectsOnly: true,
      });
      expect(tokenBaz).to.eql({
        resolved: {
          $value: '{foo}',
        },
        errors: [],
      });

      // exclusively a ref, and resolved is an object, resolve :)!
      const tokenQux = resolveRefValueWrapper(tokens.qux, tokenMap, {
        usesDtcg: true,
        objectsOnly: true,
      });
      expect(tokenQux).to.eql({
        resolved: {
          $value: { fontSize: '16px' },
        },
        errors: [],
      });
    });
  });

  describe('resolveRefs utility', () => {
    it('allows resolving a single token', () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{foo}',
        },
      };

      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });
      expect(resolveRefs(tokenMap, { usesDtcg: true, tokenValue: '{bar}' })).to.eql({
        resolved: '16px',
        errors: [],
      });
    });

    it('allows resolving a whole Map', () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{foo}',
        },
      };

      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });
      expect(resolveRefs(tokenMap, { usesDtcg: true })).to.eql({
        resolved: new Map([
          ['{foo}', { $value: '16px', key: '{foo}' }],
          ['{bar}', { $value: '16px', key: '{bar}' }],
        ]),
        errors: [],
      });
    });

    it('allows setting keys to ignore for ref resolution', () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{foo}',
          description: '{foo}',
        },
      };

      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });
      expect(
        resolveRefs(tokenMap, { usesDtcg: true, ignoreKeys: new Set(['description']) }),
      ).to.eql({
        resolved: new Map([
          ['{foo}', { $value: '16px', key: '{foo}' }],
          ['{bar}', { $value: '16px', description: '{foo}', key: '{bar}' }],
        ]),
        errors: [],
      });
    });

    it('allows resolving a whole Map, using old format', () => {
      const tokens = {
        foo: {
          value: '16px',
        },
        bar: {
          value: '{foo}',
        },
      };

      const tokenMap = convertTokenData(tokens, { output: 'map' });
      expect(resolveRefs(tokenMap)).to.eql({
        resolved: new Map([
          ['{foo}', { value: '16px', key: '{foo}' }],
          ['{bar}', { value: '16px', key: '{bar}' }],
        ]),
        errors: [],
      });
    });

    it('allows resolving a single token, using old format', () => {
      const tokens = {
        foo: {
          value: '16px',
        },
        bar: {
          value: '{foo}',
        },
      };

      const tokenMap = convertTokenData(tokens, { output: 'map' });

      expect(resolveRefs(tokenMap, { tokenValue: tokens.bar.value })).to.eql({
        resolved: '16px',
        errors: [],
      });
    });

    it('allows mutating the input Map without cloning', () => {
      const tokens = {
        foo: {
          $value: '16px',
        },
        bar: {
          $value: '{foo}',
        },
      };

      const tokenMap = convertTokenData(tokens, { output: 'map', usesDtcg: true });
      resolveRefs(tokenMap, { usesDtcg: true, mutateMap: true });
      expect(tokenMap).to.eql(
        new Map([
          ['{foo}', { $value: '16px', key: '{foo}' }],
          ['{bar}', { $value: '16px', key: '{bar}' }],
        ]),
      );
    });

    it('throws an error when you combine single token + mutate map options', () => {
      expect(() => resolveRefs(new Map(), { mutateMap: true, tokenValue: '{foo}' })).to.throw(
        '`mutateMap` and `tokenValue` option cannot be combined.',
      );
    });
  });
});
