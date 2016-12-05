var assert            = require('chai').assert,
    helpers           = require('./helpers'),
    transformProperty = require('../lib/transform/property');


var options = {
  transforms: [
    {
      type: 'attribute',
      transformer: function(prop) {
        return {
          foo: 'bar'
        }
      }
    },{
      type: 'attribute',
      transformer: function(prop) {
        return {bar: 'foo'}
      }
    },{
      type: 'name',
      matcher: function(prop) { return prop.attributes.foo === 'bar'; },
      transformer: function(prop) { return "hello"; }
    }
  ]
};

describe('transformProperty', function() {
  it('should work', function() {
    var test = transformProperty({attributes:{baz:'blah'}}, options);
    assert.equal(test.attributes.bar, 'foo');
    assert.equal(test.name, 'hello');
  });

  // Add more tests
});
