# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 07 in progress - Wire Editor Home to Real API

## Current Goal

- Wire the editor home sidebar and dialogs to the real project API, replacing mock data with persistent state.

## Completed

- Design system foundation from `context/feature-specs/01-design-syetem.md`, including shadcn/ui setup, requested UI primitives, `lucide-react`, the shared `cn()` helper, and dark theme token integration.
- Authentication foundation from `context/feature-specs/03-auth.md`, including Clerk provider setup, auth routes, root redirects, proxy-based protection, editor user menu integration, and production verification.
- Project dialogs and editor home from `context/feature-specs/04-project-dialogs.md`, including the `/editor` empty state, mock project lists, owned-project rename/delete actions, mobile sidebar scrim behavior, and functional create/rename/delete dialogs with dedicated local state management.
- Project dialogs and editor home refinement from `context/feature-specs/04-project-dialogs.md`, correcting the broken sidebar tab/content layout and aligning the sidebar and create dialog presentation with the approved references while keeping mock-data-only behavior.
- Prisma schema and data layer from `context/feature-specs/05-prisma.md`, including the multi-file Prisma project models, cached Prisma client singleton with `prisma+postgres://` Accelerate branching and `@prisma/adapter-pg` fallback, the first migration, and generated client output.
- Project API routes from `context/feature-specs/06-project-apis.md`, including authenticated owner-scoped list/create/rename/delete route handlers, shared request parsing helpers, owner checks for mutations, and verified `401`/`403` handling paths in the backend implementation.
- Wire Editor Home to Real API from `context/feature-specs/07-wire-editor-home.md`, including Server Component data fetching, persistent `useProjectActions` hook, and verified project CRUD operations against the Prisma data layer.

## In Progress

- No active feature in progress.

## Next Up

- Wire the editor project dialogs and sidebar to the real project APIs in a future feature unit.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Set Next.js `distDir` to `.next-build` in this workspace so production builds avoid the recurring Windows `.next/trace` file lock issue during local verification.
- Allow `NEXT_DIST_DIR` to override the default Next.js build directory during local verification so production builds can avoid external Windows locks on `.next-build` without changing the app's default output path.

## Session Notes

- Started `06-project-apis.md` by adding backend-only project route handlers for list/create/rename/delete, keeping the editor UI on mock state for now.
- Completed `06-project-apis.md` with `GET /api/projects`, `POST /api/projects`, `PATCH /api/projects/[projectId]`, and `DELETE /api/projects/[projectId]`, all backed by Clerk auth and Prisma project ownership checks.
- Added `lib/project-api.ts` to centralize route-level auth lookup, JSON parsing, default-name handling for project creation, and consistent error responses for project mutations.
- Verified the new API routes with `npm run lint -- app/api/projects lib/project-api.ts`, `npx tsc --noEmit`, and `npm run build` using `NEXT_DIST_DIR=.next-build-verify-api`.
- `next build` refreshed `tsconfig.json` includes for the additional generated Next.js type output directories used during local verification.
- Completed the design system feature unit with token-driven dark theme styling and generated shadcn primitives verified by lint and production build.
- Implemented the editor workspace shell feature from `context/feature-specs/02-editor.md`, including the navbar, floating project sidebar, and reusable dialog shell pattern.
- Lint passes for the new editor components; production build verification is still pending because `next build` hit a local Windows permission error on `.next/trace`.
- Removed the temporary `app/page.tsx` preview after route-based testing so the editor shell work can be wired into a dedicated editor route later.
- Started the auth feature unit from `context/feature-specs/03-auth.md` after confirming the project is on Next.js 16 and Clerk v7, which requires `proxy.ts` and async server auth APIs.
- Completed the auth feature with Clerk-powered sign-in and sign-up routes, default route protection through `proxy.ts`, authenticated root redirects, and `UserButton` wired into the editor navbar.
- Installed `@clerk/ui`, verified `npm run lint`, and verified `npm run build` after routing build output to `.next-build` and excluding that generated directory from ESLint.
- Refined the auth page shell to better match the approved two-panel layout: balanced 50/50 split on large screens, adjusted typography, and a more structured left-side value summary while keeping the implementation within `03-auth.md` and `ui-context.md`.
- Began the project dialogs and editor home unit from `context/feature-specs/04-project-dialogs.md` to add the `/editor` empty state, mock project actions, and the first functional dialog flows without persistence.
- Completed the project dialogs and editor home unit with a dedicated dialog-state hook, live slug preview, owned-project sidebar actions, and mobile outside-click closing via a backdrop scrim.
- Verified `npm run lint` and `npx tsc --noEmit`; `npm run build` still hits the known local Windows `EPERM` lock against `.next-build\app-path-routes-manifest.json`.
- Refined the same `04-project-dialogs` unit after visual review: fixed the sidebar tabs stacking bug, moved the sidebar create action into the intended top section, and tuned the create dialog layout to match the approved references more closely.
- Re-verified `npm run lint` and `npx tsc --noEmit` after the layout correction pass.
- Completed `05-prisma.md` by adding `Project` and `ProjectCollaborator` to the folder-based Prisma schema, generating the Prisma 7 client, and applying the initial `init_project_data_layer` migration against the configured PostgreSQL database.
- Added `lib/prisma.ts` as the shared cached Prisma singleton with runtime branching between `accelerateUrl` for `prisma+postgres://` connections and `PrismaPg` for direct PostgreSQL URLs.
- Verified `npm run lint`, `npx tsc --noEmit`, and `npm run build` by using `NEXT_DIST_DIR=.next-build-verify` for the build step because another local Node process was locking the default `.next-build` directory.
- Refined `.gitignore` to include `/.next-build-verify*/` patterns, ensuring that transient verification build artifacts generated during local testing are correctly ignored by source control.
