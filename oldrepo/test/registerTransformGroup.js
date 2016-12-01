var assert = require('assert'),
    should = require('should'),
    StyleDictionary = require('../index');


describe('registerTransformGroup', function() {
  it('should error if name is not a string', function() {
    StyleDictionary.registerTransformGroup.bind({
      transforms: ['foo']
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: 1,
      transforms: ['foo']
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: [],
      transforms: ['foo']
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: {},
      transforms: ['foo']
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: function() {},
      transforms: ['foo']
    }).should.throw();
  });

  it('should error if transforms isnt an array', function() {
    StyleDictionary.registerTransformGroup.bind({
      name: 'foo'
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: 'foo',
      transforms: 'foo'
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: 'foo',
      transforms: {}
    }).should.throw();

    StyleDictionary.registerTransformGroup.bind({
      name: 'foo',
      transforms: function() {}
    }).should.throw();
  });

  it('should error if transforms arent registered', function() {
    StyleDictionary.registerTransformGroup.bind({
      name: 'foo',
      transforms: ['bar']
    }).should.throw();
  });

  it('should work if everything is good', function() {
    StyleDictionary.registerTransformGroup({
      name: 'foo',
      transforms: ['foo']
    });

    StyleDictionary.transformGroup.foo.should.be.an.Array;
    StyleDictionary.transformGroup.foo[0].should.be.a.String;
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    test.transformGroup.foo.should.be.an.Array;
    test.transformGroup.foo[0].should.be.a.String;
  });
});
