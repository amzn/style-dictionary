var assert = require('chai').assert,
    StyleDictionary = require('../index').extend({});


describe('registerAction', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerAction.bind({
        action: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 1,
        action: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: [],
        action: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: {},
        action: function() {}
      })
    );
  });

  it('should error if formatter is not a function', function() {
    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test'
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: 1
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: 'name'
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: []
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: {}
      })
    );
  });

  it('should work if name and formatter are good', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      action: function() {}
    });

    assert.isFunction(StyleDictionary.action['scss']);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isFunction(test.action['scss']);
  });
});
