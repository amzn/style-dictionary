var assert      = require('assert'),
    should      = require('should'),
    fs          = require('fs'),
    helpers     = require('../helpers'),
    combineJSON = require('../../lib/utils/combineJSON');


describe('combineJSON', function() {
  it('should return an object', function () {
    var test = combineJSON(["test/json_files/*.json"]);
    test.should.be.an.instanceOf(Object);
  });

  it('should return null if no files are found', function () {
    var test = combineJSON(["test/json_files/*.foo"]);
    test.should.be.empty;
  });

  it('should handle wildcards', function () {
    var test = combineJSON(["test/json_files/*.json"]);
    test.should.be.an.instanceOf(Object);
  });

  it('should do a deep merge', function() {
    var test = combineJSON(["test/json_files/shallow/*.json"], true);
    (test.a).should.eql(2);
    (test.b).should.eql({"a":1, "c":2});
    (test.d.e.f.g).should.eql(1);
    (test.d.e.f.h).should.eql(2);
  });

  it('should do a shallow merge', function() {
    var test = combineJSON(["test/json_files/shallow/*.json"]);
    (test.a).should.equal(2);
    (test.b).should.eql({"c":2});
    (test.c).should.eql([3,4]);
    (test.d.e.f.h).should.equal(2);
    (!!test.d.e.f.g).should.be.false;
  });
});
