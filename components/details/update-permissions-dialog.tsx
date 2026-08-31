"use client";

import { ShieldPlusIcon } from "lucide-react";

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

export function UpdatePermissionsDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <ShieldPlusIcon />
            Update Permissions
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Permissions</DialogTitle>
          <DialogDescription>
            Grant or change access for a user or group.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="permission-type">Principal type</Label>
            <Select defaultValue="user">
              <SelectTrigger id="permission-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="permission-principal">User or group</Label>
            <Input id="permission-principal" name="principal" placeholder="Search by name or email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="permission-role">Role</Label>
            <Select defaultValue="viewer">
              <SelectTrigger id="permission-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          {/* TODO: wire up permission update mutation */}
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
