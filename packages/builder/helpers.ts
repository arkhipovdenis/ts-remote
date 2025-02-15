import ts from 'typescript';

export const canHaveName = (node: ts.Node): node is ts.Node & { name: ts.Identifier } =>
  ts.isIdentifier((node as any).name);
