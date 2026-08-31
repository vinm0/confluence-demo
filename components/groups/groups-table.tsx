import { Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditGroupDialog } from "@/components/groups/edit-group-dialog";
import { GroupPermissionsDialog } from "@/components/groups/group-permissions-dialog";
import { mockGroups } from "@/lib/mock-data";

const roleVariant = {
  admin: "default",
  editor: "secondary",
  viewer: "outline",
} as const;

export function GroupsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Default role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockGroups.map((group) => (
          <TableRow key={group.id}>
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell className="text-muted-foreground">{group.description}</TableCell>
            <TableCell className="text-muted-foreground">{group.memberCount}</TableCell>
            <TableCell>
              <Badge variant={roleVariant[group.defaultRole]} className="capitalize">
                {group.defaultRole}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <GroupPermissionsDialog group={group} />
                <EditGroupDialog group={group} />
                {/* TODO: wire up remove-group action */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${group.name}`}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2Icon />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
