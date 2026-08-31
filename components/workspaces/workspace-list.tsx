import Link from "next/link";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreatePageDialog } from "@/components/workspaces/create-page-dialog";
import type { Space } from "@/lib/confluence/space";
import type { Page } from "@/lib/confluence/pages";

const statusVariant = {
  current: "default",
  draft: "secondary",
  archived: "outline",
} as const;

export function WorkspaceList({ spaces = [], pages = [] }: { spaces: Space[]; pages: Page[] }) {
  return (
    <div className="space-y-4">
      {spaces.length === 0 && (
        <p className="text-sm text-muted-foreground">No workspaces found.</p>
      )}
      {spaces.map((space) => {
        const workspace = space.data;
        const spacePages = pages.filter((p) => p.data.spaceId === workspace.id);

        return (
          <Card key={workspace.id}>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/workspaces/${workspace.id}`}
                    className="font-heading text-base font-medium hover:underline"
                  >
                    {workspace.name}
                  </Link>
                  <Badge variant="outline">{workspace.key}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {workspace.description?.plain?.value}
                </p>
              </div>
              <CreatePageDialog
                workspace={{ id: workspace.id!, key: workspace.key!, name: workspace.name! }}
                triggerLabel="Create Page"
              />
            </CardHeader>

            <Separator />

            <CardContent className="space-y-1 pt-4">
              {spacePages.length === 0 && (
                <p className="text-sm text-muted-foreground">No pages yet.</p>
              )}
              {spacePages.map((page) => (
                <Link
                  key={page.data.id}
                  href={`/workspaces/${workspace.id}/pages/${page.data.id}`}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="size-3.5 text-muted-foreground" />
                    {page.data.title}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant={statusVariant[page.data.status as keyof typeof statusVariant] ?? "outline"}
                      className="capitalize"
                    >
                      {page.data.status}
                    </Badge>
                    v{page.data.version?.number}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
