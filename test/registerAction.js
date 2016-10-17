var assert = require('assert'),
    should = require('should'),
    StyleDictionary = require('../index');


describe('registerAction', function() {
  it('should error if name is not a string', function() {
    StyleDictionary.registerAction.bind({
      action: function() {}
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: 1,
      action: function() {}
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: [],
      action: function() {}
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: {},
      action: function() {}
    }).should.throw();
  });

  it('should error if formatter is not a function', function() {
    StyleDictionary.registerAction.bind({
      name: 'test'
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: 'test',
      action: 1
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: 'test',
      action: 'name'
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: 'test',
      action: []
    }).should.throw();

    StyleDictionary.registerAction.bind({
      name: 'test',
      action: {}
    }).should.throw();
  });

  it('should work if name and formatter are good', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      action: function() {}
    });

    StyleDictionary.action['scss'].should.be.a.Function;
  });


  // it('should properly pass the registered action to instances', function() {
  //   var test = StyleDictionary.create({});
  //   test.action['scss'].should.be.a.Function;
  // });
  //
  // it('should work on the instance as well', function() {
  //   var test = StyleDictionary.create({});
  //   test.registerAction({
  //     name: 'foo',
  //     action: function() {}
  //   });
  //   test.action['foo'].should.be.a.Function;
  // });
});
