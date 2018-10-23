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

const path = require('path');
const transforms = require('../../lib/common/transforms');

describe('common', () => {
  describe('transforms', () => {
    describe('name/cti/camel', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/cti/camel'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            }
          )
        ).toBe('prefixOneTwoThree');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/cti/camel'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {}
          )
        ).toBe('oneTwoThree');
      });
    });

    describe('name/cti/kebab', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/cti/kebab'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            }
          )
        ).toBe('prefix-one-two-three');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/cti/kebab'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {}
          )
        ).toBe('one-two-three');
      });
    });

    describe('name/cti/snake', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/cti/snake'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            }
          )
        ).toBe('prefix_one_two_three');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/cti/snake'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {}
          )
        ).toBe('one_two_three');
      });
    });

    describe('name/cti/constant', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/cti/constant'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            }
          )
        ).toBe('PREFIX_ONE_TWO_THREE');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/cti/constant'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {}
          )
        ).toBe('ONE_TWO_THREE');
      });
    });

    describe('name/ti/constant', () => {
      it('should handle prefix', () => {
        expect(
          transforms['name/ti/constant'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {
              prefix: 'prefix',
            }
          )
        ).toBe('PREFIX_TWO_THREE');
      });

      it('should handle no prefix', () => {
        expect(
          transforms['name/ti/constant'].transformer(
            {
              path: ['one', 'two', 'three'],
            },
            {}
          )
        ).toBe('TWO_THREE');
      });
    });

    describe('attribute/color', () => {
      it('should handle normal colors', () => {
        const attributes = transforms['attribute/color'].transformer({
          value: '#aaaaaa',
        });
        expect(attributes).toHaveProperty('rgb.a', 1);
        expect(attributes).toHaveProperty('rgb.r', 170);
        expect(attributes).toHaveProperty('hsl.s', 0);
      });
      it('should handle colors with transparency', () => {
        const attributes = transforms['attribute/color'].transformer({
          value: '#aaaaaa99',
        });
        const attributes2 = transforms['attribute/color'].transformer({
          value: 'rgba(170,170,170,0.6)',
        });
        expect(attributes).toHaveProperty('rgb.a', 0.6);
        expect(attributes).toHaveProperty('rgb.r', 170);
        expect(attributes).toHaveProperty('hsl.s', 0);
        expect(attributes2).toHaveProperty('rgb.a', 0.6);
        expect(attributes2).toHaveProperty('rgb.r', 170);
        expect(attributes2).toHaveProperty('hsl.s', 0);
      });
    });

    describe('color/hex', () => {
      it('should handle hex colors', () => {
        const value = transforms['color/hex'].transformer({
          value: '#aaaaaa',
        });
        expect(value).toBe('#aaaaaa');
      });

      it('should handle hex8 colors', () => {
        const value = transforms['color/hex'].transformer({
          value: '#aaaaaaaa',
        });
        expect(value).toBe('#aaaaaa');
      });

      it('should handle rgb colors', () => {
        const value = transforms['color/hex'].transformer({
          value: 'rgb(170,170,170)',
        });
        expect(value).toBe('#aaaaaa');
      });

      it('should handle rgb (object) colors', () => {
        const value = transforms['color/hex'].transformer({
          value: {
            r: '170',
            g: '170',
            b: '170',
          },
        });
        const value2 = transforms['color/hex'].transformer({
          value: 'rgb(170,170,170)',
        });
        expect(value).toBe('#aaaaaa');
        expect(value2).toBe('#aaaaaa');
      });

      it('should handle hsl colors', () => {
        const value = transforms['color/hex'].transformer({
          value: {
            h: '0',
            s: '0',
            l: '0.5',
          },
        });
        const value2 = transforms['color/hex'].transformer({
          value: 'hsl(0,0,0.5)',
        });
        expect(value).toBe('#808080');
        expect(value2).toBe('#808080');
      });
    });

    describe('color/hex8', () => {
      it('should handle hex colors', () => {
        const value = transforms['color/hex8'].transformer({
          value: '#aaaaaa',
        });
        expect(value).toBe('#aaaaaaff');
      });

      it('should handle rgb colors', () => {
        const value = transforms['color/hex8'].transformer({
          value: 'rgb(170,170,170)',
        });
        expect(value).toBe('#aaaaaaff');
      });

      it('should handle rgb colors', () => {
        const value = transforms['color/hex8'].transformer({
          value: 'rgb(170,170,170)',
        });
        const value2 = transforms['color/hex8'].transformer({
          value: 'rgba(170,170,170,0.6)',
        });
        expect(value).toBe('#aaaaaaff');
        expect(value2).toBe('#aaaaaa99');
      });
    });

    describe('color/hex8android', () => {
      it('should handle colors without alpha', () => {
        const value = transforms['color/hex8android'].transformer({
          value: '#aaaaaa',
        });
        expect(value).toBe('#ffaaaaaa');
      });

      it('should handle colors with alpha', () => {
        const value = transforms['color/hex8android'].transformer({
          value: '#aaaaaa99',
        });
        expect(value).toBe('#99aaaaaa');
      });
    });

    describe('color/rgb', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/rgb'].transformer({
          value: '#aaaaaa',
        });
        expect(value).toBe('rgb(170, 170, 170)');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/rgb'].transformer({
          value: '#aaaaaa99',
        });
        expect(value).toBe('rgba(170, 170, 170, 0.6)');
      });
    });

    describe('color/UIColor', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/UIColor'].transformer({
          value: '#aaaaaa',
        });
        expect(value).toBe('[UIColor colorWithRed:0.67f green:0.67f blue:0.67f alpha:1.00f]');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/UIColor'].transformer({
          value: '#aaaaaa99',
        });
        expect(value).toBe('[UIColor colorWithRed:0.67f green:0.67f blue:0.67f alpha:0.60f]');
      });
    });

    describe('color/css', () => {
      it('should handle normal colors', () => {
        const value = transforms['color/css'].transformer({
          value: 'rgb(170, 170, 170)',
        });
        expect(value).toBe('#aaaaaa');
      });

      it('should handle colors with transparency', () => {
        const value = transforms['color/css'].transformer({
          value: '#aaaaaa99',
        });
        expect(value).toBe('rgba(170, 170, 170, 0.6)');
      });
    });

    describe('size/sp', () => {
      it('should work', () => {
        const value = transforms['size/sp'].transformer({
          value: '12px',
        });
        const value2 = transforms['size/sp'].transformer({
          value: '12',
        });
        expect(value).toBe('12.00sp');
        expect(value2).toBe('12.00sp');
      });
    });

    describe('size/dp', () => {
      it('should work', () => {
        const value = transforms['size/dp'].transformer({
          value: '12px',
        });
        const value2 = transforms['size/dp'].transformer({
          value: '12',
        });
        expect(value).toBe('12.00dp');
        expect(value2).toBe('12.00dp');
      });
    });

    describe('size/remToSp', () => {
      it('should work', () => {
        const value = transforms['size/remToSp'].transformer({
          value: '1',
        });
        expect(value).toBe('16.00sp');
      });
    });

    describe('size/remToDp', () => {
      it('should work', () => {
        const value = transforms['size/remToDp'].transformer({
          value: '1',
        });
        expect(value).toBe('16.00dp');
      });
    });

    describe('size/px', () => {
      it('should work', () => {
        const value = transforms['size/px'].transformer({
          value: '10',
        });
        expect(value).toBe('10px');
      });
    });

    describe('size/remToPt', () => {
      it('should work', () => {
        const value = transforms['size/remToPt'].transformer({
          value: '1',
        });
        expect(value).toBe('16.00f');
      });
    });

    describe('size/remToPx', () => {
      it('should work', () => {
        const value = transforms['size/remToPx'].transformer({
          value: '1',
        });
        expect(value).toBe('16px');
      });
    });

    describe('size/rem', () => {
      it('should work', () => {
        const value = transforms['size/rem'].transformer({
          value: '1',
        });
        expect(value).toBe('1rem');
      });
    });

    describe('content/quote', () => {
      it('should work', () => {
        const value = transforms['content/quote'].transformer({
          value: 'hello',
        });
        expect(value).toBe("'hello'");
      });
    });

    describe('content/icon', () => {
      it('should work', () => {
        const value = transforms['content/icon'].transformer({
          value: '&#xE001;',
        });
        expect(value).toBe("'\\E001'");
      });
    });

    describe('content/objC/literal', () => {
      it('should work', () => {
        const value = transforms['content/objC/literal'].transformer({
          value: 'hello',
        });
        expect(value).toBe('@"hello"');
      });
    });

    describe('asset/objC/literal', () => {
      it('should work', () => {
        const value = transforms['asset/objC/literal'].transformer({
          value: 'hello',
        });
        expect(value).toBe('@"hello"');
      });
    });

    describe('font/objC/literal', () => {
      it('should work', () => {
        const value = transforms['font/objC/literal'].transformer({
          value: 'hello',
        });
        expect(value).toBe('@"hello"');
      });
    });

    describe('time/seconds', () => {
      it('should work', () => {
        const value = transforms['time/seconds'].transformer({
          value: '1000',
        });
        expect(value).toBe('1.00s');
      });
    });

    describe('asset/path', () => {
      it('should work', () => {
        const value = transforms['asset/path'].transformer({
          value: 'foo.json',
        });
        expect(value).toBe(path.join(process.cwd(), 'foo.json'));
      });
    });
  });
});
