import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddUserToGroupDialog } from "@/components/groups/add-user-to-group-dialog";
import { GroupMembersDialog } from "@/components/groups/group-members-dialog";
import type { Group } from "@/lib/confluence/groups";

// Confluence's group-list API only returns id/name (no description or member count),
// and edit/permissions/remove actions here expect the mock ConfluenceGroup shape from
// lib/mock-data.ts, not this real Group class — re-add those once that's reconciled.
export function GroupsTable({ groups = [] }: { groups: Group[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Add User</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No groups found.
            </TableCell>
          </TableRow>
        )}
        {groups.map((group) => (
          <TableRow key={group.id}>
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell className="text-muted-foreground">{group.id}</TableCell>
            <TableCell>
              <GroupMembersDialog groupId={group.id} groupName={group.name} />
            </TableCell>
            <TableCell>
              <AddUserToGroupDialog groupId={group.id} groupName={group.name} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
