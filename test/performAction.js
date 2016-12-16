var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    fs              = require('fs-extra'),
    StyleDictionary = require('../index');

StyleDictionary.registerAction({
  name: 'test',
  action: function() {
    fs.writeFileSync('./test/output/action.txt', 'hi')
  }
});

var test = StyleDictionary.extend({
  "platforms": {
    "android": {
      "actions": ["test"]
    }
  }
});

describe('buildPlatform', function() {
  describe('handle actions', function() {
    beforeEach(function() {
      helpers.clearOutput();
    });

    it('should write to a file properly', function() {
      test.buildPlatform('android');
      assert(helpers.fileExists('./test/output/action.txt'));
    });
  });
});
