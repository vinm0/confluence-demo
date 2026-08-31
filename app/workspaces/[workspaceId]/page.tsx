import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DetailsSummaryCard } from "@/components/details/details-summary-card";
import { PermissionsTable } from "@/components/details/permissions-table";
import { UpdatePermissionsDialog } from "@/components/details/update-permissions-dialog";
import { CreatePageDialog } from "@/components/workspaces/create-page-dialog";
import { getPagesForWorkspace, getWorkspaceById, mockPermissions } from "@/lib/mock-data";

interface WorkspaceDetailsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceDetailsPage({ params }: WorkspaceDetailsPageProps) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);

  if (!workspace) {
    notFound();
  }

  const pages = getPagesForWorkspace(workspace.id);

  return (
    <>
      <Header
        title={workspace.name}
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
        actions={<CreatePageDialog workspace={workspace} />}
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <DetailsSummaryCard
          description={workspace.description}
          fields={[
            { label: "Owner", value: workspace.ownerName },
            { label: "Created", value: workspace.createdAt },
            { label: "Page count", value: String(workspace.pageCount) },
            { label: "Key", value: workspace.key },
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
                key={page.id}
                href={`/workspaces/${workspace.id}/pages/${page.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span>{page.title}</span>
                <span className="text-xs text-muted-foreground">v{page.version}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Permissions &amp; Access
            </span>
            <UpdatePermissionsDialog />
          </CardHeader>
          <CardContent>
            <PermissionsTable permissions={mockPermissions} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
