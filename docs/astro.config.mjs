import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkPlayground } from './src/remark-playground';
import starlightConfig from './starlight-config';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight(starlightConfig)],
  markdown: {
    remarkPlugins: [remarkPlayground],
  },
  site: 'https://v4.styledictionary.com/',
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
  },
});
