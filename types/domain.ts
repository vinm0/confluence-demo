/**
 * Domain types for the Confluence Cloud Site Manager MVP.
 *
 * These are intentionally simplified, UI-facing shapes (not the full response
 * shapes from `confluence.js`). When real API integration lands, map the
 * `confluence.js` `Space`/`Page`/`SpaceRoleAssignments` responses onto these
 * types (or replace these types with the SDK's own).
 */

export type PermissionRole = "admin" | "editor" | "viewer";

export type PrincipalType = "user" | "group";

export interface Permission {
  id: string;
  principalType: PrincipalType;
  principalName: string;
  role: PermissionRole;
  source: "direct" | "inherited";
}

export interface ConfluencePage {
  id: string;
  workspaceId: string;
  title: string;
  status: "current" | "draft" | "archived";
  authorName: string;
  version: number;
  lastModified: string;
  parentPageId: string | null;
}

export interface Workspace {
  id: string;
  key: string;
  name: string;
  description: string;
  ownerName: string;
  createdAt: string;
  pageCount: number;
}

export interface ConfluenceGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  /** Site-wide default role granted to members of this group. */
  defaultRole: PermissionRole;
}

export type UserStatus = "active" | "invited" | "deactivated";

export interface ConfluenceUser {
  id: string;
  displayName: string;
  email: string;
  groupNames: string[];
  status: UserStatus;
  lastActiveAt: string | null;
}
