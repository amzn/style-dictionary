import { expect } from 'chai';
import { stripMeta } from '../../lib/utils/stripMeta.js';

const tokens = {
  colors: {
    red: {
      500: {
        value: '#ff0000',
        type: 'color',
        path: ['colors', 'red', '500'],
        filePath: 'tokens.json',
        attributes: {
          foo: 'bar',
        },
        name: 'colors-red-500',
      },
    },
  },
  dimensions: {
    xs: {
      value: '15px',
      type: 'dimension',
      path: ['dimension', 'xs'],
      filePath: 'tokens.json',
      attributes: {
        foo: 'bar',
      },
      name: 'dimension-xs',
    },
  },
};

describe('utils', () => {
  describe('stripMeta', () => {
    it('should strip meta data properties that are supplied', async () => {
      await expect(
        JSON.stringify(
          stripMeta(tokens, { strip: ['path', 'filePath', 'attributes', 'name'] }),
          null,
          2,
        ),
      ).to.matchSnapshot();
    });

    it('supports passing an allowlist instead', async () => {
      await expect(
        JSON.stringify(stripMeta(tokens, { keep: ['value', 'type'] }), null, 2),
      ).to.matchSnapshot();
    });

    it('should only strip these properties on the token level, not group level', async () => {
      const groupTokens = {
        name: {
          red: {
            500: {
              value: '#ff0000',
              type: 'color',
              path: ['colors', 'red', '500'],
              filePath: 'tokens.json',
              attributes: {
                foo: 'bar',
              },
              name: 'colors-red-500',
            },
          },
        },
        dimensions: {
          attributes: {
            value: '15px',
            type: 'dimension',
            path: ['dimension', 'xs'],
            filePath: 'tokens.json',
            attributes: {
              foo: 'bar',
            },
            name: 'dimension-xs',
          },
        },
      };

      await expect(
        JSON.stringify(
          stripMeta(groupTokens, { strip: ['path', 'filePath', 'attributes', 'name'] }),
          null,
          2,
        ),
      ).to.matchSnapshot();
    });

    it('should work for DTCG formatted tokens', async () => {
      const DTCGTokens = {
        colors: {
          red: {
            500: {
              $value: '#ff0000',
              $type: 'color',
              path: ['colors', 'red', '500'],
              filePath: 'tokens.json',
              attributes: {
                foo: 'bar',
              },
              name: 'colors-red-500',
            },
          },
        },
        dimensions: {
          xs: {
            $value: '15px',
            $type: 'dimension',
            path: ['dimension', 'xs'],
            filePath: 'tokens.json',
            attributes: {
              foo: 'bar',
            },
            name: 'dimension-xs',
          },
        },
      };

      await expect(
        JSON.stringify(
          stripMeta(DTCGTokens, {
            strip: ['path', 'filePath', 'attributes', 'name'],
            usesDtcg: true,
          }),
          null,
          2,
        ),
      ).to.matchSnapshot();
    });

    it('should not mutate the input', async () => {
      stripMeta(tokens, { strip: ['path', 'filePath', 'attributes', 'name'] });
      expect(tokens).to.eql({
        colors: {
          red: {
            500: {
              value: '#ff0000',
              type: 'color',
              path: ['colors', 'red', '500'],
              filePath: 'tokens.json',
              attributes: {
                foo: 'bar',
              },
              name: 'colors-red-500',
            },
          },
        },
        dimensions: {
          xs: {
            value: '15px',
            type: 'dimension',
            path: ['dimension', 'xs'],
            filePath: 'tokens.json',
            attributes: {
              foo: 'bar',
            },
            name: 'dimension-xs',
          },
        },
      });
    });
  });
});
