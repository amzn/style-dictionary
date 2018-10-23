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

const scss = require('node-sass');
const formats = require('../../lib/common/formats');

const file = {
  destination: '__output/',
  format: 'scss/variables',
  name: 'foo',
};

const propertyName = 'color-base-red-400';
const propertyValue = '#EF5350';

const dictionary = {
  allProperties: [
    {
      name: propertyName,
      value: propertyValue,
      original: {
        value: propertyValue,
      },
      attributes: {
        category: 'color',
        type: 'base',
        item: 'red',
        subitem: '400',
      },
      path: ['color', 'base', 'red', '400'],
    },
  ],
};

const formatter = formats['scss/variables'].bind(file);

describe('formats', () => {
  describe('scss/variables', () => {
    it('should have a valid scss syntax', done => {
      scss.render(
        {
          data: formatter(dictionary),
        },
        (err, result) => {
          if (err) {
            return done(new Error(err));
          }
          expect(result.css).toBeDefined();
          return done();
        }
      );
    });
  });
});
