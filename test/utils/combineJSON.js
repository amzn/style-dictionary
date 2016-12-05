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
});
