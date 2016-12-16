var assert          = require('chai').assert,
    convertToBase64 = require('../../lib/utils/convertToBase64.js');

describe('base64', function() {
  it('should error if filePath isnt a string', function() {
    assert.throws(convertToBase64);
    assert.throws(convertToBase64.bind([]));
    assert.throws(convertToBase64.bind({}));
  });

  it('should error if filePath isnt a file', function() {
    assert.throws(convertToBase64.bind('foo'));
  });

  it('should return a string', function() {
    assert.isString(convertToBase64('test/configs/test.json'));
  });
});
