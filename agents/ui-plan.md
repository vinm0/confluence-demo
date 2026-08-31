# Confluence Cloud Site Manager — MVP UI Plan

## Context
This is a greenfield repo (initially just `prompts/ui-prompt.md`). The goal is a Next.js/TypeScript MVP that acts as a central hub for managing a Confluence Cloud Site: dashboard, workspace/page browsing, permission editing, and user/group management. Per constraints, this pass builds **UI only** — layout, navigation, placeholder content containers, and forms — with no data fetching, validation, or state logic wired up, and no assumed live Confluence endpoints. The deliverable must still read as "ready to wire up": typed props, mock data shaped like real domain objects, and a stubbed (unused) `confluence.js` client so a future pass can drop real logic in without restructuring.

Styling stack: **Tailwind CSS + shadcn/ui**. shadcn components are copied into the repo as plain React/Tailwind (no extra runtime UI-library dependency), which keeps this "UI only" while giving us Dialog (popups), Table, Card, Input, Select, DropdownMenu, Badge, Tabs out of the box for the modals/tables/forms every page needs.

## Design Decisions
1. **App Router** (`app/`), not Pages Router — current Next.js default, matches file-based nested routing needed for workspace → page hierarchy.
2. **Route structure**:
   - `/` — Dashboard Homepage
   - `/workspaces` — Workspace List Page
   - `/workspaces/[workspaceId]` — Workspace Details Page
   - `/workspaces/[workspaceId]/pages/[pageId]` — Page Details Page (nested under its workspace, since a Confluence page always belongs to a space)
   - `/users` — User Management
   - `/groups` — Group Management (create/edit/delete groups, set each group's default permission role)

   Nesting page details under the workspace route keeps breadcrumbs and "back to workspace" navigation trivial and matches Confluence's own space→page containment. Groups get their own top-level route rather than living inside `/users`: group CRUD and group-level permissions are a distinct admin concern from individual user accounts, and Confluence itself treats groups as a first-class object separate from users.
3. **Persistent shell**: a root layout renders a fixed left `Sidebar` (nav links: Dashboard, Workspaces, Users) + a top `Header` (breadcrumb/page title placeholder) around a `<main>` slot. Satisfies "sidebar on every page" and "all nav buttons lead to expected page" via real Next.js `<Link>`s (navigation is not "business logic" — it's UI wiring, explicitly required by acceptance criteria).
4. **Placeholder content, typed**: every data area (stat counts, workspace list, page tree, permissions table, user table) renders from local mock-data modules typed against domain interfaces (`Workspace`, `ConfluencePage`, `ConfluenceUser`, `ConfluenceGroup`, `Permission`). No fetch/loading/error states beyond a static skeleton/empty placeholder, since there's no real data source yet.
5. **Forms without behavior**: "create/update" affordances are real forms (labeled inputs, selects, submit buttons) built with shadcn `Dialog` + form-shaped markup, but submit handlers are left as empty/no-op stubs with a `// TODO: wire up create-workspace mutation` style comment — structurally correct, functionally inert. No client-side validation library (no zod/react-hook-form logic) is wired, just the markup shadcn's form primitives produce.
6. **confluence.js present but inert**: add `confluence.js` as a dependency and create `lib/confluence/client.ts` that constructs a client instance from placeholder env vars, exported but **never imported by any page/component** — satisfies "tech stack includes confluence.js" and "do not assume remote endpoints" simultaneously.
7. **No global state/data-fetching library** (no SWR/React Query) — would imply behavior logic. Pages are server components rendering mock data synchronously; interactive bits (Dialog open state, table filter inputs) are the minimum client components required for shadcn primitives to render, with no logic attached to their events beyond shadcn's own open/close plumbing (which is UI state, not business logic).

## File Structure
```
confluence-task/
  package.json, tsconfig.json, next.config.ts, postcss.config.mjs, tailwind config (v4 CSS-based), eslint.config.mjs
  components.json                    # shadcn config
  app/
    layout.tsx                       # root layout: <Sidebar/> + <Header/> + children
    globals.css
    page.tsx                         # Dashboard Homepage
    workspaces/
      page.tsx                       # Workspace List Page
      [workspaceId]/
        page.tsx                     # Workspace Details Page
        pages/[pageId]/page.tsx      # Page Details Page
    users/
      page.tsx                       # User Management
    groups/
      page.tsx                       # Group Management
  components/
    layout/sidebar.tsx, header.tsx
    dashboard/stat-card.tsx, quick-links.tsx
    workspaces/workspace-list-table.tsx, create-workspace-dialog.tsx, create-page-dialog.tsx
    details/details-summary-card.tsx, permissions-table.tsx, update-permissions-dialog.tsx
    users/users-table.tsx, user-filters.tsx, create-user-dialog.tsx, edit-user-dialog.tsx
    groups/groups-table.tsx, create-group-dialog.tsx, edit-group-dialog.tsx, group-permissions-dialog.tsx
    ui/                              # shadcn primitives: button, card, dialog, input, label, select, table, badge, tabs, dropdown-menu, separator, avatar, textarea
  lib/
    mock-data.ts                     # sample workspaces/pages/users/groups/permissions
    utils.ts                         # shadcn's cn() helper
    confluence/client.ts             # stubbed, unused confluence.js client
  types/
    domain.ts                        # Workspace, ConfluencePage, ConfluenceUser, ConfluenceGroup (incl. defaultRole), Permission, PermissionRole
```

## Implementation Steps
1. **Scaffold Next.js app** with TypeScript, Tailwind, App Router, ESLint.
2. **Install & init shadcn/ui**, add components: `button card dialog input label select table badge tabs dropdown-menu separator avatar textarea`.
3. **Install `confluence.js`** as a dependency.
4. **Domain types** (`types/domain.ts`): define `Workspace`, `ConfluencePage`, `ConfluenceUser`, `ConfluenceGroup`, `Permission`/`PermissionRole` interfaces used everywhere below.
5. **Mock data** (`lib/mock-data.ts`): a handful of workspaces (each with nested pages), users (with group membership), groups, and permission entries — enough to populate every table/list with realistic placeholder rows.
6. **Stub confluence client** (`lib/confluence/client.ts`): instantiate and export a `confluenceClient` using placeholder `process.env` values; header comment notes it's not yet called anywhere.
7. **Layout shell**: `components/layout/sidebar.tsx` (nav items: Dashboard `/`, Workspaces `/workspaces`, Users `/users`, using `usePathname` only for active-link styling) and `header.tsx`; wired into `app/layout.tsx`.
8. **Dashboard Homepage** (`app/page.tsx`): `StatCard` x2 (Page count, Workspace count — static numbers from mock data length) + `QuickLinks` section (cards/buttons linking to Workspaces and Users).
9. **Workspace List Page** (`app/workspaces/page.tsx`): table rendering workspaces with expandable nested pages (each row links to its details page); "Create Workspace" and "Create Page" buttons open `CreateWorkspaceDialog`/`CreatePageDialog` (shadcn `Dialog` with form fields: name, key/slug, description; submit button, no-op handler).
10. **Workspace Details Page** (`app/workspaces/[workspaceId]/page.tsx`): `DetailsSummaryCard` (name, key, owner, created date, description) + `PermissionsTable` (principal, role, source) + "Update Permissions" button opening `UpdatePermissionsDialog` (select principal, select role, submit — no-op).
11. **Page Details Page** (`app/workspaces/[workspaceId]/pages/[pageId]/page.tsx`): same pattern as workspace details — `DetailsSummaryCard` (title, space, version, last modified, author) + reused `PermissionsTable`/`UpdatePermissionsDialog`.
12. **User Management** (`app/users/page.tsx`): `UsersTable` (name, email, groups, status columns) + `UserFilters` (group `Select`, search `Input` — inert, no filtering logic) + toolbar button "Create User" opening `CreateUserDialog`, plus per-row "Edit"/"Remove" affordances (`EditUserDialog`, a `Button` for remove) — all inert.
13. **Group Management** (`app/groups/page.tsx`): `GroupsTable` (name, description, member count, default role columns) + toolbar button "Create Group" opening `CreateGroupDialog` (name, description, default role); per-row actions: `GroupPermissionsDialog` (set the group's default `PermissionRole` — admin/editor/viewer), `EditGroupDialog` (name/description), and a destructive `Button` for remove — all inert.
14. **Sanity pass**: `npm run build` to confirm the app compiles and every route renders with mock data.

## Verification
- `npm run build` succeeds (confirms TypeScript types, all routes compile).
- `npm run dev`, manually click every sidebar link and every workspace/page row link, confirm each of the 5 routes renders its containers/placeholders and no console errors from client components.
- Confirm each "Create"/"Update"/"Remove" affordance opens a dialog/form with the right fields, and that submit buttons don't throw (no-op handlers only).
- Grep the codebase to confirm `lib/confluence/client.ts` is exported but not imported elsewhere (no assumed live endpoint calls).
