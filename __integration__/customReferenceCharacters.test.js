const fs = require('fs-extra');
const StyleDictionary = require('../index');
const {buildPath} = require('./_constants');

describe('integration', () => {
  describe('custom reference characters', () => {
    StyleDictionary.extend({
      tokens: {
        color: {
          red: { value: '#f00' },
          error: { value: '🐈color/red/value🐈‍⬛' }
        },
        // this should NOT resolve
        test: { value: '{color.red.value}' }
      },
      separator: '/',
      opening_character: '🐈',
      closing_character: '🐈‍⬛',
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath,
          files: [{
            destination: 'variables.css',
            format: 'css/variables'
          }]
        }
      }
    }).buildAllPlatforms();
    const output = fs.readFileSync(`${buildPath}variables.css`, {encoding:'UTF-8'});
    it(`should match snapshot`, () => {
      expect(output).toMatchSnapshot();
    });
  });
});