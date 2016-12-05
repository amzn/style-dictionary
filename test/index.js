var helpers = require('./helpers');

after(function() {
  // runs after all tests
  helpers.clearOutput();
});
