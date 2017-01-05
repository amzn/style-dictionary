var assert  = require('chai').assert,
  helpers   = require('./helpers'),
  buildFile = require('../lib/buildFile');

function format() {
  return "hi";
}

describe('buildFile', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should error if format doesnt exist or isnt a function', function() {
    assert.throws(function() {
      buildFile('test/output/test.txt', {}, {}, {})
    });
    assert.throws(function() {
      buildFile('test/output/test.txt', [], {}, {})
    });
    assert.throws(function() {
      buildFile('test/output/test.txt', null, {}, {})
    });
  });

  it('should error if destination doesnt exist or isnt a string', function() {
    assert.throws(function() {
      buildFile({}, format, {}, {})
    });
    assert.throws(function() {
      buildFile([], format, {}, {})
    });
    assert.throws(function() {
      buildFile(null, format, {}, {})
    });
  });

  it('should write to a file properly', function() {
    buildFile('test.txt', format, {buildPath: 'test/output/'}, {});
    assert(helpers.fileExists('./test/output/test.txt'));
  });
});
