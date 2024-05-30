import type { ExpressiveCodePlugin } from '@expressive-code/core';

export function pluginLanguageClass(): ExpressiveCodePlugin {
  return {
    name: 'PluginLanguageClass',
    hooks: {
      postprocessRenderedBlock: (opts) => {
        if (opts.codeBlock.language === 'mermaid') {
          const pre = opts.renderData.blockAst.children.find(
            (child) => child.type === 'element' && child.tagName === 'pre',
          );
          if (pre && pre.type === 'element') {
            // add the mermaid language class so mermaid can pick this up
            pre.properties = {
              class: `${opts.codeBlock.language} hidden`,
            };

            // replace the AST that expressive code has made and put back the simple text
            // otherwise mermaid gets confused by all of the generated HTML syntax
            pre.children = [
              {
                value: opts.codeBlock.code,
                type: 'text',
              },
            ];
          }
        }
      },
    },
  };
}
