import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkPlayground } from './src/remark-playground';
import starlightConfig from './starlight-config';

// https://astro.build/config
export default defineConfig({
  outDir: '../docs', // necessary folder for Github Pages
  integrations: [starlight(starlightConfig)],
  markdown: {
    remarkPlugins: [remarkPlayground],
  },
  vite: {
    force: true,
    server: {
      force: true,
    },
    optimizeDeps: {
      // coz we're doing monkeypatching deps quite often at this stage of this POC
      force: true,
      // due to WASM bindings
      exclude: ['@rollup/browser'],
      esbuildOptions: {
        // to support top-level-await
        target: 'esnext',
      },
    },
    build: {
      modulePreload: { polyfill: false },
      minify: false,
    },
  },
});
