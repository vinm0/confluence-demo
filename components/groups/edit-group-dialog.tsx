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
import { Textarea } from "@/components/ui/textarea";
import type { ConfluenceGroup } from "@/types/domain";

interface EditGroupDialogProps {
  group: ConfluenceGroup;
}

export function EditGroupDialog({ group }: EditGroupDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Edit ${group.name}`}>
            <PencilIcon />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>Update {group.name}&apos;s name and description.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-group-name-${group.id}`}>Name</Label>
            <Input id={`edit-group-name-${group.id}`} name="name" defaultValue={group.name} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-group-description-${group.id}`}>Description</Label>
            <Textarea
              id={`edit-group-description-${group.id}`}
              name="description"
              defaultValue={group.description}
              rows={3}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          {/* TODO: wire up update-group mutation */}
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
