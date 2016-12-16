var assert     = require('chai').assert,
    helpers    = require('./helpers'),
    transforms = require('../lib/common/transforms');


describe('transforms', function() {
  describe('name/cti/camel', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/camel"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'prefixOneTwoThree');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/camel"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'oneTwoThree');
    });
  });


  describe('name/cti/kebab', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/kebab"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'prefix-one-two-three');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/kebab"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'one-two-three');
    });
  });

  describe('name/cti/snake', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/snake"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'prefix_one_two_three');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/snake"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'one_two_three');
    });
  });

  describe('name/cti/constant', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/cti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'PREFIX_ONE_TWO_THREE');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/cti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'ONE_TWO_THREE');
    });
  });
});
