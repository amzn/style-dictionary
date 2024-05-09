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
import { expect } from 'chai';
import { join } from 'path-unified';
import Color from 'tinycolor2';
import transforms, { isColor } from '../../lib/common/transforms.js';

describe('common', () => {
  describe('transforms', () => {
    describe('name/camel', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/camel'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            },
          ),
        ).to.equal('prefixOneTwoThree');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/camel'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {},
          ),
        ).to.equal('oneTwoThree');
      });
    });

    describe('name/kebab', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/kebab'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            },
          ),
        ).to.equal('prefix-one-two-three');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/kebab'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {},
          ),
        ).to.equal('one-two-three');
      });
    });

    describe('name/snake', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/snake'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            },
          ),
        ).to.equal('prefix_one_two_three');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/snake'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {},
          ),
        ).to.equal('one_two_three');
      });
    });

    describe('name/constant', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/constant'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            },
          ),
        ).to.equal('PREFIX_ONE_TWO_THREE');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/constant'].transform(
            {
              path: ['one', 'two', 'three'],
            },
            {},
          ),
        ).to.equal('ONE_TWO_THREE');
      });
    });

    describe('attribute/color', () => {
      it('should handle normal colors', () => {
        const attributes = transforms['attribute/color'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(attributes).to.have.nested.property('rgb.a', 1);
        expect(attributes).to.have.nested.property('rgb.r', 170);
        expect(attributes).to.have.nested.property('hsl.s', 0);
      });
      it('should handle colors with transparency', () => {
        const attributes = transforms['attribute/color'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        const attributes2 = transforms['attribute/color'].transform(
          {
            value: 'rgba(170,170,170,0.6)',
          },
          {},
          {},
        );
        expect(attributes).to.have.nested.property('rgb.a', 0.6);
        expect(attributes).to.have.nested.property('rgb.r', 170);
        expect(attributes).to.have.nested.property('hsl.s', 0);
        expect(attributes2).to.have.nested.property('rgb.a', 0.6);
        expect(attributes2).to.have.nested.property('rgb.r', 170);
        expect(attributes2).to.have.nested.property('hsl.s', 0);
      });
    });

    describe('transform', () => {
      describe('attribute/cti', () => {
        const prop = {
          path: ['color', 'background', 'button', 'primary', 'active', 'extra'],
        };
        const propShort = { path: ['color', 'primary'] };
        const propOverride = {
          path: ['button', 'primary', 'border', 'width'],
          attributes: { category: 'size', component: 'button' },
        };

        const attrs = transforms['attribute/cti'].transform(prop, {}, {});
        const attrsShort = transforms['attribute/cti'].transform(propShort, {}, {});
        const attrsOverride = transforms['attribute/cti'].transform(propOverride, {}, {});

        it('should assign attributes correctly', () => {
          expect(attrs).eql({
            category: 'color',
            type: 'background',
            item: 'button',
            subitem: 'primary',
            state: 'active',
          });
        });

        it('should not assign path props when path is short', () => {
          expect(attrsShort).eql({
            category: 'color',
            type: 'primary',
          });
        });

        it('should leave other attributes alone', () => {
          expect(attrsOverride).to.have.property('component', 'button');
        });

        it('should not override previously assigned path attributes', () => {
          expect(attrsOverride).to.have.property('category', 'size');
        });
      });
    });

    describe('color/hex', () => {
      it('should handle hex colors', () => {
        const value = transforms['color/hex'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaa');
      });

      it('should handle hex8 colors', () => {
        const value = transforms['color/hex'].transform(
          {
            value: '#aaaaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaa');
      });

      it('should handle rgb colors', () => {
        const value = transforms['color/hex'].transform(
          {
            value: 'rgb(170,170,170)',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaa');
      });

      it('should handle rgb (object) colors', () => {
        const value = transforms['color/hex'].transform(
          {
            value: {
              r: '170',
              g: '170',
              b: '170',
            },
          },
          {},
          {},
        );
        const value2 = transforms['color/hex'].transform(
          {
            value: 'rgb(170,170,170)',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaa');
        expect(value2).to.equal('#aaaaaa');
      });

      it('should handle hsl colors', () => {
        const value = transforms['color/hex'].transform(
          {
            value: {
              h: '0',
              s: '0',
              l: '0.5',
            },
          },
          {},
          {},
        );
        const value2 = transforms['color/hex'].transform(
          {
            value: 'hsl(0,0,0.5)',
          },
          {},
          {},
        );
        expect(value).to.equal('#808080');
        expect(value2).to.equal('#808080');
      });
    });

    describe('color/hex8', () => {
      it('should handle hex colors', () => {
        const value = transforms['color/hex8'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaaff');
      });

      it('should handle rgb colors', () => {
        const value = transforms['color/hex8'].transform(
          {
            value: 'rgb(170,170,170)',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaaff');
      });

      it('should handle rgba colors', () => {
        const value = transforms['color/hex8'].transform(
          {
            value: 'rgba(170,170,170,0.6)',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaa99');
      });
    });

    describe('color/hex8android', () => {
      it('should handle colors without alpha', () => {
        const value = transforms['color/hex8android'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('#ffaaaaaa');
      });

      it('should handle colors with alpha', () => {
        const value = transforms['color/hex8android'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal('#99aaaaaa');
      });
    });

    describe('color/rgb', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/rgb'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('rgb(170, 170, 170)');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/rgb'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal('rgba(170, 170, 170, 0.6)');
      });
    });

    describe('color/hsl-4', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/hsl-4'].transform(
          {
            value: '#009688',
          },
          {},
          {},
        );
        expect(value).to.equal('hsl(174 100% 29%)');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/hsl-4'].transform(
          {
            value: '#00968899',
          },
          {},
          {},
        );
        expect(value).to.equal('hsl(174 100% 29% / 0.6)');
      });
    });

    describe('color/hsl', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/hsl'].transform(
          {
            value: '#009688',
          },
          {},
          {},
        );
        expect(value).to.equal('hsl(174, 100%, 29%)');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/hsl'].transform(
          {
            value: '#00968899',
          },
          {},
          {},
        );
        expect(value).to.equal('hsla(174, 100%, 29%, 0.6)');
      });
    });

    describe('color/composeColor', () => {
      it('should handle color without alpha', () => {
        const value = transforms['color/composeColor'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(0xffaaaaaa)');
      });

      it('should handle color with alpha', () => {
        const value = transforms['color/composeColor'].transform(
          {
            value: '#aaaaaaff',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(0xffaaaaaa)');
      });
    });

    describe('color/UIColor', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/UIColor'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal(
          '[UIColor colorWithRed:0.667f green:0.667f blue:0.667f alpha:1.000f]',
        );
      });

      it('should retain enough precision when converting to decimal', () => {
        const value = transforms['color/UIColor'].transform(
          {
            value: '#1d1d1d',
          },
          {},
          {},
        );
        expect(value).to.equal(
          '[UIColor colorWithRed:0.114f green:0.114f blue:0.114f alpha:1.000f]',
        );
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/UIColor'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal(
          '[UIColor colorWithRed:0.667f green:0.667f blue:0.667f alpha:0.600f]',
        );
      });
    });

    describe('color/UIColorSwift', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/UIColorSwift'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 1)');
      });

      it('should retain enough precision when converting to decimal', () => {
        const value = transforms['color/UIColorSwift'].transform(
          {
            value: '#1d1d1d',
          },
          {},
          {},
        );
        expect(value).to.equal('UIColor(red: 0.114, green: 0.114, blue: 0.114, alpha: 1)');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/UIColorSwift'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal('UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 0.6)');
      });
    });

    describe('color/ColorSwiftUI', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/ColorSwiftUI'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 1)');
      });

      it('should retain enough precision when converting to decimal', () => {
        const value = transforms['color/ColorSwiftUI'].transform(
          {
            value: '#1d1d1d',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(red: 0.114, green: 0.114, blue: 0.114, opacity: 1)');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/ColorSwiftUI'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 0.6)');
      });
    });

    describe('color/hex8flutter', () => {
      it('should handle colors without alpha', () => {
        const value = transforms['color/hex8flutter'].transform(
          {
            value: '#aaaaaa',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(0xFFAAAAAA)');
      });

      it('should handle colors with alpha', () => {
        const value = transforms['color/hex8flutter'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal('Color(0x99AAAAAA)');
      });
    });

    describe('color/css', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/css'].transform(
          {
            value: 'rgb(170, 170, 170)',
          },
          {},
          {},
        );
        expect(value).to.equal('#aaaaaa');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/css'].transform(
          {
            value: '#aaaaaa99',
          },
          {},
          {},
        );
        expect(value).to.equal('rgba(170, 170, 170, 0.6)');
      });
    });

    describe('color/sketch', () => {
      it('should retain hex specificity', () => {
        const originalHex = '#0b7dbb';
        const value = transforms['color/sketch'].transform(
          {
            value: originalHex,
          },
          {},
          {},
        );
        const newHex = Color({
          r: value.red * 255,
          g: value.green * 255,
          b: value.blue * 255,
        });
        expect(originalHex).equal(newHex.toHexString());
      });
    });

    describe('size/sp', () => {
      it('should work', () => {
        const value = transforms['size/sp'].transform(
          {
            value: '12px',
          },
          {},
          {},
        );
        const value2 = transforms['size/sp'].transform(
          {
            value: '12',
          },
          {},
          {},
        );
        expect(value).to.equal('12.00sp');
        expect(value2).to.equal('12.00sp');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/sp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/dp', () => {
      it('should work', () => {
        const value = transforms['size/dp'].transform(
          {
            value: '12px',
          },
          {},
          {},
        );
        const value2 = transforms['size/dp'].transform(
          {
            value: '12',
          },
          {},
          {},
        );
        expect(value).to.equal('12.00dp');
        expect(value2).to.equal('12.00dp');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' })).to.throw();
      });
    });

    describe('size/object', () => {
      it('should work', () => {
        const value = transforms['size/object'].transform(
          {
            value: '1px',
          },
          {},
          {},
        );
        expect(value.original).to.equal('1px');
        expect(value.number).to.equal(1);
        expect(value.decimal).equal(0.01);
        expect(value.scale).to.equal(16);
      });
      it('should work with custom base font', () => {
        const value = transforms['size/object'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value.original).to.equal('1');
        expect(value.number).to.equal(1);
        expect(value.decimal).equal(0.01);
        expect(value.scale).to.equal(14);
      });
      it('should throw an error if prop value is NaN', () => {
        expect(() => transforms['size/object'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/remToSp', () => {
      it('should work', () => {
        const value = transforms['size/remToSp'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16.00sp');
      });
      it('converts rem to sp using custom base font', () => {
        const value = transforms['size/remToSp'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14.00sp');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/remToDp', () => {
      it('should work', () => {
        const value = transforms['size/remToDp'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16.00dp');
      });
      it('converts rem to dp using custom base font', () => {
        const value = transforms['size/remToDp'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14.00dp');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/px', () => {
      it('should work', () => {
        const value = transforms['size/px'].transform(
          {
            value: '10',
          },
          {},
          {},
        );
        expect(value).to.equal('10px');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/remToPt', () => {
      it('should work', () => {
        const value = transforms['size/remToPt'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16.00f');
      });
      it('converts rem to pt using custom base font', () => {
        const value = transforms['size/remToPt'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14.00f');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/compose/remToSp', () => {
      it('should work', () => {
        const value = transforms['size/compose/remToSp'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16.00.sp');
      });
      it('converts rem to sp using custom base font', () => {
        const value = transforms['size/compose/remToSp'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14.00.sp');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() =>
          transforms['size/compose/remToSp'].transform({ value: 'a' }, {}, {}),
        ).to.throw();
      });
    });

    describe('size/compose/em', () => {
      it('should work', () => {
        const value = transforms['size/compose/em'].transform(
          {
            value: '10',
          },
          {},
          {},
        );
        expect(value).to.equal('10.em');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/compose/em'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/compose/remToDp', () => {
      it('should work', () => {
        const value = transforms['size/compose/remToDp'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16.00.dp');
      });
      it('converts rem to dp using custom base font', () => {
        const value = transforms['size/compose/remToDp'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14.00.dp');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() =>
          transforms['size/compose/remToDp'].transform({ value: 'a' }, {}, {}),
        ).to.throw();
      });
    });

    describe('size/swift/remToCGFloat', () => {
      it('should work', () => {
        const value = transforms['size/swift/remToCGFloat'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('CGFloat(16.00)');
      });
      it('converts rem to CGFloat using custom base font', () => {
        const value = transforms['size/swift/remToCGFloat'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('CGFloat(14.00)');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() =>
          transforms['size/rem/remToCGFloat'].transform({ value: 'a' }, {}, {}),
        ).to.throw();
      });
    });

    describe('size/remToPx', () => {
      it('should work', () => {
        const value = transforms['size/remToPx'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16px');
      });
      it('converts rem to px using custom base font', () => {
        const value = transforms['size/remToPx'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14px');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/pxToRem', () => {
      const pxToRemtransform = transforms['size/pxToRem'].transform;

      ['12', '12px', '12rem'].forEach((value) => {
        it(`ignoring unit, scales "${value}" to rem`, () => {
          expect(pxToRemtransform({ value }, {}, {})).to.equal('0.75rem');
        });
      });
      it('converts pixel to rem using custom base font', () => {
        expect(pxToRemtransform({ value: '14px' }, { basePxFontSize: 14 }, {})).to.equal('1rem');
      });
      ['0', '0px', '0rem'].forEach((value) => {
        it(`zero value "${value}" is returned without a unit`, () => {
          expect(pxToRemtransform({ value }, {}, {})).to.equal('0');
        });
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => pxToRemtransform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/rem', () => {
      it('should work', () => {
        const value = transforms['size/rem'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('1rem');
      });
      it('should throw an error if prop value is Nan', () => {
        expect(() => transforms['size/dp'].transform({ value: 'a' }, {}, {})).to.throw();
      });
    });

    describe('size/flutter/remToDouble', () => {
      it('should work', () => {
        const value = transforms['size/flutter/remToDouble'].transform(
          {
            value: '1',
          },
          {},
          {},
        );
        expect(value).to.equal('16.00');
      });
      it('converts rem to double using custom base font', () => {
        const value = transforms['size/flutter/remToDouble'].transform(
          { value: '1' },
          { basePxFontSize: 14 },
          {},
        );
        expect(value).to.equal('14.00');
      });
    });

    describe('content/quote', () => {
      it('should work', () => {
        const value = transforms['content/quote'].transform(
          {
            value: 'hello',
          },
          {},
          {},
        );
        expect(value).to.equal("'hello'");
      });
    });

    describe('html/icon', () => {
      it('should work', () => {
        const value = transforms['html/icon'].transform(
          {
            value: '&#xE001;',
          },
          {},
          {},
        );
        expect(value).to.equal("'\\E001'");
      });
    });

    describe('content/objC/literal', () => {
      it('should work', () => {
        const value = transforms['content/objC/literal'].transform(
          {
            value: 'hello',
          },
          {},
          {},
        );
        expect(value).to.equal('@"hello"');
      });
    });

    describe('asset/url', () => {
      it('should work', () => {
        const value = transforms['asset/url'].transform(
          {
            value: 'https://example.com',
          },
          {},
          {},
        );
        expect(value).to.equal('url("https://example.com")');
      });

      it('should escape double quotes', () => {
        const value = transforms['asset/url'].transform(
          {
            value:
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="90" height="45"%3E%3Cpath d="M10 10h60" stroke="%2300F" stroke-width="5"/%3E%3Cpath d="M10 20h60" stroke="%230F0" stroke-width="5"/%3E%3Cpath d="M10 30h60" stroke="red" stroke-width="5"/%3E%3C/svg%3E"',
          },
          {},
          {},
        );
        expect(value).to.equal(
          'url("data:image/svg+xml,%3Csvg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"90\\" height=\\"45\\"%3E%3Cpath d=\\"M10 10h60\\" stroke=\\"%2300F\\" stroke-width=\\"5\\"/%3E%3Cpath d=\\"M10 20h60\\" stroke=\\"%230F0\\" stroke-width=\\"5\\"/%3E%3Cpath d=\\"M10 30h60\\" stroke=\\"red\\" stroke-width=\\"5\\"/%3E%3C/svg%3E\\"")',
        );
      });
    });

    describe('asset/objC/literal', () => {
      it('should work', () => {
        const value = transforms['asset/objC/literal'].transform(
          {
            value: 'hello',
          },
          {},
          {},
        );
        expect(value).to.equal('@"hello"');
      });
    });

    describe('time/seconds', () => {
      it('should work', () => {
        const value = transforms['time/seconds'].transform(
          {
            value: '1000',
          },
          {},
          {},
        );
        expect(value).to.equal('1.00s');
      });
    });

    // FIXME: find a browser/node cross compatible way to transform local path
    // current implementation incorrectly uses process.cwd() rather than using
    // the filePath of the token to determine where the asset is located relative to the token that refers to it
    describe.skip('asset/path', () => {
      it('should work', () => {
        const value = transforms['asset/path'].transform(
          {
            value: 'foo.json',
          },
          {},
          {},
        );
        expect(value).to.equal(join('foo.json'));
      });
    });
  });

  describe('transform filters', () => {
    describe('isColor', () => {
      it('should match short hex colors', () => {
        expect(isColor({ type: 'color', value: '369' })).to.be.true;
        expect(isColor({ type: 'color', value: '#369' })).to.be.true;
      });

      it('should match standard hex colors', () => {
        expect(isColor({ type: 'color', value: 'e66465' })).to.be.true;
        expect(isColor({ type: 'color', value: '#e66465' })).to.be.true;
      });

      it('should match 8-digit hex colors', () => {
        expect(isColor({ type: 'color', value: 'e66465FF' })).to.be.true;
        expect(isColor({ type: 'color', value: '#e66465FF' })).to.be.true;
      });

      it('should match legacy rgb/rgba colors', () => {
        expect(isColor({ type: 'color', value: 'rgb(132, 99, 255)' })).to.be.true;
        expect(isColor({ type: 'color', value: 'rgb(132, 99, 255, 0.5)' })).to.be.true;
        expect(isColor({ type: 'color', value: 'rgba(132, 99, 255, 0.5)' })).to.be.true;
      });

      it('should match rgb colors', () => {
        expect(isColor({ type: 'color', value: 'rgb(132 99 255)' })).to.be.true;
        expect(isColor({ type: 'color', value: 'rgb(132 99 255 / .5)' })).to.be.true;
        expect(isColor({ type: 'color', value: 'rgb(132 99 255 / 50%)' })).to.be.true;
      });

      it('should match legacy hsl/hsla colors', () => {
        expect(isColor({ type: 'color', value: 'hsl(30, 100%, 50%, 0.6)' })).to.be.true;
        expect(isColor({ type: 'color', value: 'hsla(30, 100%, 50%, 0.6)' })).to.be.true;
      });

      it('should match hsl colors', () => {
        expect(isColor({ type: 'color', value: 'hsl(30 100% 50% / .6)' })).to.be.true;
        expect(isColor({ type: 'color', value: 'hsl(30.2 100% 50% / 60%)' })).to.be.true;
      });

      it('should match named colors', () => {
        expect(isColor({ type: 'color', value: 'red' })).to.be.true;
      });

      it('should ignore gradients', () => {
        expect(isColor({ type: 'color', value: 'linear-gradient(#e66465, #9198e5)' })).to.be.false;
      });

      it('should ignore values that cannot convert to a color', () => {
        expect(isColor({ type: 'color', value: 'currentColor' })).to.be.false;
      });
    });
  });
});
