import { expect } from 'chai';
import { describe, it } from 'mocha';
import { rgbChannels } from './transform.js';

describe('rgbChannels', () => {
	it('should extract RGB channels from valid RGB string', () => {
		const tokenValue = 'rgb(255, 255, 255)';
		expect(rgbChannels({ value: tokenValue })).to.equal('255 255 255');
		expect(rgbChannels({ $value: tokenValue })).to.equal('255 255 255');
	});

	it('should extract RGB and alpha channels from valid RGBA string', () => {
		const tokenValue = 'rgba(255, 255, 255, 0.5)';
		expect(rgbChannels({ value: tokenValue })).to.equal('255 255 255 / 0.5');
		expect(rgbChannels({ $value: tokenValue })).to.equal('255 255 255 / 0.5');
	});

	it('should handle different whitespace variations', () => {
		let tokenValue = 'rgb( 123 ,  45,67 )';
		expect(rgbChannels({ value: tokenValue })).to.equal('123 45 67');
		tokenValue = 'rgba( 12, 34 , 56 , 0.75 )';
		expect(rgbChannels({ value: tokenValue })).to.equal('12 34 56 / 0.75');
	});

	it('should handle different alpha formats', () => {
		const tokenValues = ['rgb(1, 2, 3, 50%)', 'rgb(1, 2, 3, .5)', 'rgb(1, 2, 3, .50)'];
		for (const tokenValue of tokenValues) {
			expect(rgbChannels({ value: tokenValue })).to.equal('1 2 3 / 0.5');
		}
	});

	it('should throw error for invalid RGB string', () => {
		const expectedErr = "Value 'mock' is not a valid rgb or rgba format.";
		expect(() => rgbChannels({ value: 'mock' })).to.throw(expectedErr);
		expect(() => rgbChannels({ $value: 'mock' })).to.throw(expectedErr);
	});
});
