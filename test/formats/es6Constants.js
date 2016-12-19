var assert  = require('chai').assert,
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
  "allProperties": [{
    "name": "TEST",
    "value": "#EF5350",
    "original": {
      "value": "#EF5350"
    },
    "attributes": {
      "category": "color",
      "type": "base",
      "item": "red",
      "subitem": "400"
    },
    "path": [
      "color",
      "base",
      "red",
      "400"
    ]
  }]
};

var formatter = formats['javascript/es6'].bind(file);

describe('formats', function() {
  describe('es6Constants', function() {
    it('should be a valid JS file', function() {
      // TODO: add tests here,
      // Because this is a normal JS module we can't
      // test outputting an ES6 JS file by importing it.
    });
  });
});
