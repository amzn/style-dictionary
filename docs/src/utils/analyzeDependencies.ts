import { parse } from 'acorn';
import { asyncWalk } from 'estree-walker';

import type { Node } from 'estree-walker';

export async function analyzeDependencies(code: string) {
  let dependencies: Array<{
    source: string;
    specifiers: Array<{ name: string; default: boolean }>;
    package: string;
  }> = [];
  const ast = parse(code, {
    allowImportExportEverywhere: true,
    ecmaVersion: 'latest',
  }) as Node;

  await asyncWalk(ast, {
    enter: async (node) => {
      if (node.type === 'ImportDeclaration') {
        const source = `${node.source.value}`;
        dependencies.push({
          source: source,
          specifiers: node.specifiers.map((spec) => ({
            name: spec.local.name,
            default: spec.type === 'ImportDefaultSpecifier',
          })),
          package: source
            .split('/')
            .slice(0, source.startsWith('@') ? 2 : 1)
            .join('/'),
        });
      }
    },
  });
  return dependencies;
}
