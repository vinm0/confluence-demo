import { Trash2Icon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { mockUsers } from "@/lib/mock-data";

const statusVariant = {
  active: "default",
  invited: "secondary",
  deactivated: "outline",
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Groups</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">{initials(user.displayName)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.displayName}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.groupNames.map((group) => (
                  <Badge key={group} variant="outline">
                    {group}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[user.status]} className="capitalize">
                {user.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.lastActiveAt ?? "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <EditUserDialog user={user} />
                {/* TODO: wire up remove-user action */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${user.displayName}`}
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
