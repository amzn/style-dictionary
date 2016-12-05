var assert     = require('chai').assert,
    helpers    = require('./helpers'),
    buildFiles = require('../lib/buildFiles');

var dictionary = {
  properties: {
    foo: 'bar'
  }
};

var platform = {
  files: [
    {
      destination: 'test/output/test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithBuildPath = {
  buildPath: 'test/output/',
  files: [
    {
      destination: 'test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

describe('buildFiles', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });


 it('should work without buildPath', function() {
   buildFiles( dictionary, platform );
   assert(helpers.fileExists('./test/output/test.json'));
 });

 it('should work with buildPath', function() {
   buildFiles( dictionary, platformWithBuildPath );
   assert(helpers.fileExists('./test/output/test.json'));
 });
});
