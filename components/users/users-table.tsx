import { Trash2Icon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { User } from "@/lib/confluence/users";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UsersTable({ users = [] }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Account ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => {
          const name = user.data.displayName ?? user.data.accountId!;
          return (
            <TableRow key={user.data.accountId}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.data.email ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{user.data.accountId}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <EditUserDialog user={user.data} />
                  {/* TODO: wire up remove-user action */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${name}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
