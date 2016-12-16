var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    StyleDictionary = require('../index');

// Test configs
var config = helpers.fileToJSON(__dirname + '/configs/test.json');
var test = StyleDictionary.extend(config);

describe('buildPlatform', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should build the proper files', function() {
    test.buildPlatform('web');
    assert(helpers.fileExists('./test/output/web/_icons.scss'));
    assert(helpers.fileExists('./test/output/web/_styles.js'));
    assert(helpers.fileExists('./test/output/web/_variables.scss'));
  });

  it('should do android stuff', function() {
    test.buildPlatform('android');
    assert(helpers.fileExists('./test/output/android/main/res/drawable-hdpi/flag_us.png'));
    assert(helpers.fileExists('./test/output/android/main/res/drawable-xhdpi/flag_us.png'));
    assert(helpers.fileExists('./test/output/android/colors.xml'));
    assert(helpers.fileExists('./test/output/android/dimens.xml'));
    assert(helpers.fileExists('./test/output/android/font_dimen.xml'));
  });

  it('should do ios stuff', function() {
    test.buildPlatform('ios');
    assert(helpers.fileExists('./test/output/ios/style_dictionary.plist'));
    assert(helpers.fileExists('./test/output/ios/style_dictionary.h'));
  });
});
