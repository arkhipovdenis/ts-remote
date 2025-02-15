export enum SomeEnum {}
// export * from '@mocks/ClassDeclarationExample';
export type A = typeof import('@mocks/ClassDeclarationExample').TestClassDeclarationExample<123>;
export default {} as any;
