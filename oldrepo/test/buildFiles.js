//var assert          = require('assert'),
//    should          = require('should'),
//    helpers         = require('./helpers'),
//    StyleDictionary = require('../index');
//
//// Test configs
//var config = helpers.fileToJSON('test/configs/test.json');
//var test = StyleDictionary.create(config);
//var test2 = StyleDictionary.create({
//  "source": ["test/properties/**/*.json"],
//  "platforms": {
//    "web": {
//      "transformGroup": "web",
//      "prefix": "smop",
//      "buildPath": "test/output/web/",
//      "files": [
//        {
//          "destination": "_icons.scss",
//          "format": "scss/icons"
//        },{
//          "destination": "_variables.scss",
//          "format": "scss/variables"
//        },{
//          "destination": "_icon_font.scss",
//          "format": "scss/font"
//        },{
//          "destination": "_styles.js",
//          "format": "javascript/module"
//        }
//      ]
//    }
//  }
//});
//
//
//describe('buildFiles', function() {
//  beforeEach(function() {
//    helpers.clearOutput();
//  });
//
//
//  it('should work', function() {
//    //console.log(test);
//    test.buildFiles( test.options.platforms.web, {
//      properties: test.properties,
//      allProperties: StyleDictionary.utils.flattenProperties( test.properties )
//    });
//    //helpers.fileExists('./test/output/web/_icons.scss').should.be.true;
//    //helpers.fileExists('./test/output/web/_icon_font.scss').should.be.true;
//    //helpers.fileExists('./test/output/web/_variables.scss').should.be.true;
//  });
//
//  it('should work with buildPath', function() {
//    //test2.buildFiles( test2.options.platforms.web, test );
//    //helpers.fileExists('./test/output/web/_icons.scss').should.be.true;
//    //helpers.fileExists('./test/output/web/_icon_font.scss').should.be.true;
//    //helpers.fileExists('./test/output/web/_variables.scss').should.be.true;
//  });
//});
