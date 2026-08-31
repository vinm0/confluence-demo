"use client";

import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockGroups } from "@/lib/mock-data";
import type { ConfluenceUser } from "@/types/domain";

interface EditUserDialogProps {
  user: ConfluenceUser;
}

export function EditUserDialog({ user }: EditUserDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Edit ${user.displayName}`}>
            <PencilIcon />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update {user.displayName}&apos;s details and group membership.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-user-name-${user.id}`}>Display name</Label>
            <Input id={`edit-user-name-${user.id}`} name="displayName" defaultValue={user.displayName} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-user-email-${user.id}`}>Email</Label>
            <Input id={`edit-user-email-${user.id}`} name="email" type="email" defaultValue={user.email} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-user-group-${user.id}`}>Primary group</Label>
            <Select defaultValue={user.groupNames[0]}>
              <SelectTrigger id={`edit-user-group-${user.id}`} className="w-full">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {mockGroups.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-user-status-${user.id}`}>Status</Label>
            <Select defaultValue={user.status}>
              <SelectTrigger id={`edit-user-status-${user.id}`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          {/* TODO: wire up update-user mutation */}
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
