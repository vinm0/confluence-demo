"use client";

import { useState } from "react";
import { UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GroupMember {
  accountId?: string;
  displayName?: string;
  email?: string;
}

interface GroupMembersDialogProps {
  groupId: string;
  groupName: string;
}

export function GroupMembersDialog({ groupId, groupName }: GroupMembersDialogProps) {
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMembers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups?groupId=${encodeURIComponent(groupId)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to load users.");
      }
      setMembers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={(open) => open && loadMembers()}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`List users in ${groupName}`}>
            <UsersIcon />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users in {groupName}</DialogTitle>
          <DialogDescription>Members of this group.</DialogDescription>
        </DialogHeader>

        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {members && members.length === 0 && (
          <p className="text-sm text-muted-foreground">No users found.</p>
        )}
        {members && members.length > 0 && (
          <ul className="grid gap-2">
            {members.map((member) => (
              <li key={member.accountId} className="text-sm">
                <span className="font-medium">{member.displayName ?? member.accountId}</span>
                {member.email && (
                  <span className="ml-2 text-muted-foreground">{member.email}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
