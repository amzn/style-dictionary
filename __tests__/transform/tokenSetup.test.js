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
import tokenSetup from '../../lib/transform/tokenSetup.js';

describe('transform', () => {
  describe('tokenSetup', () => {
    it('should error if property is not an object', () => {
      expect(tokenSetup.bind(null, null, 'foo', [])).to.throw('Property object must be an object');
    });

    it('should error if name in not a string', () => {
      expect(tokenSetup.bind(null, {}, null, [])).to.throw('Name must be a string');
    });

    it('should error path is not an array', () => {
      expect(tokenSetup.bind(null, {}, 'name', null)).to.throw('Path must be an array');
    });

    it('should work if all the args are proper', () => {
      const test = tokenSetup({ value: '#fff' }, 'white', ['color', 'base']);
      expect(typeof test).to.equal('object');
      expect(test).to.have.property('value');
      expect(test).to.have.property('original');
      expect(test).to.have.property('attributes');
      expect(test).to.have.property('path');
    });

    it('should not do anything and return the property if it has been setup previously', () => {
      const original = { value: '#fff', original: {} };
      const test = tokenSetup(original, 'white', ['color', 'base']);
      expect(test).to.eql(original);
    });

    it('should use attributes if already set', () => {
      const attributes = { foo: 'bar' };
      const test = tokenSetup({ value: '#fff', attributes: attributes }, 'white', [
        'color',
        'base',
      ]);
      expect(test.attributes).to.eql(attributes);
    });

    it('should use the name on the property if set', () => {
      const name = 'name';
      const test = tokenSetup({ value: '#fff', name: name }, 'white', ['color', 'base']);
      expect(test).to.have.property('name', name);
    });

    it('should use the name passed in if not set on the property', () => {
      const test = tokenSetup({ value: '#fff' }, 'white', ['color', 'base']);
      expect(test).to.have.property('name', 'white');
    });

    it('should handle objects', () => {
      const test = tokenSetup(
        {
          value: {
            h: 20,
            s: 50,
            l: 50,
          },
        },
        'red',
        ['color', 'red'],
      );
      expect(test).to.have.nested.property('value.h', 20);
      expect(test).to.have.nested.property('original.value.h', 20);
    });
  });
});
