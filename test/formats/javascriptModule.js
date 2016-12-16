var assert  = require('chai').assert,
    fs = require('fs-extra'),
    helpers = require('../helpers'),
    formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "javascript/module",
  "filter": {
    "attributes": {
      "category": "color"
    }
  }
};

var dictionary = {
  "properties": {
    "color": {
      "red": {"value": "#FF0000"}
    }
  }
};

var formatter = formats['javascript/module'].bind(file);

describe('formats', function() {
  describe('javascript/module', function() {
    beforeEach(function() {
      helpers.clearOutput();
    });

    it('should be a valid JS file', function() {
      fs.writeFileSync('./test/output/output.js', formatter(dictionary) );
      var test = require('../output/output.js');
      assert.equal( test.color.red.value, dictionary.properties.color.red.value );
    });
  });
});
