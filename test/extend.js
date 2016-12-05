var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    _               = require('lodash'),
    StyleDictionary = require('../index');

var test_props = {
  size: {
    padding: {
      tiny: {value:'0'}
    }
  }
};

describe('extend', function() {

  describe('method signature', function() {
    it('should accept a string as a path to a JSON file', function () {
      var test = StyleDictionary.extend(__dirname + '/configs/test.json');
      assert.property(test.platforms, 'web');
    });

    it('should accept an object as options', function () {
      var config = helpers.fileToJSON(__dirname + '/configs/test.json');
      var test = StyleDictionary.extend(config);
      assert.property(test.platforms, 'web');
    });

    it('should override attributes', function () {
      var test = StyleDictionary.extend({
        properties: {
          foo: 'bar'
        }
      });
      assert.equal(test.properties.foo, 'bar');
    });

    it('should have all same properties', function() {
      var test = StyleDictionary.extend({});
      _.each(_.keys(StyleDictionary), function(property) {
        assert.property(test, property)
      });
    });
  });


  describe('includes', function() {
    it('should throw if include isnt an array', function() {
      assert.throws(
        StyleDictionary.extend.bind({include: {}})
      );
    });

    it('should throw if a path in the includes array doesnt resolve', function() {
      assert.throws(
        StyleDictionary.extend.bind({include: ['foo']})
      );
    });

    it('should update properties if there are includes', function () {
      var test = StyleDictionary.extend({
        include: [__dirname + '/configs/include.json']
      });
      assert.isObject(test.properties.size.padding.tiny);
    });

    it('should override existing properties if there are includes', function () {
      var test = StyleDictionary.extend({
        properties: test_props,
        include: [__dirname + '/configs/include.json']
      });
      assert.equal(test.properties.size.padding.tiny.value, '3');
    });
  });


  describe('source', function() {
    it('should throw if source isnt an array', function() {
      assert.throws(
        StyleDictionary.extend.bind({source: {}})
      );
    });

    it('should throw if a path in the source array doesnt resolve', function() {
      assert.throws(
        StyleDictionary.extend.bind({include: ['foo']})
      );
    });

    it('should build the properties object if a source is given', function() {
      var test = StyleDictionary.extend({
        "source": [__dirname + "/properties/paddings.json"]
      });
      assert.deepEqual(test.properties, helpers.fileToJSON(__dirname + "/properties/paddings.json"));
    });

    it('should override existing properties source is given', function() {
      var test = StyleDictionary.extend({
        properties: test_props,
        source: [__dirname + "/properties/paddings.json"]
      });
      assert.deepEqual(test.properties, helpers.fileToJSON(__dirname + "/properties/paddings.json"));
    });
  });


});
