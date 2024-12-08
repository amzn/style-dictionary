import { expect } from 'chai';
import { describe, it } from 'mocha';
import { isColor } from './filter.js';

describe('isColor', () => {
	it('should handle legacy and dtcg formats', () => {
		expect(isColor({ type: 'color' })).to.equal(true);
		expect(isColor({ $type: 'color' })).to.equal(true);
		expect(isColor({ type: 'fontSize' })).to.equal(false);
		expect(isColor({ $type: 'fontSize' })).to.equal(false);
	});
});
