var assert     = require('assert'),
    should     = require('should'),
    deepExtend = require('../../lib/utils/deepExtend');


describe('deepExtend', function() {
  it('should return an object', function () {
    var test = deepExtend();
    test.should.be.an.Object;
  });

  it('should override properties from right to left', function () {
    var test = deepExtend({foo:'bar'}, {foo:'baz'});
    test.foo.should.eql('baz');

    var test2 = deepExtend({foo:'bar'}, {foo:'baz'}, {foo:'blah'});
    test2.foo.should.eql('blah');
  });

  it('should override nested properties', function () {
    var test = deepExtend({foo: {foo:'bar'}}, {foo: {foo:'baz'}});
    test.foo.foo.should.eql('baz');

    var test2 = deepExtend({foo:{foo:'bar'}}, {foo:{foo:'baz'}}, {foo:{foo:'blah'}});
    test2.foo.foo.should.eql('blah');
  });

  it('should override nested properties', function () {
    var test = deepExtend({foo: {bar:'bar'}}, {foo: {baz:'baz'}});
    test.foo.baz.should.eql('baz');
    test.foo.bar.should.eql('bar');

    var test2 = deepExtend({foo:{bar:'bar'}}, {foo:{baz:'baz'}}, {foo:{blah:'blah'}});
    test2.foo.baz.should.eql('baz');
    test2.foo.bar.should.eql('bar');
    test2.foo.blah.should.eql('blah');
  });
});
