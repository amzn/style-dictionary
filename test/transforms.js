var assert     = require('assert'),
    should     = require('should'),
    helpers    = require('./helpers'),
    transforms = require('../lib/common/transforms');


describe('transforms', function() {
  describe('name/cti/camel', function() {
    it('should handle prefix', function() {
      transforms["name/cti/camel"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ).should.eql('prefixOneTwoThree');
    });

    it('should handle no prefix', function() {
      transforms["name/cti/camel"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ).should.eql('oneTwoThree');
    });
  });


  describe('name/cti/kebab', function() {
    it('should handle prefix', function() {
      transforms["name/cti/kebab"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ).should.eql('prefix-one-two-three');
    });

    it('should handle no prefix', function() {
      transforms["name/cti/kebab"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ).should.eql('one-two-three');
    });
  });

  describe('name/cti/snake', function() {
    it('should handle prefix', function() {
      transforms["name/cti/snake"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ).should.eql('prefix_one_two_three');
    });

    it('should handle no prefix', function() {
      transforms["name/cti/snake"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ).should.eql('one_two_three');
    });
  });

  describe('name/cti/constant', function() {
    it('should handle prefix', function() {
      transforms["name/cti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ).should.eql('PREFIX_ONE_TWO_THREE');
    });

    it('should handle no prefix', function() {
      transforms["name/cti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ).should.eql('ONE_TWO_THREE');
    });
  });
});
