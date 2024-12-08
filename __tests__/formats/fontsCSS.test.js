import { expect } from 'chai';
import cssFontsTemplate from '../../lib/common/templates/css/fonts.css.template.js';

describe('formats', () => {
  describe('fonts/css', () => {
    it('should produce a valid css font-face declaration without weight or style defined', async () => {
      const tokens = {
        asset: {
          font: {
            myFont: {
              name: {
                value: 'font',
                type: 'fontFamily',
              },
              ttf: {
                value: 'font.ttf',
                type: 'asset',
              },
            },
          },
        },
      };
      const output = cssFontsTemplate(tokens);
      await expect(output).to.matchSnapshot();
    });

    it('should produce a valid css font-face declaration with a weight defined', async () => {
      const tokens = {
        asset: {
          font: {
            myFont: {
              name: {
                value: 'font',
                type: 'fontFamily',
              },
              ttf: {
                value: 'font.ttf',
                type: 'asset',
              },
              weight: {
                value: 400,
              },
            },
          },
        },
      };
      const output = cssFontsTemplate(tokens);
      await expect(output).to.matchSnapshot();
    });

    it('should produce a valid css font-face declaration with a style defined', async () => {
      const tokens = {
        asset: {
          font: {
            myFont: {
              name: {
                value: 'font',
                type: 'fontFamily',
              },
              ttf: {
                value: 'font.ttf',
                type: 'asset',
              },
              style: {
                value: 'normal',
              },
            },
          },
        },
      };
      const output = cssFontsTemplate(tokens);
      await expect(output).to.matchSnapshot();
    });

    it('should produce a valid css font-face declaration with both style and weight defined', async () => {
      const tokens = {
        asset: {
          font: {
            myFont: {
              name: {
                value: 'font',
                type: 'fontFamily',
              },
              ttf: {
                value: 'font.ttf',
                type: 'asset',
              },
              style: {
                value: 'normal',
              },
              weight: {
                value: 400,
              },
            },
          },
        },
      };
      const output = cssFontsTemplate(tokens);
      await expect(output).to.matchSnapshot();
    });
  });
});
