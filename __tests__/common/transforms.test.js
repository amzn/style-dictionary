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

var transforms = require('../../lib/common/transforms');
var path = require('path');
var Color = require('tinycolor2');

describe('common', () => {
  describe('transforms', () => {

    describe('name/cti/camel', () => {
      it('should handle prefix', () => {
        expect(transforms["name/cti/camel"].transformer(
          {
            path: ['one','two','three']
          },{
            prefix: 'prefix'
          }
        )).toBe('prefixOneTwoThree');
      });

      it('should handle no prefix', () => {
        expect(transforms["name/cti/camel"].transformer(
          {
            path: ['one','two','three']
          },{
          }
        )).toBe('oneTwoThree');
      });
    });

    describe('name/ti/camel', () => {
      it('should handle prefix', () => {
        expect(transforms["name/ti/camel"].transformer(
          {
            path: ['one','two','three']
          },{
            prefix: 'prefix'
          }
        )).toBe('prefixTwoThree');
      });

      it('should handle no prefix', () => {
        expect(transforms["name/ti/camel"].transformer(
          {
            path: ['one','two','three']
          },{
          }
        )).toBe('twoThree');
      });
    });

    describe('name/cti/kebab', () => {
      it('should handle prefix', () => {
        expect(transforms["name/cti/kebab"].transformer(
          {
            path: ['one','two','three']
          },{
            prefix: 'prefix'
          }
        )).toBe('prefix-one-two-three');
      });

      it('should handle no prefix', () => {
        expect(transforms["name/cti/kebab"].transformer(
          {
            path: ['one','two','three']
          },{
          }
        )).toBe('one-two-three');
      });
    });

    describe('name/cti/snake', () => {
      it('should handle prefix', () => {
        expect(transforms["name/cti/snake"].transformer(
          {
            path: ['one','two','three']
          },{
            prefix: 'prefix'
          }
        )).toBe('prefix_one_two_three');
      });

      it('should handle no prefix', () => {
        expect(transforms["name/cti/snake"].transformer(
          {
            path: ['one','two','three']
          },{
          }
        )).toBe('one_two_three');
      });
    });

    describe('name/cti/constant', () => {
      it('should handle prefix', () => {
        expect(transforms["name/cti/constant"].transformer(
          {
            path: ['one','two','three']
          },{
            prefix: 'prefix'
          }
        )).toBe('PREFIX_ONE_TWO_THREE');
      });

      it('should handle no prefix', () => {
        expect(transforms["name/cti/constant"].transformer(
          {
            path: ['one','two','three']
          },{
          }
        )).toBe('ONE_TWO_THREE');
      });
    });

    describe('name/ti/constant', () => {
      it('should handle prefix', () => {
        expect(transforms["name/ti/constant"].transformer(
          {
            path: ['one','two','three']
          },{
            prefix: 'prefix'
          }
        )).toBe('PREFIX_TWO_THREE');
      });

      it('should handle no prefix', () => {
        expect(transforms["name/ti/constant"].transformer(
          {
            path: ['one','two','three']
          },{
          }
        )).toBe('TWO_THREE');
      });
    });

    describe('attribute/color', () => {
      it('should handle normal colors', () => {
        var attributes = transforms["attribute/color"].transformer({
          value: "#aaaaaa"
        });
        expect(attributes).toHaveProperty('rgb.a', 1);
        expect(attributes).toHaveProperty('rgb.r', 170);
        expect(attributes).toHaveProperty('hsl.s', 0);
      });
      it('should handle colors with transparency', () => {
        var attributes = transforms["attribute/color"].transformer({
          value: "#aaaaaa99"
        });
        var attributes2 = transforms["attribute/color"].transformer({
          value: "rgba(170,170,170,0.6)"
        });
        expect(attributes).toHaveProperty('rgb.a', 0.6);
        expect(attributes).toHaveProperty('rgb.r', 170);
        expect(attributes).toHaveProperty('hsl.s', 0);
        expect(attributes2).toHaveProperty('rgb.a', 0.6);
        expect(attributes2).toHaveProperty('rgb.r', 170);
        expect(attributes2).toHaveProperty('hsl.s', 0);
      });
    });

    describe('transform', () => {
      describe('attribute/cti', () => {

        const prop = {
          "path": ["color", "background", "button", "primary", "active", "extra"],
        };
        const propShort = { "path": ["color", "primary"] };
        const propOverride = {
          "path": ["button", "primary", "border", "width"],
          "attributes": { "category": "size", "component": "button" }
        };

        const attrs = transforms["attribute/cti"].transformer(prop);
        const attrsShort = transforms["attribute/cti"].transformer(propShort);
        const attrsOverride = transforms["attribute/cti"].transformer(propOverride);

        it('should assign attributes correctly', () => {
          expect(attrs).toEqual({
            "category": "color",
            "type": "background",
            "item": "button",
            "subitem": "primary",
            "state": "active"
          });
        });

        it('should not assign path props when path is short' , () => {
          expect(attrsShort).toEqual({
            "category": "color",
            "type": "primary"
          });
        });

        it('should leave other attributes alone', () => {
          expect(attrsOverride).toHaveProperty('component', 'button');
        });

        it('should not override previously assigned path attributes', () => {
          expect(attrsOverride).toHaveProperty('category', 'size');
        });
      });
    });

    describe('color/hex', () => {
      it('should handle hex colors', () => {
        var value = transforms["color/hex"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("#aaaaaa");
      });

      it('should handle hex8 colors', () => {
        var value = transforms["color/hex"].transformer({
          value: "#aaaaaaaa"
        });
        expect(value).toBe("#aaaaaa");
      });

      it('should handle rgb colors', () => {
        var value = transforms["color/hex"].transformer({
          value: "rgb(170,170,170)"
        });
        expect(value).toBe("#aaaaaa");
      });

      it('should handle rgb (object) colors', () => {
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
        expect(value).toBe("#aaaaaa");
        expect(value2).toBe("#aaaaaa");
      });

      it('should handle hsl colors', () => {
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
        expect(value).toBe("#808080");
        expect(value2).toBe("#808080");
      });
    });


    describe('color/hex8', () => {
      it('should handle hex colors', () => {
        var value = transforms["color/hex8"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("#aaaaaaff");
      });

      it('should handle rgb colors', () => {
        var value = transforms["color/hex8"].transformer({
          value: "rgb(170,170,170)"
        });
        expect(value).toBe("#aaaaaaff");
      });

      it('should handle rgba colors', () => {
        var value = transforms["color/hex8"].transformer({
          value: "rgba(170,170,170,0.6)"
        });
        expect(value).toBe("#aaaaaa99");
      });
    });

    describe('color/hex8android', () => {
      it('should handle colors without alpha', () => {
        var value = transforms["color/hex8android"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("#ffaaaaaa");
      });

      it('should handle colors with alpha', () => {
        var value = transforms["color/hex8android"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("#99aaaaaa");
      });
    });

    describe('color/rgb', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/rgb"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("rgb(170, 170, 170)");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/rgb"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("rgba(170, 170, 170, 0.6)");
      });
    });

    describe('color/hsl-4', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/hsl-4"].transformer({
          value: "#009688"
        });
        expect(value).toBe("hsl(174 100% 29%)");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/hsl-4"].transformer({
          value: "#00968899"
        });
        expect(value).toBe("hsl(174 100% 29% / 0.6)");
      });
    });

    describe('color/hsl', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/hsl"].transformer({
          value: "#009688"
        });
        expect(value).toBe("hsl(174, 100%, 29%)");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/hsl"].transformer({
          value: "#00968899"
        });
        expect(value).toBe("hsla(174, 100%, 29%, 0.6)");
      });
    });

    describe('color/composeColor', () => {
      it('should handle color without alpha', () => {
        var value = transforms["color/composeColor"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("Color(0xffaaaaaa)");
      });

      it('should handle color with alpha', () => {
        var value = transforms["color/composeColor"].transformer({
          value: "#aaaaaaff"
        });
        expect(value).toBe("Color(0xffaaaaaa)");
      });

    });

    describe('color/UIColor', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/UIColor"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("[UIColor colorWithRed:0.667f green:0.667f blue:0.667f alpha:1.000f]");
      });

      it('should retain enough precision when converting to decimal', () => {
        var value = transforms["color/UIColor"].transformer({
          value: "#1d1d1d"
        });
        expect(value).toBe("[UIColor colorWithRed:0.114f green:0.114f blue:0.114f alpha:1.000f]");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/UIColor"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("[UIColor colorWithRed:0.667f green:0.667f blue:0.667f alpha:0.600f]");
      });
    });

    describe('color/UIColorSwift', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/UIColorSwift"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 1)");
      });

      it('should retain enough precision when converting to decimal', () => {
        var value = transforms["color/UIColorSwift"].transformer({
          value: "#1d1d1d"
        });
        expect(value).toBe("UIColor(red: 0.114, green: 0.114, blue: 0.114, alpha: 1)");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/UIColorSwift"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 0.6)");
      });
    });

    describe('color/ColorSwiftUI', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/ColorSwiftUI"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 1)");
      });

      it('should retain enough precision when converting to decimal', () => {
        var value = transforms["color/ColorSwiftUI"].transformer({
          value: "#1d1d1d"
        });
        expect(value).toBe("Color(red: 0.114, green: 0.114, blue: 0.114, opacity: 1)");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/ColorSwiftUI"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 0.6)");
      });
    });

    describe('color/hex8flutter', () => {
      it('should handle colors without alpha', () => {
        var value = transforms["color/hex8flutter"].transformer({
          value: "#aaaaaa"
        });
        expect(value).toBe("Color(0xFFAAAAAA)");
      });

      it('should handle colors with alpha', () => {
        var value = transforms["color/hex8flutter"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("Color(0x99AAAAAA)");
      });
    });

    describe('color/css', () => {
      it('should handle normal colors', () => {
        var value = transforms["color/css"].transformer({
          value: "rgb(170, 170, 170)"
        });
        expect(value).toBe("#aaaaaa");
      });

      it('should handle colors with transparency', () => {
        var value = transforms["color/css"].transformer({
          value: "#aaaaaa99"
        });
        expect(value).toBe("rgba(170, 170, 170, 0.6)");
      });
    });

    describe('color/sketch', () => {
      it('should retain hex specificity', () => {
        var originalHex = "#0b7dbb";
        var value = transforms["color/sketch"].transformer({
          original: {
            value: originalHex
          }
        });
        var newHex = Color({
          r: value.red * 255,
          g: value.green * 255,
          b: value.blue * 255
        });
        expect(originalHex).toEqual(newHex.toHexString());
      });
    });

    describe('size/sp', () => {
      it('should work', () => {
        var value = transforms["size/sp"].transformer({
          value: "12px"
        });
        var value2 = transforms["size/sp"].transformer({
          value: "12"
        });
        expect(value).toBe("12.00sp");
        expect(value2).toBe("12.00sp");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/sp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/dp', () => {
      it('should work', () => {
        var value = transforms["size/dp"].transformer({
          value: "12px"
        });
        var value2 = transforms["size/dp"].transformer({
          value: "12"
        });
        expect(value).toBe("12.00dp");
        expect(value2).toBe("12.00dp");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe("size/object", () => {
      it("should work", () => {
        var value = transforms["size/object"].transformer({
          value: "1px"
        });
        expect(value.original).toBe("1px");
        expect(value.number).toBe(1);
        expect(value.decimal).toEqual(0.01);
        expect(value.scale).toBe(16);
      });
      it('should work with custom base font', () => {
        var value = transforms["size/object"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value.original).toBe("1");
        expect(value.number).toBe(1);
        expect(value.decimal).toEqual(0.01);
        expect(value.scale).toBe(14);
      })
      it('should throw an error if prop value is NaN', () => {
        expect( () => transforms["size/object"].transformer({value: "a"})).toThrow();
      })
    });

    describe('size/remToSp', () => {
      it('should work', () => {
        var value = transforms["size/remToSp"].transformer({
          value: "1"
        });
        expect(value).toBe("16.00sp");
      });
      it('converts rem to sp using custom base font', () => {
        var value = transforms["size/remToSp"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14.00sp");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/remToDp', () => {
      it('should work', () => {
        var value = transforms["size/remToDp"].transformer({
          value: "1"
        });
        expect(value).toBe("16.00dp");
      });
      it('converts rem to dp using custom base font', () => {
        var value = transforms["size/remToDp"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14.00dp");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/px', () => {
      it('should work', () => {
        var value = transforms["size/px"].transformer({
          value: "10"
        });
        expect(value).toBe("10px");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/remToPt', () => {
      it('should work', () => {
        var value = transforms["size/remToPt"].transformer({
          value: "1"
        });
        expect(value).toBe("16.00f");
      });
      it('converts rem to pt using custom base font', () => {
        var value = transforms["size/remToPt"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14.00f");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/compose/remToSp', () => {
      it('should work', () => {
        var value = transforms["size/compose/remToSp"].transformer({
          value: "1"
        });
        expect(value).toBe("16.00.sp");
      });
      it('converts rem to sp using custom base font', () => {
        var value = transforms["size/compose/remToSp"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14.00.sp");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/compose/remToSp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/compose/em', () => {
      it('should work', () => {
        var value = transforms["size/compose/em"].transformer({
          value: "10"
        });
        expect(value).toBe("10.em");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/compose/em"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/compose/remToDp', () => {
      it('should work', () => {
        var value = transforms["size/compose/remToDp"].transformer({
          value: "1"
        });
        expect(value).toBe("16.00.dp");
      });
      it('converts rem to dp using custom base font', () => {
        var value = transforms["size/compose/remToDp"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14.00.dp");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/compose/remToDp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/swift/remToCGFloat', () => {
      it('should work', () => {
        var value = transforms["size/swift/remToCGFloat"].transformer({
          value: "1"
        });
        expect(value).toBe("CGFloat(16.00)");
      });
      it('converts rem to CGFloat using custom base font', () => {
        var value = transforms["size/swift/remToCGFloat"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("CGFloat(14.00)");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/rem/remToCGFloat"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/remToPx', () => {
      it('should work', () => {
        var value = transforms["size/remToPx"].transformer({
          value: "1"
        });
        expect(value).toBe("16px");
      });
      it('converts rem to px using custom base font', () => {
        var value = transforms["size/remToPx"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14px");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/pxToRem', () => {
      const pxToRemTransformer = transforms["size/pxToRem"].transformer;

      ['12', '12px', '12rem'].forEach((value) => {
        it(`ignoring unit, scales "${value}" to rem`, () => {
          expect(pxToRemTransformer({value})).toBe('0.75rem');
        });
      });
      it('converts pixel to rem using custom base font', () => {
        expect(pxToRemTransformer({value: '14px'}, {basePxFontSize: 14})).toBe('1rem');
      });
      ['0', '0px', '0rem'].forEach((value) => {
          it(`zero value "${value}" is returned without a unit`, () => {
              expect(pxToRemTransformer({value})).toBe('0');
          });
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => pxToRemTransformer({value: "a"})).toThrow();
      });
    });

    describe('size/rem', () => {
      it('should work', () => {
        var value = transforms["size/rem"].transformer({
          value: "1"
        });
        expect(value).toBe("1rem");
      });
      it('should throw an error if prop value is Nan', () => {
        expect( () => transforms["size/dp"].transformer({value: "a"})).toThrow();
      });
    });

    describe('size/flutter/remToDouble', () => {
      it('should work', () => {
        var value = transforms["size/flutter/remToDouble"].transformer({
          value: "1"
        });
        expect(value).toBe("16.00");
      });
      it('converts rem to double using custom base font', () => {
        var value = transforms["size/flutter/remToDouble"].transformer({value: "1"}, {basePxFontSize: 14});
        expect(value).toBe("14.00");
      });
    });

    describe('content/quote', () => {
      it('should work', () => {
        var value = transforms["content/quote"].transformer({
          value: "hello"
        });
        expect(value).toBe("'hello'");
      });
    });

    describe('content/icon', () => {
      it('should work', () => {
        var value = transforms["content/icon"].transformer({
          value: "&#xE001;"
        });
        expect(value).toBe("'\\E001'");
      });
    });

    describe('content/objC/literal', () => {
      it('should work', () => {
        var value = transforms["content/objC/literal"].transformer({
          value: "hello"
        });
        expect(value).toBe('@"hello"');
      });
    });

    describe('asset/objC/literal', () => {
      it('should work', () => {
        var value = transforms["asset/objC/literal"].transformer({
          value: "hello"
        });
        expect(value).toBe('@"hello"');
      });
    });

    describe('font/objC/literal', () => {
      it('should work', () => {
        var value = transforms["font/objC/literal"].transformer({
          value: "hello"
        });
        expect(value).toBe('@"hello"');
      });
    });

    describe('time/seconds', () => {
      it('should work', () => {
        var value = transforms["time/seconds"].transformer({
          value: "1000"
        });
        expect(value).toBe("1.00s");
      });
    });

    describe('asset/path', () => {
      it('should work', () => {
        var value = transforms["asset/path"].transformer({
          value: "foo.json"
        });
        expect(value).toBe(path.join(process.cwd(), "foo.json"));
      });
    });

  });
});
