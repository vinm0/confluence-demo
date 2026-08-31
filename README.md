# Confluence Site Manager

A Next.js web app for managing a Confluence site: browsing workspaces (spaces) and pages, and administering users, groups, and permissions, backed by the Confluence REST API via `confluence.js`.

## Decisions
Graphic UI: Ideal for business stakeholder presentation (see [agents/](./agents/ui-prompt.md) for prompt)
Original Code: focused on API functionality
AI Generated Code: focused on visual presentation
4 hour work window: per task specifications

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS 4, `@base-ui/react`, `shadcn`, `lucide-react`, `class-variance-authority`
- **Confluence integration:** `confluence.js` (v1/v2 REST API clients)
- **Linting:** ESLint 9
- **Gen AI:** Claude Code

## Getting Started

1. Install dependencies: `npm install`
2. Set the following environment variables (e.g. in `.env`):
   - `CONFLUENCE_HOST`
   - `CONFLUENCE_EMAIL`
   - `CONFLUENCE_API_TOKEN`
3. Run the dev server: `npm run dev`

## AI Generated Content

The majority of this codebase — including the Next.js app routes and pages ([app/](./app/)), UI components ([components/](./components/)), and API routes ([app/api/](./app/api/)) was generated with AI assistance (Claude Code).

## Original Content

### `lib/confluence/`

The Confluence API integration layer ([client.ts](./lib/confluence/client.ts), [space.ts](./lib/confluence/space.ts), [users.ts](./lib/confluence/users.ts), [groups.ts](./lib/confluence/groups.ts)) was hand-written.

  - [pages.ts](./lib/confluence/pages.ts) was AI generated referencing `space.ts`
