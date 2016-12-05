var assert = require('chai').assert,
    propertySetup = require('../lib/transform/propertySetup');


describe('propertySetup', function() {
  it('should error if property is not an object', function() {
    assert.throws(
      propertySetup.bind(null, 'foo', [])
    );
  });

  it('should error if name in not a string', function() {
    assert.throws(
      propertySetup.bind({}, null, [])
    );
  });

  it('should error path is not an array', function() {
    assert.throws(
      propertySetup.bind({}, 'name', null)
    );
  });


  it('should work if all the args are proper', function() {
    var test = propertySetup(
      {value: "#fff"},
      "white",
      ["color","base"]
    );
    assert.isObject(test);
    assert.property(test, 'value');
    assert.property(test, 'original');
    assert.property(test, 'attributes');
    assert.property(test, 'path');
  });


  it('should not do anything and return the property if it has been setup previously', function() {
    var original = {value: "#fff", original:{}};
    var test = propertySetup(
      original,
      "white",
      ["color","base"]
    );
    assert.deepEqual(test, original);
  });

  it('should use attributes if already set', function() {
    var attributes = {"foo":"bar"};
    var test = propertySetup(
      {value:"#fff", attributes:attributes},
      "white",
      ["color","base"]
    );
    assert.deepEqual(test.attributes, attributes);
  });

  it('should use the name on the property if set', function() {
    var name = "name";
    var test = propertySetup(
      {value:"#fff", name:name},
      'white',
      ["color","base"]
    );
    assert.equal(test.name, name);
  });

  it('should use the name passed in if not set on the property', function() {
    var test = propertySetup(
      {value:"#fff"},
      'white',
      ["color","base"]
    );
    assert.equal(test.name, 'white');
  });
});
