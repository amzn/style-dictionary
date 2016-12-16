var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    keys            = require('lodash/keys'),
    StyleDictionary = require('../index');

// Test configs
var config = helpers.fileToJSON(__dirname + '/configs/test.json');
var test = StyleDictionary.extend(config);

describe('exportPlatform', function() {

  it('should throw if not given a proper platform', function () {
    assert.throws(test.exportPlatform, Error);
  });

  it('should throw if not given a proper platform', function () {
    assert.throws(function(){
      test.exportPlatform('foo');
    });
  });

  it('should not throw if given a proper platform', function () {
    assert.doesNotThrow(function(){
      test.exportPlatform('web');
    });
  });

  it('should return an object', function () {
    var dictionary = test.exportPlatform('web');
    assert.isObject(dictionary);
  });

  it('should have the same structure as the original properties', function () {
    var dictionary = test.exportPlatform('web');
    assert.deepEqual(
      keys(dictionary),
      keys(test.properties)
    );
  });

  it('should have resolved references', function () {
    var dictionary = test.exportPlatform('web');
    assert.equal(
      dictionary.color.font.link.value,
      dictionary.color.base.blue['100'].value
    );
  });

  it('should have applied transforms', function () {
    var dictionary = test.exportPlatform('web');
    assert(
      dictionary.size.padding.base.value.indexOf('px')
    );
  });

  it('should not have mutated the original properties', function () {
    var dictionary = test.exportPlatform('web');

    assert.notEqual(
      dictionary.color.font.link.value,
      test.properties.color.font.link.value
    );

    assert.equal(
      test.properties.size.padding.base.value.indexOf('px'),
      -1
    );
  });
});
