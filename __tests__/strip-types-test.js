import assert from 'node:assert';
import StyleDictionary from 'style-dictionary';

// Just a quick and dirty smoke test to check that the experimental strip type flag allows using TS tokens files

// this config also uses ".ts" tokens paths
const sd = new StyleDictionary('__tests__/__configs/test.ts');
await sd.hasInitialized;

assert.deepEqual(sd.tokens, {
  colors: {
    red: {
      500: {
        $type: 'color',
        $value: '#ff0000',
        filePath: '__tests__/__json_files/tokens.ts',
        isSource: true,
      },
    },
  },
});
