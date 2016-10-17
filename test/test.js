var assert          = require('assert'),
    should          = require('should'),
    helpers         = require('./helpers');

after(function() {
  // runs after all tests
  helpers.clearOutput();
});
