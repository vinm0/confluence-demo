"use client";

import { UserPlusIcon } from "lucide-react";

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

export function CreateUserDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <UserPlusIcon />
            Create User
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>Invite a new user to this site.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="user-name">Display name</Label>
            <Input id="user-name" name="displayName" placeholder="e.g. Jordan Lee" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" name="email" type="email" placeholder="jordan.lee@example.com" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="user-group">Group</Label>
            <Select>
              <SelectTrigger id="user-group" className="w-full">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {mockGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          {/* TODO: wire up create-user mutation */}
          <Button type="submit">Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
