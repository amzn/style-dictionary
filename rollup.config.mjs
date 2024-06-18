import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import externals from 'rollup-plugin-node-externals';

// common config settings
const input = ['src/index.ts', 'src/fs.ts', 'src/fs-node.ts', 'src/utils/index.ts'];
const sourceMap = false;
const tsconfig = 'tsconfig.json';

const esmOutputDir = 'dist/esm';

const config = defineConfig([
  // CJS config
  {
    input,
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [externals(), typescript({ declarationDir: 'dist/types', sourceMap, tsconfig })],
  },
  // ESM config
  {
    input,
    output: {
      dir: esmOutputDir,
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      externals(),
      typescript({
        outDir: esmOutputDir,
        declaration: false,
        sourceMap,
        tsconfig,
      }),
    ],
  },
]);
export default config;
