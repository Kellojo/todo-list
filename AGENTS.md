# AGENTS

## Overview
This repository is a **SvelteKit** + **TypeScript** front‑end that talks to a local PocketBase instance.  The codebase follows the standard SvelteKit conventions and uses the following tooling:

* `vite` – build, dev server, preview
* `svelte-kit` – framework scaffolding & type checking
* `typescript` – strict TS settings
* `concurrently` – runs the frontend and PocketBase side‑by‑side during development

The agents that will work on this repo should use these commands and conventions when adding or refactoring code.

---

## Build / Lint / Test Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the SvelteKit dev server **and** PocketBase.  The frontend runs on `http://localhost:5173`, PocketBase listens on `http://127.0.0.1:8090`. |
| `npm run build` | Builds a static site ready for deployment (uses `@sveltejs/adapter-static`). |
| `npm run preview` | Serves the built output locally – useful for QA. |
| `npm run check` | Runs SvelteKit’s type checker (`svelte-check`) against the current TS config. |
| `npm run check:watch` | Same as above but watches files for changes. |

### Running a single test
> **NOTE** – The repository currently has no automated tests configured.  When adding tests, we recommend using **Vitest** (the Vite‑native test runner).  A minimal setup would be:

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@sveltejs/adapter-auto": "..."
  }
}
```

Then add a script:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

To run a single test file:

```bash
npm run test -- path/to/__tests__/my-test.spec.ts
```

If you prefer the older **Jest** ecosystem, install `jest` and configure it similarly.

---

## Code Style Guidelines

The following conventions are enforced (or strongly recommended) throughout the codebase.  Agents should follow them when creating or modifying files.

### General Project Structure
* All source code lives under `src/`.  Public assets go in `static/`.
* TypeScript is **strict** (`tsconfig.json` has `"strict": true`).
* Every module exports a single default or named export; avoid side‑effects at import time.

### Imports
1. Use absolute imports with the `$lib/*` alias for library code (SvelteKit provides this).  Example: `import { todoService } from '$lib/todo-service';`
2. Prefer relative imports only for local files that cannot be aliased.
3. Group imports by type:
   * External packages
   * SvelteKit / framework modules
   * `$lib` utilities
   * Local components or helpers
4. Keep a single blank line between groups.
5. Avoid `import * as X from '...'`; use named imports unless the module only provides one export.
6. Never import CSS/SCSS directly in TS files – use `<style>` blocks or global styles.

### Formatting
* Use **Prettier** (via `svelte-check` integration).  The repository ships with a default `.prettierrc` that enforces:
  * 2‑space indentation
  * Semicolons are optional but consistent
  * Trailing commas where appropriate
* Run `npm run check` before committing to catch formatting issues.

### TypeScript Rules
1. **Never** use the `any` type. If you must, narrow it with a custom type guard first.
2. Use union and intersection types for complex data shapes.
3. Prefer `readonly` arrays/objects when the value should not mutate.
4. Export interfaces/types from `$lib/types/*.ts` to keep them discoverable.
5. When interacting with PocketBase, use the generated type definitions (`pb/models.ts`) if available; otherwise create explicit types.

### Naming Conventions
| Context | Naming Rule |
|---------|-------------|
| Variables / constants | `camelCase`; constants in all caps only for process/env values |
| Functions | `camelCase`; async functions end with `Async` if they return a Promise |
| Types / interfaces | `PascalCase` (e.g., `TodoItem`, `UserResponse`) |
| Components | `PascalCase` and file name matches component name (`MyComponent.svelte`) |
| Enums | `SCREAMING_SNAKE_CASE` |

### Error Handling
* Use `try/catch` blocks around async operations that can fail (e.g., network calls).
* When catching, log the error with a meaningful message using `console.error` or a logging helper.
* Propagate errors up the call stack unless you have a concrete recovery strategy.
* For UI‑level errors, expose an `error: string | null` state and render an alert or toast via `svelte-sonner`.

### Testing (when added)
* Write tests in `src/__tests__/`.  Use the `.spec.ts` suffix.
* Keep tests deterministic – mock PocketBase responses with `vitest-mock-axios` or similar.
* Aim for 80 %+ coverage but prioritize critical paths.

---

## Cursor & Copilot Rules
The repository does **not** contain any `.cursor/rules/` or `.github/copilot-instructions.md` files.  Agents should treat all code as free‑form unless new rules are added.

---

## Summary for Agents
* Run `npm run dev` during feature work to see changes live.
* Use `npm run check` before pushing to ensure type safety and formatting.
* Follow the import, naming, and error handling conventions above.
* When adding tests, follow the Vitest pattern shown in the *Running a single test* section.

Happy coding!
