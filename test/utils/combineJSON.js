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

var assert      = require('chai').assert,
    combineJSON = require('../../lib/utils/combineJSON');


describe('combineJSON', function() {
  it('should return an object', function () {
    var test = combineJSON(["test/json_files/*.json"]);
    assert.isObject(test);
  });

  it('should handle wildcards', function () {
    var test = combineJSON(["test/json_files/*.json"]);
    assert.isObject(test);
  });

  it('should do a deep merge', function() {
    var test = combineJSON(["test/json_files/shallow/*.json"], true);
    assert.equal(test.a, 2);
    assert.deepEqual(test.b, {"a":1, "c":2});
    assert.equal(test.d.e.f.g, 1);
    assert.equal(test.d.e.f.h, 2);
  });

  it('should do a shallow merge', function() {
    var test = combineJSON(["test/json_files/shallow/*.json"]);
    assert.equal(test.a, 2);
    assert.deepEqual(test.b, {"c":2});
    assert.deepEqual(test.c, [3,4]);
    assert(!test.d.e.f.g);
    assert.equal(test.d.e.f.h, 2);
  });

  it('should fail if there is a collision and it is passed a collision function', function() {
    assert.throws(
      combineJSON.bind(null, ["test/json_files/shallow/*.json"], true, function Collision(opts) {
        assert.equal(opts.key, 'a');
        assert.equal(opts.target[opts.key], 1);
        assert.equal(opts.copy[opts.key], 2);
        throw new Error('test');
      }),
      Error,
      'test'
    );
  });
});
