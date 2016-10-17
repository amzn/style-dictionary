var assert  = require('assert'),
  should    = require('should'),
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
    buildFile.bind('test/output/test.txt', {}, {}, {}).should.throw();
    buildFile.bind('test/output/test.txt', [], {}, {}).should.throw();
    buildFile.bind('test/output/test.txt', null, {}, {}).should.throw();
  });

  it('should error if destination doesnt exist or isnt a string', function() {
    buildFile.bind({},   format, {}, {}).should.throw();
    buildFile.bind([],   format, {}, {}).should.throw();
    buildFile.bind(null, format, {}, {}).should.throw();
  });

  it('should write to a file properly', function() {
    buildFile('test.txt', format, {buildPath: 'test/output/'}, {});
    helpers.fileExists('./test/output/test.txt').should.be.true;
  });
});
