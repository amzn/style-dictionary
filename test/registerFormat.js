var assert = require('assert'),
    should = require('should'),
    StyleDictionary = require('../index');


describe('registerFormat', function() {
  it('should error if name is not a string', function() {
    StyleDictionary.registerFormat.bind({
      formatter: function() {}
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: 1,
      formatter: function() {}
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: [],
      formatter: function() {}
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: {},
      formatter: function() {}
    }).should.throw();
  });

  it('should error if formatter is not a function', function() {
    StyleDictionary.registerFormat.bind({
      name: 'test'
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: 'test',
      formatter: 1
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: 'test',
      formatter: 'name'
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: 'test',
      formatter: []
    }).should.throw();

    StyleDictionary.registerFormat.bind({
      name: 'test',
      formatter: {}
    }).should.throw();
  });

  it('should work if name and formatter are good', function() {
    StyleDictionary.registerFormat({
      name: 'scss',
      formatter: function() {}
    });

    StyleDictionary.format['scss'].should.be.a.Function;
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    test.format['scss'].should.be.a.Function;
  });
});
