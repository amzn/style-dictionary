import { expect } from 'chai';
import { rgbChannels } from './transformer.mjs';

describe('transformer', () => {
  it('should extract RGB channels from valid RGB string', () => {
    const token = { value: 'rgb(255, 255, 255)' };
    const result = rgbChannels(token);
    expect(result).to.equal('255 255 255');
  });

  it('should throw error for invalid RGB string', () => {
    const token = { value: 'mock' };
    expect(() => rgbChannels(token)).to.throw("Value 'mock' is not a valid rgb format.");
  });
});
