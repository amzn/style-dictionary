var assert          = require('assert'),
    should          = require('should'),
    convertToBase64 = require('../../lib/utils/convertToBase64.js');

describe('base64', function() {
  it('should error if filePath isnt a string', function() {
    convertToBase64.bind().should.throw();
    convertToBase64.bind([]).should.throw();
    convertToBase64.bind({}).should.throw();
  });

  it('should error if filePath isnt a file', function() {
    convertToBase64.bind('foo').should.throw();
  });

  it('should return a string', function() {
    convertToBase64('test/configs/test.json').should.be.a.String;
  });
});
