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

var assert     = require('chai').assert,
    helpers    = require('./helpers'),
    transforms = require('../lib/common/transforms');


describe('transforms', function() {
  describe('name/cti/camel', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/camel"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'prefixOneTwoThree');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/camel"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'oneTwoThree');
    });
  });


  describe('name/cti/kebab', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/kebab"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'prefix-one-two-three');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/kebab"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'one-two-three');
    });
  });

  describe('name/cti/snake', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/snake"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'prefix_one_two_three');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/snake"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'one_two_three');
    });
  });

  describe('name/cti/constant', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'PREFIX_ONE_TWO_THREE');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'ONE_TWO_THREE');
    });
  });
});
