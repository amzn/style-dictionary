var assert  = require('chai').assert,
  fs = require('fs-extra'),
  helpers = require('../helpers'),
  formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "json"
};

var dictionary = {
  "properties": {
    "color": {
      "red": {"value": "#FF0000"}
    }
  }
};

var formatter = formats['json'].bind(file);

describe('formats', function() {
  describe('javascript/module', function() {
    beforeEach(function() {
      helpers.clearOutput();
    });

    it('should be a valid JSON file', function() {
      fs.writeFileSync('./test/output/output.json', formatter(dictionary) );
      var test = require('../output/output.json');
      assert.equal( test.color.red.value, dictionary.properties.color.red.value );
    });
  });
});
