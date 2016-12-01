var assert = require('assert'),
    should = require('should'),
    StyleDictionary = require('../index');


describe('registerTransform', function() {
  it('should error if type is not a string', function() {
    StyleDictionary.registerTransform.bind({
      type: 3
    }).should.throw();
  });

  it('should error if type is not a valid type', function() {
    StyleDictionary.registerTransform.bind({
      type: 'foo'
    }).should.throw();
  });

  it('should error if name is not a string', function() {
    StyleDictionary.registerTransform.bind({
      type: 'name'
    }).should.throw();
  });

  it('should error if matcher is not a function', function() {
    StyleDictionary.registerTransform.bind({
      type: 'name',
      matcher: 'foo'
    }).should.throw();
  });

  it('should error if transformer is not a function', function() {
    StyleDictionary.registerTransform.bind({
      type: 'name',
      matcher: function() { return true; },
      transformer: 'foo'
    }).should.throw();
  });

  it('should work if type, matcher, and transformer are all proper', function() {
    StyleDictionary.registerTransform({
      type: 'name',
      name: 'foo',
      matcher: function() { return true; },
      transformer: function() { return true; }
    });
    StyleDictionary.transform.foo.should.be.an.Object;
    StyleDictionary.transform.foo.type.should.eql('name');
    StyleDictionary.transform.foo.matcher.should.be.a.Function;
    StyleDictionary.transform.foo.transformer.should.be.a.Function;
  });


  it('should properly pass the registered transform to instances', function() {
    var test = StyleDictionary.extend({});
    test.transform.foo.should.be.an.Object;
    test.transform.foo.type.should.eql('name');
    test.transform.foo.matcher.should.be.a.Function;
    test.transform.foo.transformer.should.be.a.Function;
  });
});
