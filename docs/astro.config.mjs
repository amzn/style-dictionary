import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkPlayground } from './src/remark-playground';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Style Dictionary',
      description:
        'Export your Design Tokens to any platform. iOS, Android, CSS, JS, HTML, sketch files, style documentation, or anything you can think of. Forward-compatible with Design Token Community Group spec.',
      logo: { src: '/src/assets/logo.png', alt: 'Style-Dictionary logo, Pascal the chameleon.' },
      editLink: {
        baseUrl: 'https://github.com/amzn/style-dictionary/edit/v4/src/content/docs/',
      },
      favicon: 'favicon.png',
      social: {
        github: 'https://github.com/amzn/style-dictionary',
        slack:
          'https://join.slack.com/t/tokens-studio/shared_invite/zt-1p8ea3m6t-C163oJcN9g3~YZTKRgo2hg',
      },
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: 'More info',
          autogenerate: { directory: 'info' },
        },
        {
          label: 'Reference',
          collapsed: true,
          items: [
            {
              label: 'API',
              link: '/reference/api',
            },
            {
              label: 'Configuration',
              link: '/reference/config',
            },
            {
              label: 'Logging',
              link: '/reference/logging',
            },
            {
              label: 'Hooks',
              collapsed: true,
              items: [
                { label: 'Parsers', link: '/reference/hooks/parsers' },
                { label: 'Preprocessors', link: '/reference/hooks/preprocessors' },
                {
                  label: 'Transforms',
                  collapsed: true,
                  items: [
                    { label: 'Overview', link: '/reference/hooks/transforms/' },
                    {
                      label: 'Built-in Transforms',
                      link: '/reference/hooks/transforms/predefined',
                    },
                  ],
                },
                {
                  label: 'Transform Groups',
                  collapsed: true,
                  items: [
                    { label: 'Overview', link: '/reference/hooks/transform-groups/' },
                    {
                      label: 'Built-in Transform Groups',
                      link: '/reference/hooks/transform-groups/predefined',
                    },
                  ],
                },
                {
                  label: 'Formats',
                  collapsed: true,
                  items: [
                    { label: 'Overview', link: '/reference/hooks/formats/' },
                    {
                      label: 'Format Helpers',
                      link: '/reference/hooks/formats/helpers',
                    },
                    {
                      label: 'Built-in Formats',
                      link: '/reference/hooks/formats/predefined',
                    },
                  ],
                },
                { label: 'Actions', link: '/reference/hooks/actions' },
              ],
            },
            {
              label: 'Utils',
              collapsed: true,
              items: [
                { label: 'Overview', link: '/reference/utils/' },
                { label: 'References', link: '/reference/utils/references' },
                { label: 'Tokens', link: '/reference/utils/tokens' },
                { label: 'Design Token Community Group', link: '/reference/utils/dtcg' },
              ],
            },
            {
              label: 'Types',
              link: '/reference/types',
            },
          ],
        },
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: '/src/load-playground.ts',
          },
        },
      ],
      customCss: ['./src/styles.css'],
    }),
  ],
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
  },
});
