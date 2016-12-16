var assert = require('chai').assert,
    StyleDictionary = require('../index').extend({});


describe('registerTransformGroup', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerTransformGroup.bind({transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 1, transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: [], transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: {}, transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: function() {}, transforms: ['foo']})
    );
  });

  it('should error if transforms isnt an array', function() {
    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo'})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: 'foo'})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: {}})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: function() {}})
    );
  });

  it('should error if transforms arent registered', function() {
    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: ['bar']})
    );
  });

  it('should work if everything is good', function() {
    StyleDictionary.registerTransformGroup({
      name: 'foo',
      transforms: ['foo']
    });

    assert.isArray(StyleDictionary.transformGroup.foo);
    assert.isString(StyleDictionary.transformGroup.foo[0]);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isArray(test.transformGroup.foo);
    assert.isString(test.transformGroup.foo[0]);
  });
});
