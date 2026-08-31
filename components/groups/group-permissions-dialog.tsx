"use client";

import { ShieldCheckIcon } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ConfluenceGroup } from "@/types/domain";

interface GroupPermissionsDialogProps {
  group: ConfluenceGroup;
}

export function GroupPermissionsDialog({ group }: GroupPermissionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Set permissions for ${group.name}`}>
            <ShieldCheckIcon />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Group Permissions</DialogTitle>
          <DialogDescription>
            Set the default site-wide role granted to members of{" "}
            <span className="font-medium text-foreground">{group.name}</span>. This can still be
            overridden per workspace or page.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`group-role-${group.id}`}>Default role</Label>
            <Select defaultValue={group.defaultRole}>
              <SelectTrigger id={`group-role-${group.id}`} className="w-full">
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
          {/* TODO: wire up group-permissions mutation */}
          <Button type="submit">Save Permissions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
