import ts from 'typescript';

export const canHaveName = (node: ts.Node): node is ts.Node & { name: ts.Identifier } => {
  const nodeWithName = node as ts.Node & { name?: ts.Node };
  return nodeWithName.name !== undefined && ts.isIdentifier(nodeWithName.name);
};
