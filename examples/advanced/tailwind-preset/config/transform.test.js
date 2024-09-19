import { expect } from 'chai';
import { describe, it } from 'mocha';
import { rgbChannels } from './transform.js';

describe('rgbChannels', () => {
  it('should extract RGB channels from valid RGB string', () => {
    const token = { value: 'rgb(255, 255, 255)' };
    expect(rgbChannels(token, { usesDtcg: false })).to.equal('255 255 255');

    const dtcgToken = { $value: 'rgb(1, 2, 3)' };
    expect(rgbChannels(dtcgToken, { usesDtcg: true })).to.equal('1 2 3');
  });

  it('should throw error for invalid RGB string', () => {
    const expectedErr = "Value 'mock' is not a valid rgb format.";

    const token = { value: 'mock' };
    expect(() => rgbChannels(token, { usesDtcg: false })).to.throw(expectedErr);

    const dtcgToken = { $value: 'mock' };
    expect(() => rgbChannels(dtcgToken, { usesDtcg: true })).to.throw(expectedErr);
  });
});
