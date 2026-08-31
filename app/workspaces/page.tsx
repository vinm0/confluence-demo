import { Header } from "@/components/layout/header";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceList } from "@/components/workspaces/workspace-list";
import { Space } from "@/lib/confluence/space";
import { Page } from "@/lib/confluence/pages";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const [spaces, pages] = await Promise.all([Space.getSpaces(), Page.getPages()]);

  return (
    <>
      <Header
        title="Workspaces"
        description="Spaces and the pages nested inside them."
        actions={<CreateWorkspaceDialog />}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <WorkspaceList spaces={spaces} pages={pages} />
      </main>
    </>
  );
}
