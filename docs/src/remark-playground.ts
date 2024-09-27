import type { Root, Html, Paragraph, Code } from 'mdast';
import { visit, type Visitor } from 'unist-util-visit';

const paragraphVisitor: Visitor = (node, index, parent) => {
  if (node.type === 'paragraph') {
    const _node = node as Paragraph;
    if (
      _node.children[0].type === 'text' &&
      _node.children[0].value === '~ sd-playground' &&
      index &&
      parent
    ) {
      const serialize = (v: { value?: string; lang?: string }) =>
        JSON.stringify(v).replace(/"/g, '&#x22;');
      let tokensData = serialize({});
      let configData = serialize({});
      let scriptData = serialize({});
      let skipAmount = 1;
      let defaultSelected;

      for (const child of parent.children.slice(index + 1, index + 4)) {
        if (child.type !== 'code') break;
        const codeNode = child as Code;
        if (codeNode.meta) {
          const metas = codeNode.meta?.split(' ');
          switch (metas[0]) {
            case 'tokens':
              tokensData = serialize({
                value: codeNode.value,
                lang: codeNode.lang ?? 'text',
              });
              break;
            case 'script':
              scriptData = serialize({
                value: codeNode.value,
                lang: codeNode.lang ?? 'text',
              });
              break;
            case 'config':
              configData = serialize({
                value: codeNode.value,
                lang: codeNode.lang ?? 'text',
              });
              break;
          }
          if (metas[1] === 'selected') {
            defaultSelected = metas[0];
          }
        }

        skipAmount++;
      }

      const newNode = {
        type: 'html',
        value: `<sd-playground
          tokens="${tokensData}"
          config="${configData}"
          script="${scriptData}"${
            defaultSelected
              ? `
          default-selected="${defaultSelected}"`
              : ''
          }
        ><div style="height: 100%" slot="monaco-editor"></div></sd-playground>`,
      } as Html;
      parent.children.splice(index, skipAmount, newNode);
    }
  }
};

export function remarkPlayground() {
  function transformer(tree: Root) {
    visit(tree, 'paragraph', paragraphVisitor);
    return tree;
  }

  return transformer;
}
