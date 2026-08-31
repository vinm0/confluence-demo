import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DetailsSummaryCard } from "@/components/details/details-summary-card";
import { PermissionsTable } from "@/components/details/permissions-table";
import { UpdatePermissionsDialog } from "@/components/details/update-permissions-dialog";
import { mockPermissions } from "@/lib/mock-data";
import { Space } from "@/lib/confluence/space";
import { Page } from "@/lib/confluence/pages";

interface PageDetailsPageProps {
  params: Promise<{ workspaceId: string; pageId: string }>;
}

const statusVariant = {
  current: "default",
  draft: "secondary",
  archived: "outline",
} as const;

export const dynamic = "force-dynamic";

export default async function PageDetailsPage({ params }: PageDetailsPageProps) {
  const { workspaceId, pageId } = await params;
  const numericWorkspaceId = Number(workspaceId);
  const numericPageId = Number(pageId);

  if (Number.isNaN(numericWorkspaceId) || Number.isNaN(numericPageId)) {
    notFound();
  }

  const [space, page] = await Promise.all([
    Space.getSpaceById(numericWorkspaceId),
    Page.getPageById(numericPageId),
  ]);

  if (!space || !page || page.data.spaceId !== space.data.id) {
    notFound();
  }

  const workspace = space.data;
  const pageData = page.data;
  const lastModified = pageData.version?.createdAt
    ? new Date(pageData.version.createdAt).toLocaleDateString()
    : "—";

  return (
    <>
      <Header
        title={pageData.title ?? "Untitled Page"}
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
            <span>{pageData.title}</span>
          </>
        }
        description={`Version ${pageData.version?.number ?? "—"} · Last modified ${lastModified}`}
        actions={
          <Badge
            variant={statusVariant[pageData.status as keyof typeof statusVariant] ?? "outline"}
            className="capitalize"
          >
            {pageData.status}
          </Badge>
        }
      />
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <DetailsSummaryCard
          fields={[
            { label: "Workspace", value: workspace.name ?? "—" },
            { label: "Author", value: pageData.authorId ?? "—" },
            { label: "Version", value: String(pageData.version?.number ?? "—") },
            { label: "Last modified", value: lastModified },
          ]}
        />

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Permissions &amp; Access
            </span>
            <UpdatePermissionsDialog pageId={pageData.id} />
          </CardHeader>
          <CardContent>
            <PermissionsTable permissions={mockPermissions} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
