var assert = require('assert'),
  should = require('should'),
  propertySetup = require('../lib/transform/propertySetup');


describe('propertySetup', function() {
  it('should error if property is not an object', function() {
    propertySetup.bind(
      null,
      'foo',
      []
    ).should.throw();
  });

  it('should error if name in not a string', function() {
    propertySetup.bind(
      {},
      null,
      []
    ).should.throw();
  });

  it('should error path is not an array', function() {
    propertySetup.bind(
      {},
      'name',
      null
    ).should.throw();
  });


  it('should work if all the args are proper', function() {
    var test = propertySetup(
      {value: "#fff"},
      "white",
      ["color","base"]
    );
    test.should.be.an.Object;
    test.should.have.property('value').and.be.a.String;
    test.should.have.property('original').and.be.an.Object;
    test.should.have.property('attributes').and.be.an.Object;
    test.should.have.property('path').and.be.an.Array;
  });


  it('should not do anything and return the property if it has been setup previously', function() {
    var original = {value: "#fff", original:{}};
    var test = propertySetup(
      original,
      "white",
      ["color","base"]
    );
    test.should.eql(original);
  });

  it('should use attributes if already set', function() {
    var attributes = {"foo":"bar"};
    var test = propertySetup(
      {value:"#fff", attributes:attributes},
      "white",
      ["color","base"]
    );
    test.attributes.should.eql(attributes);
  });

  it('should use the name on the property if set', function() {
    var name = "name";
    var test = propertySetup(
      {value:"#fff", name:name},
      'white',
      ["color","base"]
    );
    test.name.should.eql(name);
  });

  it('should use the name passed in if not set on the property', function() {
    var test = propertySetup(
      {value:"#fff"},
      'white',
      ["color","base"]
    );
    test.name.should.eql('white');
  });
});
