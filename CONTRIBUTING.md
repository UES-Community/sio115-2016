# Contributing to SIO115-2016

Thank you for contributing to the **Sistemas Operativos** (SIO115-2016) educational platform.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- [pnpm](https://pnpm.io/) 10 or later

### Local Setup

```bash
git clone https://github.com/UES-Community/sio115-2016.git
cd sio115-2016
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Useful Commands

| Command       | Description                    |
| ------------- | ------------------------------ |
| `pnpm dev`    | Start development server       |
| `pnpm build`  | Create production build        |
| `pnpm start`  | Serve production build         |
| `pnpm lint`   | Run ESLint                     |

> **Note:** This project requires pnpm. Using npm or yarn will be blocked by the `preinstall` script.

## Development Workflow

1. **Find or create an issue** — Check [open issues](https://github.com/UES-Community/sio115-2016/issues) before starting work.
2. **Create a branch** — Use descriptive names such as `feat/unidad-2-crypto-lab` or `fix/navbar-mobile-menu`.
3. **Make focused changes** — Keep pull requests small and scoped to a single concern.
4. **Test locally** — Ensure `pnpm dev` and `pnpm build` succeed before submitting.
5. **Open a pull request** — Reference the related issue (e.g. `Closes #3`).

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`.

Examples:

```
feat(crypto): add AES encryption lab component
fix(navbar): close mobile menu on route change
docs: update setup instructions for pnpm
```

## Pull Request Guidelines

- Write a clear title and description explaining **what** changed and **why**.
- Include a test plan with steps to verify the change.
- Link related issues using keywords like `Closes #N` or `Fixes #N`.
- Ensure the branch is up to date with `main` before requesting review.

## Code Style

- Match the existing code style and patterns in the repository.
- Use TypeScript for all new components and utilities.
- Prefer meaningful component and variable names in Spanish for user-facing content, English for code identifiers.
- Keep changes minimal and focused — avoid unrelated refactors in the same PR.

## Questions

If you are unsure about an approach, open a draft PR or comment on the related issue to discuss before investing significant effort.
