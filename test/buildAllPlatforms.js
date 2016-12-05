var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    StyleDictionary = require('../index');

// Test configs
var config = helpers.fileToJSON(__dirname + '/configs/test.json');
var test = StyleDictionary.extend(config);

describe('buildAllPlatforms', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should work', function() {
    test.buildAllPlatforms();
    assert(helpers.fileExists('./test/output/web/_icons.scss'));
    assert(helpers.fileExists('./test/output/android/colors.xml'));
  });
});
