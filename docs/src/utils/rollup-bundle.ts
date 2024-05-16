import * as sdFs from 'style-dictionary/fs';
import * as sdUtils from 'style-dictionary/utils';
import { fs } from 'style-dictionary/fs';
import { rollup } from '@rollup/browser';
import { v4 as uuidv4 } from 'uuid';
import StyleDictionary from 'style-dictionary';
import virtual from '@rollup/plugin-virtual';
import type { Plugin } from '@rollup/browser';

/**
 * We bundle Javascript strings as if they were actual Javascript files
 * - input as string instead of filepath (using virtual plugin)
 * - resolve imports to bare modules as third party dependencies to esm.run CDN,
 *   has some limitations of course, see esm.run for info
 * - any imports to style-dictionary are resolved to our version of style-dictionary in this app
 *   this is a bit spaghetti-written atm (abusing globals), and have to hardcode the different entrypoints,
 *   but it works :)
 * - we used to support relative imports to other JS files but for studio we don't need this, we have only
 *   one config, one functions file, and tokens are JSON
 */
export async function bundle(inputString: string, _fs = fs) {
  const sdName = uuidv4();
  const sdFsName = uuidv4();
  const sdUtilsName = uuidv4();
  // @ts-expect-error not allowed to put stuff on global with generated type string index
  globalThis[sdName] = StyleDictionary;
  // @ts-expect-error not allowed to put stuff on global with generated type string index
  globalThis[sdFsName] = sdFs;
  // @ts-expect-error not allowed to put stuff on global with generated type string index
  globalThis[sdUtilsName] = sdUtils;

  const rollupCfg = await rollup({
    input: 'mod',
    plugins: [
      virtual({
        mod: inputString,
      }) as Plugin,
      {
        name: 'resolve-bare-esm-run',
        async resolveId(id) {
          // if id is not relative or absolute or style-dictionary -> bare import to resolve from esm.run
          if (!id.match(/^(\/|\.).+$/g) && id !== 'style-dictionary') {
            return { id: `https://esm.run/${id}`, external: true };
          }
          return null;
        },
      },
      {
        name: 'sd-external',
        // Naive and simplified regex version of rollup externals global plugin just for style-dictionary imports..
        transform(code) {
          let rewrittenCode = code;
          const reg = /import (?<id>.+?) from [',"]style-dictionary(?<entrypoint>\/.+?)?[',"];?/;
          let matchRes;
          while ((matchRes = reg.exec(rewrittenCode)) !== null) {
            if (matchRes.groups) {
              let { id, entrypoint } = matchRes.groups;
              let namedImport = id;
              let originalNamedImport = id;
              let replacement = '';

              if (id.startsWith('{') && id.endsWith('}') && entrypoint) {
                id = id.replace('{', '').replace('}', '').trim();
                const entry = entrypoint.replace(/^\//, '');
                const asMatch = /(.+?) as (.+)/.exec(id);

                if (asMatch && asMatch[2]) {
                  [, originalNamedImport, namedImport] = asMatch;
                } else {
                  originalNamedImport = namedImport = id;
                }

                if (entry === 'fs') {
                  replacement = `globalThis['${sdFsName}']['${originalNamedImport}']`;
                } else if (entry === 'utils') {
                  replacement = `globalThis['${sdUtilsName}']['${originalNamedImport}']`;
                }
              } else {
                // Remove the import statement, replace the id wherever used with the global
                replacement = `globalThis['${sdName}']`;
              }
              rewrittenCode = rewrittenCode
                .replace(matchRes[0], '')
                .replace(new RegExp(namedImport, 'g'), replacement);
            }
          }

          return rewrittenCode;
        },
      },
    ],
  });
  const bundle = await rollupCfg.generate({ format: 'es' });
  return bundle.output[0].code;
}
