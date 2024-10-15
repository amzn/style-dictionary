import { expect } from 'chai';
import { describe, it } from 'mocha';
import { isColor } from './filter.js';

describe('isColor', () => {
  it('should handle legacy and dtcg formats', () => {
    expect(isColor({ type: 'color' }, { usesDtcg: false })).to.equal(true);
    expect(isColor({ type: 'color' }, { usesDtcg: true })).to.equal(false);
    expect(isColor({ type: 'fontSize' }, { usesDtcg: false })).to.equal(false);

    expect(isColor({ $type: 'color' }, { usesDtcg: true })).to.equal(true);
    expect(isColor({ $type: 'color' }, { usesDtcg: false })).to.equal(false);
    expect(isColor({ $type: 'fontSize' }, { usesDtcg: true })).to.equal(false);
  });
});
