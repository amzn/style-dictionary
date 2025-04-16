import { expect } from 'chai';
import minifyDictionary from '../../../lib/common/formatHelpers/minifyDictionary.js';

describe('formatHelpers', () => {
  describe('minifyDictionary', () => {
    const tokens = {
      color: {
        red: {
          value: '#ff0000',
          type: 'color',
          comment: 'This is red',
        },
      },
      size: {
        small: {
          value: '10px',
          type: 'size',
        },
      },
    };

    const tokensDTCG = {
      color: {
        red: {
          $value: '#ff0000',
          $type: 'color',
        },
      },
      size: {
        small: {
          $value: '10px',
          $type: 'size',
        },
      },
    };

    const nestedValueTokens = {
      color: {
        primary: {
          value: {
            value: '#ff0000',
            type: 'color',
          },
        },
      },
      size: {
        small: {
          value: '10px',
          type: 'size',
        },
      },
    };

    it('should strip out everything except values', () => {
      const expected = {
        color: {
          red: '#ff0000',
        },
        size: {
          small: '10px',
        },
      };

      expect(minifyDictionary(tokens)).to.deep.equal(expected);
    });

    it('should handle DTCG syntax', () => {
      const expected = {
        color: {
          red: '#ff0000',
        },
        size: {
          small: '10px',
        },
      };

      expect(minifyDictionary(tokensDTCG, true)).to.deep.equal(expected);
    });

    it('should handle nested value properties', () => {
      // Test standard syntax
      expect(minifyDictionary(nestedValueTokens)).to.deep.equal({
        color: {
          primary: {
            value: '#ff0000',
          },
        },
        size: {
          small: '10px',
        },
      });
    });
  });
});
