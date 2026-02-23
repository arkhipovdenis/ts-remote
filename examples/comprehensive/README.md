# Comprehensive TypeScript Syntax Example

This example demonstrates ts-remote's ability to handle the full spectrum of TypeScript syntax and language features.

## Purpose

This is a comprehensive test suite covering all possible TypeScript constructs that can appear in `.d.ts` files, organized by SyntaxKind categories.

## Files

### `src/declarations.ts`
**Basic Declarations**
- VariableDeclaration (const, let, var)
- FunctionDeclaration
- FunctionExpression
- ArrowFunction
- ClassDeclaration
- Constructor
- MethodDeclaration
- GetAccessor / SetAccessor
- PropertyDeclaration
- AbstractClass
- Parameter properties

### `src/types.ts`
**Type Declarations**
- InterfaceDeclaration
- TypeAliasDeclaration
- EnumDeclaration (numeric, string, const, computed)
- ModuleDeclaration (namespace)
- UnionType
- IntersectionType
- TupleType
- ArrayType
- LiteralType
- IndexSignature
- CallSignature
- ConstructSignature

### `src/advanced-types.ts`
**Advanced Type Expressions**
- ConditionalType
- MappedType
- TemplateLiteralType
- TypeAssertion / AsExpression
- SatisfiesExpression
- InferType
- IndexedAccessType
- KeyofTypeOperator
- TypeofTypeOperator
- Intrinsic string manipulation types
- Recursive types
- Variance annotations (in/out)

### `src/generics.ts`
**Generic Types**
- Generic functions
- Generic interfaces
- Generic classes
- Generic type aliases
- Type constraints (extends)
- Default type parameters
- Multiple type parameters
- Variadic tuple types
- Generic factory patterns
- This types in generics

### `src/modifiers.ts`
**Modifiers and Access Control**
- Access modifiers (public, private, protected)
- Readonly modifier
- Optional modifier
- Abstract modifier
- Async modifier
- Static modifier
- Override modifier
- Declare modifier
- Export modifiers
- Default export
- Re-exports

## Running the Example

```bash
# From the project root
npm run build

# Run the comprehensive example
ts-node examples/comprehensive/build.ts
```

## Expected Output

The build script generates `dist/comprehensive.d.ts` containing module declarations for:
- `declarations` - All basic declaration types
- `types` - All type declaration forms
- `advanced-types` - Complex type expressions
- `generics` - Generic type patterns
- `modifiers` - All modifier combinations

## Use Case

This example serves as:
1. **Test suite** - Validates ts-remote handles all TypeScript syntax
2. **Reference** - Shows how different TypeScript constructs are emitted in `.d.ts` files
3. **Debugging tool** - Helps identify edge cases and potential issues
4. **Documentation** - Demonstrates the full capabilities of ts-remote

## Coverage

This example covers all major TypeScript SyntaxKind nodes that can appear in declaration files:

**Declarations**: VariableDeclaration, FunctionDeclaration, ClassDeclaration, InterfaceDeclaration, TypeAliasDeclaration, EnumDeclaration, ModuleDeclaration, MethodDeclaration, PropertyDeclaration, Constructor, GetAccessor, SetAccessor, Parameter

**Types**: TypeReference, UnionType, IntersectionType, TupleType, ArrayType, FunctionType, ConditionalType, MappedType, TemplateLiteralType, LiteralType, IndexedAccessType, TypeOperator, InferType

**Expressions**: ArrowFunction, FunctionExpression, AsExpression, SatisfiesExpression, TypeAssertion

**Modifiers**: PublicKeyword, PrivateKeyword, ProtectedKeyword, ReadonlyKeyword, StaticKeyword, AbstractKeyword, AsyncKeyword, ExportKeyword, DeclareKeyword, OverrideKeyword

**Special**: TypeParameter, TypePredicate, IndexSignature, CallSignature, ConstructSignature, ParameterProperty, NamespaceExport, ExportAssignment

## Validation

After running the build, you can:

1. Check the generated `.d.ts` file for correctness
2. Verify all TypeScript features are properly emitted
3. Ensure private/protected members are filtered correctly
4. Validate type relationships are preserved
5. Confirm imports are resolved properly
