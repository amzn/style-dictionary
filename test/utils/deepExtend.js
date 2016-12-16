var assert     = require('chai').assert,
    deepExtend = require('../../lib/utils/deepExtend');


describe('deepExtend', function() {
  it('should return an object', function () {
    var test = deepExtend();
    assert.isObject(test);
  });

  it('should override properties from right to left', function () {
    var test = deepExtend({foo:'bar'}, {foo:'baz'});
    assert.equal(test.foo, 'baz');

    var test2 = deepExtend({foo:'bar'}, {foo:'baz'}, {foo:'blah'});
    assert.equal(test2.foo, 'blah');
  });

  it('should override nested properties', function () {
    var test = deepExtend({foo: {foo:'bar'}}, {foo: {foo:'baz'}});
    assert.equal(test.foo.foo, 'baz');

    var test2 = deepExtend({foo:{foo:'bar'}}, {foo:{foo:'baz'}}, {foo:{foo:'blah'}});
    assert.equal(test2.foo.foo, 'blah');
  });

  it('should override nested properties', function () {
    var test = deepExtend({foo: {bar:'bar'}}, {foo: {baz:'baz'}});
    assert.equal(test.foo.baz, 'baz');
    assert.equal(test.foo.bar, 'bar');

    var test2 = deepExtend({foo:{bar:'bar'}}, {foo:{baz:'baz'}}, {foo:{blah:'blah'}});
    assert.equal(test2.foo.baz, 'baz');
    assert.equal(test2.foo.bar, 'bar');
    assert.equal(test2.foo.blah, 'blah');
  });
});
