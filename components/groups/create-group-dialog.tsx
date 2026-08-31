"use client";

import { UsersRoundIcon } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

export function CreateGroupDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <UsersRoundIcon />
            Create Group
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Groups let you assign permissions to many users at once.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="group-name">Name</Label>
            <Input id="group-name" name="name" placeholder="e.g. design-team" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="group-description">Description</Label>
            <Textarea
              id="group-description"
              name="description"
              placeholder="What is this group for?"
              rows={3}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="group-default-role">Default permission role</Label>
            <Select defaultValue="viewer">
              <SelectTrigger id="group-default-role" className="w-full">
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
          {/* TODO: wire up create-group mutation */}
          <Button type="submit">Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
