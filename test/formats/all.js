var assert  = require('chai').assert,
    _ = require('lodash'),
    formats = require('../../lib/common/formats');

var file = {
  "destination": "output/",
  "format": "javascript/es6",
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

describe('formats', function() {
  _.each(_.keys(formats), function(key) {
    it(key + ' should return a string', function() {
      var formatter = formats[key].bind(file);
      assert.isString( formatter(dictionary, file) );
    });
  });
});
