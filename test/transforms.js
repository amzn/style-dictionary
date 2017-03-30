/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var assert     = require('chai').assert,
    path       = require('path'),
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

  describe('name/ti/constant', function() {
    it('should handle prefix', function() {
      assert.equal(transforms["name/ti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
          prefix: 'prefix'
        }
      ), 'PREFIX_TWO_THREE');
    });

    it('should handle no prefix', function() {
      assert.equal(transforms["name/ti/constant"].transformer(
        {
          path: ['one','two','three']
        },{
        }
      ), 'TWO_THREE');
    });
  });

  describe('attribute/color', function() {
    it('should handle normal colors', function() {
      var attributes = transforms["attribute/color"].transformer({
        value: "#aaaaaa"
      });
      assert.equal(attributes.rgb.a, 1);
      assert.equal(attributes.rgb.r, 170);
      assert.equal(attributes.hsl.s, 0);
    });
    it('should handle colors with transparency', function() {
      var attributes = transforms["attribute/color"].transformer({
        value: "#aaaaaa99"
      });
      var attributes2 = transforms["attribute/color"].transformer({
        value: "rgba(170,170,170,0.6)"
      });
      assert.equal(attributes.rgb.a, 0.6);
      assert.equal(attributes.rgb.r, 170);
      assert.equal(attributes.hsl.s, 0);
      assert.equal(attributes2.rgb.a, 0.6);
      assert.equal(attributes2.rgb.r, 170);
      assert.equal(attributes2.hsl.s, 0);
    });
  });

  describe('color/hex', function() {
    it('should handle hex colors', function() {
      var value = transforms["color/hex"].transformer({
        value: "#aaaaaa"
      });
      assert.equal(value, "#aaaaaa");
    });

    it('should handle hex8 colors', function() {
      var value = transforms["color/hex"].transformer({
        value: "#aaaaaaaa"
      });
      assert.equal(value, "#aaaaaa");
    });

    it('should handle rgb colors', function() {
      var value = transforms["color/hex"].transformer({
        value: "rgb(170,170,170)"
      });
      assert.equal(value, "#aaaaaa");
    });

    it('should handle rgb (object) colors', function() {
      var value = transforms["color/hex"].transformer({
        value: {
          r: '170',
          g: '170',
          b: '170'
        }
      });
      var value2 = transforms["color/hex"].transformer({
        value: "rgb(170,170,170)"
      });
      assert.equal(value, "#aaaaaa");
      assert.equal(value2, "#aaaaaa");
    });

    it('should handle hsl colors', function() {
      var value = transforms["color/hex"].transformer({
        value: {
          h: '0',
          s: '0',
          l: '0.5'
        }
      });
      var value2 = transforms["color/hex"].transformer({
        value: "hsl(0,0,0.5)"
      });
      assert.equal(value, "#808080");
      assert.equal(value2, "#808080");
    });
  });


  describe('color/hex8', function() {
    it('should handle hex colors', function() {
      var value = transforms["color/hex8"].transformer({
        value: "#aaaaaa"
      });
      assert.equal(value, "#aaaaaaff");
    });

    it('should handle rgb colors', function() {
      var value = transforms["color/hex8"].transformer({
        value: "rgb(170,170,170)"
      });
      assert.equal(value, "#aaaaaaff");
    });

    it('should handle rgb colors', function() {
      var value = transforms["color/hex8"].transformer({
        value: "rgb(170,170,170)"
      });
      var value2 = transforms["color/hex8"].transformer({
        value: "rgba(170,170,170,0.6)"
      });
      assert.equal(value, "#aaaaaaff");
      assert.equal(value2, "#aaaaaa99");
    });
  });

  describe('color/hex8android', function() {
    it('should handle colors without alpha', function() {
      var value = transforms["color/hex8android"].transformer({
        value: "#aaaaaa"
      });
      assert.equal(value, "#ffaaaaaa");
    });

    it('should handle colors with alpha', function() {
      var value = transforms["color/hex8android"].transformer({
        value: "#aaaaaa99"
      });
      assert.equal(value, "#99aaaaaa");
    });
  });

  describe('color/rgb', function() {
    it('should handle normal colors', function() {
      var value = transforms["color/rgb"].transformer({
        value: "#aaaaaa"
      });
      assert.equal(value, "rgb(170, 170, 170)");
    });

    it('should handle colors with transparency', function() {
      var value = transforms["color/rgb"].transformer({
        value: "#aaaaaa99"
      });
      assert.equal(value, "rgba(170, 170, 170, 0.6)");
    });
  });

  describe('color/UIColor', function() {
    it('should handle normal colors', function() {
      var value = transforms["color/UIColor"].transformer({
        value: "#aaaaaa"
      });
      assert.equal(value, "[UIColor colorWithRed:0.67f green:0.67f blue:0.67f alpha:1.00f]");
    });

    it('should handle colors with transparency', function() {
      var value = transforms["color/UIColor"].transformer({
        value: "#aaaaaa99"
      });
      assert.equal(value, "[UIColor colorWithRed:0.67f green:0.67f blue:0.67f alpha:0.60f]");
    });
  });


  describe('size/sp', function() {
    it('should work', function() {
      var value = transforms["size/sp"].transformer({
        value: "12px"
      });
      var value2 = transforms["size/sp"].transformer({
        value: "12"
      });
      assert.equal(value, "12.00sp");
      assert.equal(value2, "12.00sp");
    });
  });

  describe('size/dp', function() {
    it('should work', function() {
      var value = transforms["size/dp"].transformer({
        value: "12px"
      });
      var value2 = transforms["size/dp"].transformer({
        value: "12"
      });
      assert.equal(value, "12.00dp");
      assert.equal(value2, "12.00dp");
    });
  });

  describe('size/remToSp', function() {
    it('should work', function() {
      var value = transforms["size/remToSp"].transformer({
        value: "1"
      });
      assert.equal(value, "16.00sp");
    });
  });

  describe('size/remToDp', function() {
    it('should work', function() {
      var value = transforms["size/remToDp"].transformer({
        value: "1"
      });
      assert.equal(value, "16.00dp");
    });
  });

  describe('size/px', function() {
    it('should work', function() {
      var value = transforms["size/px"].transformer({
        value: "10"
      });
      assert.equal(value, "10px");
    });
  });

  describe('size/remToPt', function() {
    it('should work', function() {
      var value = transforms["size/remToPt"].transformer({
        value: "1"
      });
      assert.equal(value, "16.00f");
    });
  });

  describe('size/remToPx', function() {
    it('should work', function() {
      var value = transforms["size/remToPx"].transformer({
        value: "1"
      });
      assert.equal(value, "16px");
    });
  });

  describe('size/rem', function() {
    it('should work', function() {
      var value = transforms["size/rem"].transformer({
        value: "1"
      });
      assert.equal(value, "1rem");
    });
  });

  describe('content/quote', function() {
    it('should work', function() {
      var value = transforms["content/quote"].transformer({
        value: "hello"
      });
      assert.equal(value, "'hello'");
    });
  });

  describe('content/icon', function() {
    it('should work', function() {
      var value = transforms["content/icon"].transformer({
        value: "&#xE001;"
      });
      assert.equal(value, "'\\E001'");
    });
  });

  describe('content/objC/literal', function() {
    it('should work', function() {
      var value = transforms["content/objC/literal"].transformer({
        value: "hello"
      });
      assert.equal(value, '@"hello"');
    });
  });

  describe('asset/objC/literal', function() {
    it('should work', function() {
      var value = transforms["asset/objC/literal"].transformer({
        value: "hello"
      });
      assert.equal(value, '@"hello"');
    });
  });

  describe('font/objC/literal', function() {
    it('should work', function() {
      var value = transforms["font/objC/literal"].transformer({
        value: "hello"
      });
      assert.equal(value, '@"hello"');
    });
  });

  describe('time/seconds', function() {
    it('should work', function() {
      var value = transforms["time/seconds"].transformer({
        value: "1000"
      });
      assert.equal(value, "1.00s");
    });
  });

  describe('asset/path', function() {
    it('should work', function() {
      var value = transforms["asset/path"].transformer({
        value: "foo.json"
      });
      assert.equal(value, path.join(process.cwd(), "foo.json"));
    });
  });
});
