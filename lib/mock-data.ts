import type {
  ConfluenceGroup,
  ConfluencePage,
  ConfluenceUser,
  Permission,
  Workspace,
} from "@/types/domain";

/**
 * Static placeholder data used to populate UI containers.
 * Not sourced from Confluence — replace with real fetches when
 * business logic is implemented.
 */

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    key: "ENG",
    name: "Engineering",
    description: "Architecture docs, runbooks, and team processes.",
    ownerName: "Priya Natarajan",
    createdAt: "2024-11-04",
    pageCount: 3,
  },
  {
    id: "ws-2",
    key: "PROD",
    name: "Product",
    description: "Roadmaps, specs, and release notes.",
    ownerName: "Marcus Webb",
    createdAt: "2025-01-22",
    pageCount: 2,
  },
  {
    id: "ws-3",
    key: "HR",
    name: "People Ops",
    description: "Onboarding guides and policy documentation.",
    ownerName: "Dana Ellery",
    createdAt: "2025-04-09",
    pageCount: 1,
  },
];

export const mockPages: ConfluencePage[] = [
  {
    id: "pg-1",
    workspaceId: "ws-1",
    title: "System Architecture Overview",
    status: "current",
    authorName: "Priya Natarajan",
    version: 6,
    lastModified: "2026-08-12",
    parentPageId: null,
  },
  {
    id: "pg-2",
    workspaceId: "ws-1",
    title: "On-call Runbook",
    status: "current",
    authorName: "Sam Ochieng",
    version: 3,
    lastModified: "2026-07-30",
    parentPageId: "pg-1",
  },
  {
    id: "pg-3",
    workspaceId: "ws-1",
    title: "Deployment Checklist",
    status: "draft",
    authorName: "Priya Natarajan",
    version: 1,
    lastModified: "2026-08-20",
    parentPageId: "pg-1",
  },
  {
    id: "pg-4",
    workspaceId: "ws-2",
    title: "Q3 Roadmap",
    status: "current",
    authorName: "Marcus Webb",
    version: 9,
    lastModified: "2026-08-25",
    parentPageId: null,
  },
  {
    id: "pg-5",
    workspaceId: "ws-2",
    title: "Feature Spec: Site Manager",
    status: "current",
    authorName: "Marcus Webb",
    version: 4,
    lastModified: "2026-08-28",
    parentPageId: "pg-4",
  },
  {
    id: "pg-6",
    workspaceId: "ws-3",
    title: "New Hire Onboarding Guide",
    status: "current",
    authorName: "Dana Ellery",
    version: 12,
    lastModified: "2026-06-15",
    parentPageId: null,
  },
];

export const mockGroups: ConfluenceGroup[] = [
  {
    id: "grp-1",
    name: "engineering-team",
    description: "All engineering staff.",
    memberCount: 18,
    defaultRole: "editor",
  },
  {
    id: "grp-2",
    name: "product-team",
    description: "Product managers and designers.",
    memberCount: 7,
    defaultRole: "editor",
  },
  {
    id: "grp-3",
    name: "site-admins",
    description: "Full administrative access.",
    memberCount: 3,
    defaultRole: "admin",
  },
  {
    id: "grp-4",
    name: "confluence-users",
    description: "All licensed users.",
    memberCount: 42,
    defaultRole: "viewer",
  },
];

export const mockUsers: ConfluenceUser[] = [
  {
    id: "usr-1",
    displayName: "Priya Natarajan",
    email: "priya.natarajan@example.com",
    groupNames: ["engineering-team", "site-admins"],
    status: "active",
    lastActiveAt: "2026-08-29",
  },
  {
    id: "usr-2",
    displayName: "Marcus Webb",
    email: "marcus.webb@example.com",
    groupNames: ["product-team"],
    status: "active",
    lastActiveAt: "2026-08-28",
  },
  {
    id: "usr-3",
    displayName: "Dana Ellery",
    email: "dana.ellery@example.com",
    groupNames: ["confluence-users"],
    status: "active",
    lastActiveAt: "2026-08-20",
  },
  {
    id: "usr-4",
    displayName: "Sam Ochieng",
    email: "sam.ochieng@example.com",
    groupNames: ["engineering-team"],
    status: "invited",
    lastActiveAt: null,
  },
  {
    id: "usr-5",
    displayName: "Leah Fontaine",
    email: "leah.fontaine@example.com",
    groupNames: ["product-team", "confluence-users"],
    status: "deactivated",
    lastActiveAt: "2026-03-11",
  },
];

export const mockPermissions: Permission[] = [
  { id: "perm-1", principalType: "group", principalName: "site-admins", role: "admin", source: "direct" },
  { id: "perm-2", principalType: "group", principalName: "engineering-team", role: "editor", source: "direct" },
  { id: "perm-3", principalType: "user", principalName: "Sam Ochieng", role: "editor", source: "direct" },
  { id: "perm-4", principalType: "group", principalName: "confluence-users", role: "viewer", source: "inherited" },
];

export function getWorkspaceById(id: string): Workspace | undefined {
  return mockWorkspaces.find((workspace) => workspace.id === id);
}

export function getPagesForWorkspace(workspaceId: string): ConfluencePage[] {
  return mockPages.filter((page) => page.workspaceId === workspaceId);
}

export function getPageById(id: string): ConfluencePage | undefined {
  return mockPages.find((page) => page.id === id);
}
