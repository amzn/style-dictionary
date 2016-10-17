var assert          = require('assert'),
    should          = require('should'),
    fs              = require('fs-extra'),
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
    helpers.fileExists('./test/output/web/_icons.scss').should.be.true;
    helpers.fileExists('./test/output/web/_icon_font.scss').should.be.true;
    helpers.fileExists('./test/output/web/_styles.js').should.be.true;
    helpers.fileExists('./test/output/web/_variables.scss').should.be.true;
  });

  it('should do android stuff', function() {
    test.buildPlatform('android');
    helpers.fileExists('./test/output/android/main/res/drawable-hdpi/flag_us.png').should.be.true;
    helpers.fileExists('./test/output/android/main/res/drawable-xhdpi/flag_us.png').should.be.true;
    helpers.fileExists('./test/output/android/colors.xml').should.be.true;
    helpers.fileExists('./test/output/android/dimens.xml').should.be.true;
    helpers.fileExists('./test/output/android/font_dimen.xml').should.be.true;
  });

  it('should do ios stuff', function() {
    test.buildPlatform('ios');
    helpers.fileExists('./test/output/ios/style_dictionary.plist').should.be.true;
    helpers.fileExists('./test/output/ios/style_dictionary.h').should.be.true;
  });
});
