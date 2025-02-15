declare module "__module__ExportSpecifierExample" {
declare namespace TypeAliasDeclarationExample {
    const getBlaBla: <T>(num: number) => T;
    export type SomeType2<T = unknown> = Record<string, string> & {
        blabbla: ReturnType<typeof getBlaBla>;
        export: "bla";
    };
    type Loader<T extends [
        ...any
    ]> = {
        (...args: T): void;
        load?: (...args: T) => boolean;
    };
    interface SomeObject<T extends [
        ...any
    ]> {
        loader(fn: Loader<T>): () => void;
        delete(...args: T): void;
    }
    export type TypeWithGeneric<T> = SomeObject<T[]>;
    export {};
}
export { TypeAliasDeclarationExample };
}
