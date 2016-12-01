var assert          = require('assert'),
    should          = require('should'),
    helpers         = require('./helpers'),
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
      var platforms = helpers.fileToJSON(__dirname + '/configs/test.json').platforms;
      test.platforms.should.have.properties(platforms);
    });

    it('should accept an object as options', function () {
      var config = helpers.fileToJSON(__dirname + '/configs/test.json');
      var test = StyleDictionary.extend(config);
      test.platforms.should.have.properties( config.platforms );
    });

    it('should override attributes', function () {
      var test = StyleDictionary.extend({
        properties: {
          foo: 'bar'
        }
      });
      test.properties.foo.should.eql('bar');
    });

    it('should return a copy of itself', function() {
      var test = StyleDictionary.extend({});
      test.should.have.properties( StyleDictionary );
    });
  });


  describe('includes', function() {
    it('should throw if include isnt an array', function() {
      StyleDictionary.extend.bind({
        include: {}
      }).should.throw();
    });

    it('should throw if a path in the includes array doesnt resolve', function() {
      StyleDictionary.extend.bind({
        include: ['foo']
      }).should.throw();
    });

    it('should update properties if there are includes', function () {
      var test = StyleDictionary.extend({
        include: [__dirname + '/configs/include.json']
      });
      test.properties.size.padding.tiny.should.be.and.Object;
    });

    it('should override existing properties if there are includes', function () {
      var test = StyleDictionary.extend({
        properties: test_props,
        include: [__dirname + '/configs/include.json']
      });
      test.properties.size.padding.tiny.value.should.eql('3');
    });
  });


  describe('source', function() {
    it('should throw if source isnt an array', function() {
      StyleDictionary.extend.bind({
        source: {}
      }).should.throw();
    });

    it('should throw if a path in the source array doesnt resolve', function() {
      StyleDictionary.extend.bind({
        include: ['foo']
      }).should.throw();
    });

    it('should build the properties object if a source is given', function() {
      var test = StyleDictionary.extend({
        "source": [__dirname + "/properties/paddings.json"]
      });
      test.properties.should.eql( helpers.fileToJSON(__dirname + "/properties/paddings.json") );
    });

    it('should override existing properties source is given', function() {
      var test = StyleDictionary.extend({
        properties: test_props,
        source: [__dirname + "/properties/paddings.json"]
      });
      test.properties.should.eql( helpers.fileToJSON(__dirname + "/properties/paddings.json") );
    });
  });


});
