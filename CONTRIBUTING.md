# Contributing to ts-remote

Thanks for your interest in contributing to ts-remote! This document describes the process and guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/ts-remote.git
   cd ts-remote
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

### Prerequisites

- Node.js (LTS)
- pnpm
- TypeScript >= 4.9

### Project Structure

```
packages/
  builder/    # Core builder — build function, emitter, public API
  shared/     # Shared utilities — errors, logger
examples/     # Usage examples
scripts/      # Build scripts
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm run typecheck` | Type-check without emitting |
| `pnpm run build` | Build the project (runs typecheck first) |
| `pnpm run test:compile` | Run compilation tests |
| `pnpm run prettier:check` | Check code formatting |
| `pnpm run prettier:fix` | Auto-fix code formatting |

### Code Style

The project uses [Prettier](https://prettier.io/) for formatting. Key settings:

- Single quotes
- 2-space indentation
- 100 character line width
- Trailing commas
- Semicolons

Run `pnpm run prettier:fix` before committing.

## Making Changes

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes
3. Ensure everything passes:
   ```bash
   pnpm run typecheck
   pnpm run prettier:check
   pnpm run test:compile
   ```
4. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` — new feature
   - `fix:` — bug fix
   - `docs:` — documentation changes
   - `chore:` — maintenance, build, tooling
   - `test:` — adding or updating tests
   - `refactor:` — code changes that neither fix a bug nor add a feature

## Submitting a Pull Request

1. Push your branch to your fork
2. Open a Pull Request against the `main` branch
3. Describe what your changes do and why
4. Reference any related issues

## Reporting Issues

- Use [GitHub Issues](https://github.com/TheMontanyes/ts-remote/issues) to report bugs or request features
- Include a minimal reproduction when reporting bugs
- Describe expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
