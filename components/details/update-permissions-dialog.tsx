"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

interface UpdatePermissionsDialogProps {
  /** Set when updating permissions for a workspace (calls PUT /api/spaces). */
  spaceId?: string;
  /** Set when updating permissions for a page (calls PUT /api/pages). */
  pageId?: string;
}

type PrincipalType = "user" | "group";
type Role = "admin" | "editor" | "viewer";

export function UpdatePermissionsDialog({ spaceId, pageId }: UpdatePermissionsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [principalType, setPrincipalType] = useState<PrincipalType>("user");
  const [principal, setPrincipal] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let res: Response;

      if (spaceId) {
        const permissions =
          role === "admin"
            ? ["read", "create", "update", "delete"]
            : role === "editor"
              ? ["read", "create", "update"]
              : ["read"];

        res = await fetch("/api/spaces", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            principalType === "user"
              ? { spaceId, adminId: principal }
              : { spaceId, groupId: principal, permissions }
          ),
        });
      } else if (pageId) {
        const operations = role === "viewer" ? ["read"] : ["read", "update"];

        res = await fetch("/api/pages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            principalType === "user"
              ? { pageId, accountId: principal, operations }
              : { pageId, groupId: principal, operations }
          ),
        });
      } else {
        throw new Error("Missing spaceId or pageId for permission update.");
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to update permissions.");
      }
      setPrincipal("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update permissions.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="permission-type">Principal type</Label>
            <Select value={principalType} onValueChange={(v) => setPrincipalType(v as PrincipalType)}>
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
            <Label htmlFor="permission-principal">
              {principalType === "user" ? "User account ID" : "Group ID"}
            </Label>
            <Input
              id="permission-principal"
              name="principal"
              placeholder={principalType === "user" ? "Confluence account ID" : "Confluence group ID"}
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="permission-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
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
          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={submitting || !principal}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
