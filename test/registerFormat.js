var assert = require('chai').assert,
    StyleDictionary = require('../index').extend({});


describe('registerFormat', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerFormat.bind({formatter: function() {}})
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: 1,
        formatter: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: [],
        formatter: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: {},
        formatter: function() {}
      })
    );
  });

  it('should error if formatter is not a function', function() {
    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: 'test'
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: 'test',
        formatter: 1
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: 'test',
        formatter: 'name'
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: 'test',
        formatter: []
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind({
        name: 'test',
        formatter: {}
      })
    );
  });

  it('should work if name and formatter are good', function() {
    StyleDictionary.registerFormat({
      name: 'scss',
      formatter: function() {}
    });

    assert.isFunction(StyleDictionary.format['scss']);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isFunction(test.format['scss']);
  });
});
