import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DetailsSummaryCard } from "@/components/details/details-summary-card";
import { PermissionsTable } from "@/components/details/permissions-table";
import { UpdatePermissionsDialog } from "@/components/details/update-permissions-dialog";
import { CreatePageDialog } from "@/components/workspaces/create-page-dialog";
import { mockPermissions } from "@/lib/mock-data";
import { Space } from "@/lib/confluence/space";
import { Page } from "@/lib/confluence/pages";

interface WorkspaceDetailsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export const dynamic = "force-dynamic";

export default async function WorkspaceDetailsPage({ params }: WorkspaceDetailsPageProps) {
  const { workspaceId } = await params;
  const numericId = Number(workspaceId);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const space = await Space.getSpaceById(numericId);

  if (!space) {
    notFound();
  }

  const workspace = space.data;
  const pages = await Page.getPages(numericId);

  return (
    <>
      <Header
        title={workspace.name ?? workspace.key ?? "Workspace"}
        breadcrumb={
          <>
            <Link href="/workspaces" className="hover:text-foreground hover:underline">
              Workspaces
            </Link>
            <ChevronRightIcon className="size-3" />
            <span>{workspace.name}</span>
          </>
        }
        description={`Key: ${workspace.key}`}
        actions={
          <CreatePageDialog workspace={{ id: workspace.id!, key: workspace.key!, name: workspace.name! }} />
        }
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <DetailsSummaryCard
          description={workspace.description?.plain?.value}
          fields={[
            { label: "Type", value: workspace.type ?? "—" },
            { label: "Status", value: workspace.status ?? "—" },
            { label: "Created", value: workspace.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : "—" },
            { label: "Key", value: workspace.key ?? "—" },
          ]}
        />

        <Card>
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Pages</span>
          </CardHeader>
          <CardContent className="space-y-1">
            {pages.length === 0 && (
              <p className="text-sm text-muted-foreground">No pages yet.</p>
            )}
            {pages.map((page) => (
              <Link
                key={page.data.id}
                href={`/workspaces/${workspace.id}/pages/${page.data.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span>{page.data.title}</span>
                <span className="text-xs text-muted-foreground">v{page.data.version?.number}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Permissions &amp; Access
            </span>
            <UpdatePermissionsDialog spaceId={workspace.id} />
          </CardHeader>
          <CardContent>
            <PermissionsTable permissions={mockPermissions} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
