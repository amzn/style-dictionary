import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace'
import visualizer from 'rollup-plugin-visualizer';
import commonjs from '@rollup/plugin-commonjs'
import inject from '@rollup/plugin-inject'
import json from '@rollup/plugin-json'
import * as fs from 'fs'
import * as path from 'path'

const nodeResolve = resolve({
  mainFields: ['module', 'jsnext:main', 'browser'],
  preferBuiltins: false,
  dedupe: ['postcss'],
});

const EMPTY_MODULE_ID = '$empty$';
const EMPTY_MODULE = `export default {}`;

// from browserify/lib/buildtins.js
const BROWSERIFY_ALIASES = {
  assert: 'assert',
  events: 'events',
  fs: EMPTY_MODULE_ID,
  module: EMPTY_MODULE_ID,
  path: 'path-browserify',
  process: 'process',
  util: 'util',
};

const aliases = {
  'json5': EMPTY_MODULE_ID,
  'json5/lib/register': EMPTY_MODULE_ID,
};

const plugins = [
  {
    resolveId(source, importer) {
      if (source in BROWSERIFY_ALIASES) {
        if (BROWSERIFY_ALIASES[source] === EMPTY_MODULE_ID)
          return EMPTY_MODULE_ID;
        return nodeResolve.resolveId(BROWSERIFY_ALIASES[source], undefined);
      }
      if (source in aliases) {
        if (aliases[source] === EMPTY_MODULE_ID) return EMPTY_MODULE_ID;
        return nodeResolve.resolveId(aliases[source], importer);
      }
      if (source === EMPTY_MODULE_ID) return EMPTY_MODULE_ID;
    },
    load(id) {
      if (id === EMPTY_MODULE_ID) return EMPTY_MODULE;
    },
  },
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.platform': JSON.stringify('linux'),
      'process.env.LANG': JSON.stringify('en'),
    },
  }),
  inject({
    process: 'process',
  }),
  nodeResolve,
  visualizer({summaryOnly:true}),
  commonjs({
    transformMixedEsModules: true,
    requireReturnsDefault: "auto"
  }),
  json(),
  {
    name: 'inline-fs',
    transform(code, id) {
      return code.replace(/fs.readFileSync\(\s*__dirname\s*\+\s*'\/templates\/(.*)'\)/g, (match, $1) => {
        const tpl = path.join('./lib/common/templates',$1);
        return JSON.stringify(fs.readFileSync(tpl,'utf8'))
      });
    }}
];
export default {
  input: "build.js",
  output: {
    format: "umd",
    name:"__style_dictionary__",
    file: "dist/index.js",
    globals: {
      'lodash': '_',
    },
  },
  plugins,
};