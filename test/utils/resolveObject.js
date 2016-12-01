var assert        = require('assert'),
    should        = require('should'),
    fs            = require('fs'),
    helpers       = require('../helpers'),
    resolveObject = require('../../lib/utils/resolveObject');


describe('resolveObject', function() {
  it('should error on non-objects', function() {
    resolveObject.bind('foo').should.throw();
    resolveObject.bind().should.throw();
    resolveObject.bind(0).should.throw();
  });

  it('should do simple references', function() {
    var test1 = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/simple.json') );
    (test1.bar).should.equal('bar');
  });

  it('should do nested references', function() {
    var obj = helpers.fileToJSON('test/json_files/nested_references.json');
    var test = resolveObject( obj );
    (test.i).should.equal(2);
    (test.a.b.d).should.equal(2);
    (test.e.f.h).should.equal(1);
  });

  it('should handle nested pointers', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers.json') );
    (test.b).should.equal(1);
    (test.c).should.equal(1);
  });

  it('should handle deep nested pointers', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers_2.json') );
    (test.a).should.equal(1);
    (test.b).should.equal(1);
    (test.c).should.equal(1);
    (test.d).should.equal(1);
    (test.e).should.equal(1);
    (test.f).should.equal(1);
    (test.g).should.equal(1);
  });

  it('should handle deep nested pointers with string interpolation', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers_3.json') );
    (test.a).should.equal('foo bon bee bae boo bla baz bar');
    (test.b).should.equal('foo bon bee bae boo bla baz');
    (test.c).should.equal('foo bon bee bae boo bla');
    (test.d).should.equal('foo bon bee bae boo');
    (test.e).should.equal('foo bon bee bae');
    (test.f).should.equal('foo bon bee');
    (test.g).should.equal('foo bon');
  });

  it('should handle deep nested pointers and nested references', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers_4.json') );
    (test.a.a.a).should.equal(1);
    (test.b.b.b).should.equal(1);
    (test.c.c.c).should.equal(1);
    (test.d.d.d).should.equal(1);
    (test.e.e.e).should.equal(1);
    (test.f.f.f).should.equal(1);
    (test.g.g.g).should.equal(1);
  });


  it('should keep the type of the referenced property', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/reference_type.json') );
    (test.d).should.equal(1);
    (test.d).should.be.a.Number;
    (test.e).should.be.an.Object;
    (test.g).should.be.an.Array;
    (test.e.c).should.be.equal(2);
  });

  it('should handle and evaluate items in an array', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/array.json') );
    (test.d[0]).should.equal(2);
    (test.d[1]).should.equal(1);
    (test.e[0].a).should.equal(1);
    (test.e[1].a).should.equal(2);
  });

  it('should throw if pointers don\'t exist', function() {
    resolveObject.bind( helpers.fileToJSON(__dirname + '/../json_files/non_existent.json') ).should.throw();
  });

  it('should gracefully handle circular references', function() {
    resolveObject.bind( helpers.fileToJSON(__dirname + '/../json_files/circular.json')   ).should.throw();
    resolveObject.bind( helpers.fileToJSON(__dirname + '/../json_files/circular_2.json') ).should.throw();
    resolveObject.bind( helpers.fileToJSON(__dirname + '/../json_files/circular_3.json') ).should.throw();
    resolveObject.bind( helpers.fileToJSON(__dirname + '/../json_files/circular_4.json') ).should.throw();
  });
});
