import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DetailsSummaryCard } from "@/components/details/details-summary-card";
import { PermissionsTable } from "@/components/details/permissions-table";
import { UpdatePermissionsDialog } from "@/components/details/update-permissions-dialog";
import { getPageById, getWorkspaceById, mockPermissions } from "@/lib/mock-data";

interface PageDetailsPageProps {
  params: Promise<{ workspaceId: string; pageId: string }>;
}

const statusVariant = {
  current: "default",
  draft: "secondary",
  archived: "outline",
} as const;

export default async function PageDetailsPage({ params }: PageDetailsPageProps) {
  const { workspaceId, pageId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  const page = getPageById(pageId);

  if (!workspace || !page || page.workspaceId !== workspace.id) {
    notFound();
  }

  return (
    <>
      <Header
        title={page.title}
        breadcrumb={
          <>
            <Link href="/workspaces" className="hover:text-foreground hover:underline">
              Workspaces
            </Link>
            <ChevronRightIcon className="size-3" />
            <Link
              href={`/workspaces/${workspace.id}`}
              className="hover:text-foreground hover:underline"
            >
              {workspace.name}
            </Link>
            <ChevronRightIcon className="size-3" />
            <span>{page.title}</span>
          </>
        }
        description={`Version ${page.version} · Last modified ${page.lastModified}`}
        actions={
          <Badge variant={statusVariant[page.status]} className="capitalize">
            {page.status}
          </Badge>
        }
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <DetailsSummaryCard
          fields={[
            { label: "Workspace", value: workspace.name },
            { label: "Author", value: page.authorName },
            { label: "Version", value: String(page.version) },
            { label: "Last modified", value: page.lastModified },
          ]}
        />

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
