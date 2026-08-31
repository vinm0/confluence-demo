"use client";

import { FilePlusIcon } from "lucide-react";

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
import { mockWorkspaces } from "@/lib/mock-data";
import type { Workspace } from "@/types/domain";

interface CreatePageDialogProps {
  /** Preselects and locks the workspace when creating a page from within a workspace's context. */
  workspace?: Workspace;
  triggerLabel?: string;
}

export function CreatePageDialog({ workspace, triggerLabel = "Create Page" }: CreatePageDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant={workspace ? "default" : "outline"}>
            <FilePlusIcon />
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>Add a new page to a workspace.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="page-workspace">Workspace</Label>
            <Select defaultValue={workspace?.id} disabled={Boolean(workspace)}>
              <SelectTrigger id="page-workspace" className="w-full">
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                {mockWorkspaces.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name} ({ws.key})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="page-title">Title</Label>
            <Input id="page-title" name="title" placeholder="e.g. Deployment Checklist" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="page-parent">Parent page (optional)</Label>
            <Select>
              <SelectTrigger id="page-parent" className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          {/* TODO: wire up create-page mutation */}
          <Button type="submit">Create Page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
