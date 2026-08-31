"use client";

import { PlusIcon } from "lucide-react";

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

export function CreateWorkspaceDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            Create Workspace
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Provision a new space to organize a set of related pages.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="workspace-name">Name</Label>
            <Input id="workspace-name" name="name" placeholder="e.g. Engineering" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="workspace-key">Key</Label>
            <Input id="workspace-key" name="key" placeholder="e.g. ENG" maxLength={10} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="workspace-description">Description</Label>
            <Textarea
              id="workspace-description"
              name="description"
              placeholder="What is this workspace for?"
              rows={3}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          {/* TODO: wire up create-workspace mutation */}
          <Button type="submit">Create Workspace</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
