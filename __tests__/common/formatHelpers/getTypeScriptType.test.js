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

const getTypeScriptType = require('../../../lib/common/formatHelpers/getTypeScriptType');

describe('common', () => {
  describe('formatHelpers', () => {
    describe('getTypeScriptType', () => {
      it('should recognize basic types', () => {
        expect(getTypeScriptType('a string')).toEqual('string');
        expect(getTypeScriptType(3.14159)).toEqual('number');
        expect(getTypeScriptType(true)).toEqual('boolean');
      });

      it('should recognize arrays consisting out of same-type primitives', () => {
        expect(getTypeScriptType(['an', 'array', 'of', 'strings'])).toEqual('string[]');
        expect(getTypeScriptType([3.14159])).toEqual('number[]');
        expect(getTypeScriptType([true, false, true, true])).toEqual('boolean[]');
      });

      it('should recognize arrays consisting out of different primitives', () => {
        expect(getTypeScriptType(['string', 3.14, false])).toEqual('(string | number | boolean)[]');
      });

      it('should support nested arrays', () => {
        expect(getTypeScriptType([[100, 200], [300, 400]])).toEqual('number[][]');
      });

      it('should handle simple object types', () => {
        expect(getTypeScriptType({})).toEqual('{  }');
        expect(getTypeScriptType({ property1: '', property2: false })).toEqual('{ property1: string, property2: boolean }');
      });

      it('should handle complex object types', () => {
        const complexObject = { property1: 'foo', property2: ['foo', 'bar'], property3: { subProperty1: 'foo', subProperty2: ['foo', 'bar', 1], } }
        expect(getTypeScriptType(complexObject)).toEqual('{ property1: string, property2: string[], property3: { subProperty1: string, subProperty2: (string | number)[] } }');
      });

      it('should handle outputStringLiterals', () => {
        const stringValue = 'I am a string';
        const options = { outputStringLiterals: true};
        expect(getTypeScriptType(stringValue, options)).toEqual(`"${stringValue}"`);
      });
    });
  });
});