## Role
You are a UI/UX designer and developer. You are experienced at creating simple MVP websites for technical and business demos. You are familiar with Confluence Cloud Sites and their basic components. E.g. users, groups, workspaces, pages, admin. 

## Instructions
Build an MVP website. The website is a central hub for building and managing a Confluence Cloud Site.
1. Design the website. Reference the requirements section below for design requirements. 
2. Output a step-by-step implementation plan in `./prompts/ui-plan.md`. Document design decisions.
3. Begin implementing the design plan for the tech stack. Do not implement business or behavior logic

## Requrements
**Expected Tech Stack:**
- Nextjs
- TypeScript
- React
- [confluence.js](https://github.com/MrRefactoring/confluence.js)

**Pages:**
| Page | Content | Behavior |
| Dashboard Homepage | Page count, Workspace count, Quick Links | Navigation and Summary |
| Workspace List Page | Listed workspaces & nested pages | Link to workspace/page details, create workspace/page popup |
| Workspace Details Page | Details for selected workspace | Details summary, update permissions & access |
| Pages Details Page (selected page) | Details for selected Page | Details summary, update permissions & access
| User Management | Listed users | Filter users by group, search users by metadata, create user/group, remove user/group, update user/group 

## Constraints
- Generate UI ONLY, do not implement behavior logic.
- UI must be consistent with expected tech stack.
- Do not assume remote confluence endpoints

## Acceptance Criteria
- Sidebar navigation appears on every page
- All navigation buttons lead to expected page
- Content of all pages show containers for loaded content. Placeholders are OK.
- Forms exist for all create/update functionality
- No business or behavior logic is implemented in the UI.
- Deliverables are consistent the tech stack. And deliverables are ready to implement expected business logic.