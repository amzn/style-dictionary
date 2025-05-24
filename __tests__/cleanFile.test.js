import { expect } from 'chai';
import { fileExists, clearOutput } from './__helpers.js';
import cleanFile from '../lib/cleanFile.js';
import StyleDictionary from '../lib/StyleDictionary.js';

describe('cleanFile', () => {
  const buildPath = '__tests__/__output/';
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should delete a file properly', async () => {
    const file = { destination: 'test.txt', format: 'foo' };
    const sd = new StyleDictionary({
      hooks: {
        formats: {
          foo: () => 'hi',
        },
      },
      platforms: {
        bar: {
          buildPath,
          files: [file],
        },
      },
    });
    await sd.buildPlatform('bar');
    cleanFile(file, { buildPath });
    expect(fileExists('__tests__/__output/test.txt')).to.be.false;
  });

  describe('if a file does not exist', () => {
    it('should not throw', () => {
      expect(() =>
        cleanFile({ destination: 'non-existent.txt', format: 'foo' }, { buildPath }, {}),
      ).to.not.throw();
    });
  });
});
