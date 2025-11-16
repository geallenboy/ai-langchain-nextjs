# Repository Guidelines

## Project Structure & Module Organization
Source lives under `src/`, split into feature modules so each domain stays self-contained. `src/modules/learning` holds LangChain demos (`examples/`, `config.ts`, README) while `src/modules/travel` contains the production-grade travel agent (`agents/`, `tools/`, `config.ts`). UI routes live in `src/app` (`learning/`, `travel/`, `api/`), and shared UI/utilities sit under `src/shared`. Long-form references and walkthroughs are stored in `docs/` (`学习指南`, `AI旅行`). Static assets are in `public/`; environment samples are at `.env.example`.

## Build, Test, and Development Commands
Run `pnpm install` once, then:
- `pnpm dev` — Next.js dev server with Turbopack for fast iteration.
- `pnpm build` — production build plus type checking; run before every PR.
- `pnpm start` — serves the built app for manual validation.
When touching LangChain code, smoke-test both `/learning` demos and the `/travel` assistant locally to confirm agents and tools still compose correctly.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation and favor explicit types on public functions. React components live in PascalCase files (`TravelPlanner.tsx`), hooks/utilities stay in camelCase. Keep module boundaries clean: UI logic in `src/app`, orchestration in `src/modules`, shared helpers in `src/shared`. Tailwind CSS 4 utilities should be composed via `clsx`/`tailwind-merge` when classes become dynamic. Describe LangChain tools with Zod schemas and name them with verb-noun pairs (`plan_trip`, `fetch_weather`).

## Testing Guidelines
No automated test suite ships yet, so rely on `pnpm build` for type and bundler safety and perform targeted manual runs of critical flows (basic chat, memory demo, travel agent). Add regression notes in PR descriptions for any new edge cases. If you introduce unit or integration tests, place them alongside the feature module (`src/modules/<feature>/__tests__`) and follow `feature-scenario.test.ts` naming.

## Commit & Pull Request Guidelines
Commits should be imperative, scoped, and under 72 characters (e.g., `Add travel budget estimator`). Aggregate related file changes rather than committing generated artifacts. Each PR should include: purpose summary, testing evidence (`pnpm build`, manual URLs exercised), screenshots or terminal captures for UI/API changes, and links to relevant issues. Mention config changes (environment variables, API keys) explicitly so reviewers can update local setups.

## Configuration & Security Tips
Duplicate `.env.example` to `.env.local` and set `OPENAI_API_KEY`. Never hardcode keys inside `src/`; load through `process.env` or the Next.js runtime config. When adding new MCP tools or agents, keep secrets in environment variables and document required scopes in `docs/` so downstream contributors can reproduce the setup safely.
