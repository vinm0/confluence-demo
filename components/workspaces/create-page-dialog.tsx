"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

interface WorkspaceOption {
  id: string;
  key: string;
  name: string;
}

interface CreatePageDialogProps {
  /** Preselects and locks the workspace when creating a page from within a workspace's context. */
  workspace?: WorkspaceOption;
  triggerLabel?: string;
}

export function CreatePageDialog({ workspace, triggerLabel = "Create Page" }: CreatePageDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [spaceId, setSpaceId] = useState(workspace?.id ?? "");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceOptions, setWorkspaceOptions] = useState<WorkspaceOption[]>(
    workspace ? [workspace] : []
  );

  async function loadWorkspaces() {
    if (workspace) return; // locked to a single workspace, no need to fetch
    try {
      const res = await fetch("/api/spaces");
      if (res.ok) setWorkspaceOptions(await res.json());
    } catch {
      // leave options empty on failure; select will just show no options
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, title }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create page.");
      }
      setTitle("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) loadWorkspaces();
      }}
    >
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

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="page-workspace">Workspace</Label>
            <Select
              value={spaceId}
              onValueChange={(v) => setSpaceId(v ?? "")}
              disabled={Boolean(workspace)}
            >
              <SelectTrigger id="page-workspace" className="w-full">
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaceOptions.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name} ({ws.key})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="page-title">Title</Label>
            <Input
              id="page-title"
              name="title"
              placeholder="e.g. Deployment Checklist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={submitting || !spaceId}>
              {submitting ? "Creating..." : "Create Page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
