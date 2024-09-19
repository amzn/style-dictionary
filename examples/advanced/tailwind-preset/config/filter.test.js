import { expect } from 'chai';
import { describe, it } from 'mocha';
import { isColor } from './filter.js';

describe('isColor', () => {
  it('should handle legacy and dtcg formats', () => {
    const token = { type: 'color' };
    expect(isColor(token, { usesDtcg: false })).to.equal(true);
    expect(isColor(token, { usesDtcg: true })).to.equal(false);

    const dtcgToken = { $type: 'color' };
    expect(isColor(dtcgToken, { usesDtcg: true })).to.equal(true);
    expect(isColor(dtcgToken, { usesDtcg: false })).to.equal(false);
  });
});
