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
import { fileToJSON } from '../../__helpers.js';
import {
  _resolveReferences as resolveReferences,
  resolveReferences as publicResolveReferences,
} from '../../../lib/utils/references/resolveReferences.js';
import GroupMessages from '../../../lib/utils/groupMessages.js';

const PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;

describe('utils', () => {
  describe('references', () => {
    describe('resolveReferences', () => {
      beforeEach(() => {
        GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);
      });

      describe('public API', () => {
        it('should not collect errors but rather throw immediately when using public API', () => {
          const obj = fileToJSON('__tests__/__json_files/multiple_reference_errors.json');
          expect(() => publicResolveReferences(obj.a.b, obj)).to.throw(
            `Reference doesn't exist: tries to reference b.a, which is not defined.`,
          );
          expect(() => publicResolveReferences(obj.a.c, obj)).to.throw(
            `Reference doesn't exist: tries to reference b.c, which is not defined.`,
          );
          expect(() => publicResolveReferences(obj.a.d, obj)).to.throw(
            `Reference doesn't exist: tries to reference d, which is not defined.`,
          );
        });
      });

      it('should do simple references', () => {
        const test = resolveReferences('{foo}', fileToJSON('__tests__/__json_files/simple.json'));
        expect(test).to.equal('bar');
      });

      it('should do simple interpolation for both strings and numbers', () => {
        const obj = fileToJSON('__tests__/__json_files/interpolation.json');
        expect(resolveReferences(obj.c, obj)).to.equal('test1 value text after');
        expect(resolveReferences(obj.d, obj)).to.equal('text before test1 value');
        expect(resolveReferences(obj.e, obj)).to.equal('text before test1 value text after');
        expect(resolveReferences(obj.f, obj)).to.equal('123 text after');
        expect(resolveReferences(obj.g, obj)).to.equal('text before 123');
        expect(resolveReferences(obj.h, obj)).to.equal('text before 123 text after');
      });

      it('should do nested references', () => {
        const obj = fileToJSON('__tests__/__json_files/nested_references.json');
        expect(resolveReferences(obj.i, obj)).to.equal(2);
        expect(resolveReferences(obj.a.b.d, obj)).to.equal(2);
        expect(resolveReferences(obj.e.f.h, obj)).to.equal(1);
      });

      it('should handle nested pointers', () => {
        const obj = fileToJSON('__tests__/__json_files/nested_pointers.json');
        expect(resolveReferences(obj.b, obj)).to.equal(1);
        expect(resolveReferences(obj.c, obj)).to.equal(1);
      });

      it('should handle deep nested pointers', () => {
        const obj = fileToJSON('__tests__/__json_files/nested_pointers_2.json');
        expect(resolveReferences(obj.a, obj)).to.equal(1);
        expect(resolveReferences(obj.b, obj)).to.equal(1);
        expect(resolveReferences(obj.c, obj)).to.equal(1);
        expect(resolveReferences(obj.d, obj)).to.equal(1);
        expect(resolveReferences(obj.e, obj)).to.equal(1);
        expect(resolveReferences(obj.f, obj)).to.equal(1);
      });

      it('should handle deep nested pointers with string interpolation', () => {
        const obj = fileToJSON('__tests__/__json_files/nested_pointers_3.json');
        expect(resolveReferences(obj.a, obj)).to.equal('foo bon bee bae boo bla baz bar');
        expect(resolveReferences(obj.b, obj)).to.equal('foo bon bee bae boo bla baz');
        expect(resolveReferences(obj.c, obj)).to.equal('foo bon bee bae boo bla');
        expect(resolveReferences(obj.d, obj)).to.equal('foo bon bee bae boo');
        expect(resolveReferences(obj.e, obj)).to.equal('foo bon bee bae');
        expect(resolveReferences(obj.f, obj)).to.equal('foo bon bee');
        expect(resolveReferences(obj.g, obj)).to.equal('foo bon');
      });

      it('should handle deep nested pointers and nested references', () => {
        const obj = fileToJSON('__tests__/__json_files/nested_pointers_4.json');
        expect(resolveReferences(obj.a.a.a, obj)).to.equal(1);
        expect(resolveReferences(obj.b.b.b, obj)).to.equal(1);
        expect(resolveReferences(obj.c.c.c, obj)).to.equal(1);
        expect(resolveReferences(obj.d.d.d, obj)).to.equal(1);
        expect(resolveReferences(obj.e.e.e, obj)).to.equal(1);
        expect(resolveReferences(obj.f.f.f, obj)).to.equal(1);
      });

      it('should keep the type of the referenced property', () => {
        const obj = fileToJSON('__tests__/__json_files/reference_type.json');
        expect(resolveReferences(obj.d, obj)).to.equal(1);
        expect(typeof resolveReferences(obj.d, obj)).to.equal('number');
        expect(typeof resolveReferences(obj.e, obj)).to.equal('object');
        expect(resolveReferences(obj.e, obj)).to.eql({ c: 2 });
        expect(resolveReferences(obj.g, obj)).to.eql([1, 2, 3]);
      });

      it('should handle and evaluate items in an array', () => {
        const obj = fileToJSON('__tests__/__json_files/array.json');
        expect(resolveReferences(obj.d[0], obj)).to.equal(2);
        expect(resolveReferences(obj.d[1], obj)).to.equal(1);
        expect(resolveReferences(obj.e[0].a, obj)).to.equal(1);
        expect(resolveReferences(obj.e[1].a, obj)).to.equal(2);
      });

      it("should store warning if pointers don't exist", () => {
        const obj = fileToJSON('__tests__/__json_files/non_existent.json');
        expect(resolveReferences(obj.foo, obj)).to.be.undefined;
        expect(resolveReferences(obj.error, obj)).to.be.undefined;
        expect(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS)).to.eql([
          "Reference doesn't exist: tries to reference bar, which is not defined.",
          "Reference doesn't exist: tries to reference a.b.d, which is not defined.",
        ]);
      });

      it('should gracefully handle basic circular references', () => {
        const obj = fileToJSON('__tests__/__json_files/circular.json');
        expect(resolveReferences(obj.a, obj)).to.equal('{b}');
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(1);
        expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).to.equal(
          JSON.stringify(['Circular definition cycle:  b, c, d, a, b']),
        );
      });

      it('should gracefully handle basic and nested circular references', () => {
        const obj = fileToJSON('__tests__/__json_files/circular_2.json');
        expect(resolveReferences(obj.j, obj)).to.equal('{a.b.c}');
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(1);
        expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).to.equal(
          JSON.stringify(['Circular definition cycle:  a.b.c, j, a.b.c']),
        );
      });

      it('should gracefully handle nested circular references', () => {
        const obj = fileToJSON('__tests__/__json_files/circular_3.json');
        expect(resolveReferences(obj.c.d.e, obj)).to.equal('{a.b}');
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(1);
        expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).to.equal(
          JSON.stringify(['Circular definition cycle:  a.b, c.d.e, a.b']),
        );
      });

      it('should gracefully handle multiple nested circular references', () => {
        const obj = fileToJSON('__tests__/__json_files/circular_4.json');
        expect(resolveReferences(obj.h.i, obj)).to.equal('{a.b.c.d}');
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(1);
        expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).to.equal(
          JSON.stringify(['Circular definition cycle:  a.b.c.d, e.f.g, h.i, a.b.c.d']),
        );
      });

      it('should gracefully handle down-chain circular references', () => {
        const obj = fileToJSON('__tests__/__json_files/circular_5.json');
        expect(resolveReferences(obj.n, obj)).to.equal('{l}');
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(1);
        expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).to.equal(
          JSON.stringify(['Circular definition cycle:  l, m, l']),
        );
      });

      it('should correctly resolve multiple references without reference errors', function () {
        const obj = fileToJSON('__tests__/__json_files/not_circular.json');
        expect(resolveReferences(obj.prop8.value, obj)).to.equal(5);
        expect(resolveReferences(obj.prop12.value, obj)).to.equal(
          'test1 value, test2 value and some extra stuff',
        );
        expect(resolveReferences(obj.prop124.value, obj)).to.equal(
          'test1 value, test2 value and test1 value',
        );
        expect(resolveReferences(obj.prop15.value, obj)).to.equal(
          'test1 value, 5 and some extra stuff',
        );
        expect(resolveReferences(obj.prop156.value, obj)).to.equal('test1 value, 5 and 6');
        expect(resolveReferences(obj.prop1568.value, obj)).to.equal('test1 value, 5, 6 and 5');
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(0);
      });

      describe('ignorePaths', () => {
        it('should not resolve values containing constiables in ignored paths', () => {
          const obj = {
            foo: { value: 'bar' },
            bar: {
              value: '{foo.value}',
            },
          };
          const test = resolveReferences(obj.bar.value, obj, { ignorePaths: ['foo.value'] });
          expect(test).to.equal('{foo.value}');
        });
      });

      it('should handle spaces', () => {
        const obj = {
          foo: { value: 'foo' },
          bar: { value: '{ foo.value }' },
        };
        const test = resolveReferences(obj.bar.value, obj);
        expect(test).to.equal('foo');
      });

      it('should collect multiple reference errors', () => {
        const obj = fileToJSON('__tests__/__json_files/multiple_reference_errors.json');
        expect(resolveReferences(obj.a.b, obj)).to.be.undefined;
        expect(resolveReferences(obj.a.c, obj)).to.be.undefined;
        expect(resolveReferences(obj.a.d, obj)).to.be.undefined;
        expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).to.equal(3);
        expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).to.equal(
          JSON.stringify([
            "Reference doesn't exist: tries to reference b.a, which is not defined.",
            "Reference doesn't exist: tries to reference b.c, which is not defined.",
            "Reference doesn't exist: tries to reference d, which is not defined.",
          ]),
        );
      });

      it('should handle 0', () => {
        const obj = {
          test: { value: '{zero.value}' },
          zero: { value: 0 },
        };
        const test = resolveReferences(obj.test.value, obj);
        expect(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS).length).to.equal(0);
        expect(test).to.equal(0);
      });
    });
  });
});
