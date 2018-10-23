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

const less = require('less');
const formats = require('../../lib/common/formats');

const file = {
  destination: '__output/',
  format: 'less/icons',
  name: 'foo',
};

const propertyName = 'content-icon-email';
const propertyValue = "'\\E001'";
const itemClass = '3d_rotation';

const dictionary = {
  allProperties: [
    {
      name: propertyName,
      value: propertyValue,
      original: {
        value: propertyValue,
      },
      attributes: {
        category: 'content',
        type: 'icon',
        item: itemClass,
      },
    },
  ],
};

const config = {
  prefix: 'sd', // Style-Dictionary Prefix
};

const formatter = formats['less/icons'].bind(file);

describe('formats', () => {
  describe('less/icons', () => {
    it('should have a valid less syntax', done => {
      less
        .render(formatter(dictionary, config))
        .then(output => {
          expect(output).toBeDefined();
          done();
        })
        .catch(err => {
          done(new Error(err));
        });
    });
  });
});
